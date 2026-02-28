"""
MusicNBrain Backend - FastAPI server
Handles chat messages and serves generated files.
Based on the holiday_workshop 03-Connect-ADK-MCP-UI architecture.
"""

import os
import time
import logging
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.genai import types

from agent import concert_agent

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION", "us-central1")

if PROJECT_ID:
    try:
        import vertexai
        if "GOOGLE_API_KEY" in os.environ:
            logger.info("Unsetting GOOGLE_API_KEY to avoid conflict with Vertex AI.")
            del os.environ["GOOGLE_API_KEY"]
        vertexai.init(project=PROJECT_ID, location=LOCATION)
    except ImportError:
        logger.warning("vertexai not installed. Using API key mode instead.")

# ============================================================
# FastAPI App
# ============================================================
app = FastAPI(title="MusicNBrain Concert Assistant API")

os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_origin_regex="https?://.*(localhost|run\\.app)(:\\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# ADK Runner setup
# ============================================================
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()

runner = Runner(
    app_name="musicnbrain",
    agent=concert_agent,
    session_service=session_service,
    memory_service=memory_service,
)

CURRENT_SESSION_ID = None


@app.post("/api/chat")
async def chat_endpoint(
    message: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    """
    Chat endpoint - accepts text message and optional file upload.
    """
    global CURRENT_SESSION_ID

    try:
        user_input = message
        
        # Handle file upload (e.g., photo of a handwritten program)
        if file:
            file_location = f"static/uploads/{file.filename}"
            abs_file_location = os.path.abspath(file_location)
            with open(file_location, "wb+") as f:
                shutil.copyfileobj(file.file, f)
            logger.info(f"File saved to {abs_file_location}")
            user_input += f"\n[System: User uploaded a file. It is saved at: {abs_file_location}]"

        user_id = "demo_user"
        session = None

        # Try existing session
        if CURRENT_SESSION_ID:
            try:
                session = await session_service.get_session(
                    app_name="musicnbrain",
                    session_id=CURRENT_SESSION_ID,
                    user_id=user_id
                )
            except Exception as e:
                logger.warning(f"Failed to retrieve session: {e}")
                CURRENT_SESSION_ID = None

        # Create new session if needed
        if not session:
            try:
                session = await session_service.create_session(
                    app_name="musicnbrain",
                    session_id="demo_session",
                    user_id=user_id
                )
                CURRENT_SESSION_ID = session.id
                logger.info(f"New session created: {session.id}")
            except Exception as e:
                logger.error(f"Failed to create session: {e}")
                raise HTTPException(status_code=500, detail=str(e))

        # Create message content
        content = types.Content(role="user", parts=[{"text": user_input}])

        # Run the agent
        final_response_text = ""
        generated_file_url = None

        async for event in runner.run_async(
            user_id=user_id,
            session_id=CURRENT_SESSION_ID,
            new_message=content
        ):
            if event.is_final_response():
                if event.content and event.content.parts:
                    final_response_text = event.content.parts[0].text

                    # Check if a PDF was recently generated
                    pdf_path = os.path.join("static", "concert_program.pdf")
                    if os.path.exists(pdf_path):
                        mtime = os.path.getmtime(pdf_path)
                        if time.time() - mtime < 30:  # Generated in last 30 seconds
                            generated_file_url = f"/static/concert_program.pdf?t={int(time.time())}"

        if not final_response_text:
            final_response_text = "Sorry, I didn't get a response. Please try again."

        return {
            "response": final_response_text,
            "generated_file": generated_file_url
        }

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "MusicNBrain Concert Assistant"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
