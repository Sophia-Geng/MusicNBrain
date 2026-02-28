# MusicNBrain Chat App

A simple chat-based concert program assistant, built on Google ADK + MCP architecture.

## Architecture

```
Teacher (Chat UI)
    │
    │  POST /api/chat (natural language + optional file)
    ▼
FastAPI Backend (main.py)
    │
    │  ADK Runner → Agent
    ▼
Concert Agent (agent.py)
    │
    │  Gemini LLM decides which tool to call
    ▼
MCP Server (mcp_server.py)
    ├── parse_program_text()    → AI parses raw text into structured data
    ├── fix_program_data()      → AI fixes errors based on teacher's instruction
    ├── generate_program_pdf()  → Generates printable PDF using reportlab
    ├── get_current_program()   → Shows current program data
    └── update_concert_info()   → Updates concert metadata
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY (get one at https://aistudio.google.com/apikey)
uv sync
uv run python main.py
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Or use the startup script (Linux/Mac/Cloud Shell)

```bash
chmod +x start_app.sh
./start_app.sh
```

Then open http://localhost:5173

## Usage Flow (Feng Mao's Scenario)

1. Teacher pastes program text → "generate a program pdf for Spring Recital, March 15"
2. AI parses text → generates PDF → returns download link
3. Teacher finds error → "Tommy Chen should be Tommy Chang"  
4. AI fixes data → regenerates PDF → returns updated link

## Based On

This is adapted from Annie Wang's [holiday_workshop](https://github.com/cuppibla/holiday_workshop) 
codelab (03-Connect-ADK-MCP-UI), replacing Christmas card generation tools with 
concert program management tools.
