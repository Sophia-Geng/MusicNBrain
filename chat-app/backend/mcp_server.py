"""
MusicNBrain MCP Server - Concert Program Tools
Tools for parsing program text, generating PDFs, and fixing errors.
"""

from fastmcp import FastMCP
import json
import logging
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("mcp_server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

mcp = FastMCP("musicnbrain")

# ============================================================
# In-memory store for the current program data
# This persists across tool calls within the same session
# ============================================================
CURRENT_PROGRAM = {
    "concert_title": "",
    "concert_date": "",
    "concert_time": "",
    "concert_venue": "",
    "concert_type": "OFFLINE",
    "performances": []
}


def _get_llm_client():
    """Get the Gemini/GenAI client based on available credentials."""
    from google import genai
    
    project_id = os.getenv("PROJECT_ID")
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if project_id:
        return genai.Client(vertexai=True, project=project_id, location=os.getenv("LOCATION", "us-central1"))
    elif api_key:
        return genai.Client(api_key=api_key)
    else:
        raise ValueError("Neither PROJECT_ID nor GOOGLE_API_KEY found. Cannot initialize LLM client.")


@mcp.tool
def parse_program_text(raw_text: str, concert_title: str = "", concert_date: str = "", concert_time: str = "", venue: str = "") -> str:
    """
    Parse raw program text (from email, CSV, or free-text) into structured concert program data.
    The AI will extract student names, piece names, instruments, duration, and performance order.
    
    Args:
        raw_text: The raw text containing the program list (pasted from email, CSV, etc.)
        concert_title: Optional title for the concert
        concert_date: Optional date for the concert (e.g. "March 15, 2026")
        concert_time: Optional start time (e.g. "2:00 PM")
        venue: Optional venue name/address
    """
    global CURRENT_PROGRAM
    logger.info(f"Parsing program text: {raw_text[:100]}...")
    
    try:
        client = _get_llm_client()
        
        prompt = f"""You are a music concert program parser. Extract structured data from the teacher's input.
Return ONLY valid JSON with no markdown formatting, no backticks, no explanation.

The JSON must have this exact structure:
{{
    "performances": [
        {{
            "order": 1,
            "student_name": "Student Name",
            "piece_name": "Piece Name (Composer)",
            "instrument": "Piano",
            "estimated_duration_minutes": 4
        }}
    ]
}}

Rules:
- If instrument is not mentioned, guess based on context or use "Piano" as default
- If duration is not mentioned, estimate based on the piece (most pieces are 3-6 minutes)
- If composer is mentioned, include it in parentheses after the piece name
- Keep the original performance order
- Handle messy formats: emails, CSVs, numbered lists, free text

Input text to parse:
{raw_text}"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt]
        )
        
        result_text = response.text.strip()
        # Clean up potential markdown formatting
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1]
            if result_text.endswith("```"):
                result_text = result_text[:-3].strip()
        
        parsed = json.loads(result_text)
        
        # Update the in-memory program store
        CURRENT_PROGRAM["performances"] = parsed.get("performances", [])
        if concert_title:
            CURRENT_PROGRAM["concert_title"] = concert_title
        if concert_date:
            CURRENT_PROGRAM["concert_date"] = concert_date
        if concert_time:
            CURRENT_PROGRAM["concert_time"] = concert_time
        if venue:
            CURRENT_PROGRAM["concert_venue"] = venue
        
        # Build a readable summary
        num_performers = len(CURRENT_PROGRAM["performances"])
        total_minutes = sum(p.get("estimated_duration_minutes", 0) for p in CURRENT_PROGRAM["performances"])
        
        summary_lines = [f"Successfully parsed {num_performers} performances (total ~{total_minutes} minutes):"]
        for p in CURRENT_PROGRAM["performances"]:
            summary_lines.append(
                f"  {p['order']}. {p['student_name']} — {p['piece_name']} "
                f"({p.get('instrument', 'N/A')}, ~{p.get('estimated_duration_minutes', '?')} min)"
            )
        
        return "\n".join(summary_lines)
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM response as JSON: {e}")
        return f"Error: Could not parse the program text. The AI response was not valid JSON. Please try again with clearer formatting."
    except Exception as e:
        logger.error(f"Error parsing program text: {e}")
        return f"Error parsing program text: {str(e)}"


@mcp.tool
def fix_program_data(fix_instruction: str) -> str:
    """
    Fix errors in the current program data based on the teacher's natural language instruction.
    For example: "Tommy Chen should be Tommy Chang" or "The third piece is actually Moonlight Sonata"
    
    Args:
        fix_instruction: Natural language description of what to fix (e.g. "Tommy Chen should be Tommy Chang")
    """
    global CURRENT_PROGRAM
    logger.info(f"Fixing program data: {fix_instruction}")
    
    if not CURRENT_PROGRAM["performances"]:
        return "Error: No program data to fix. Please parse a program first."
    
    try:
        client = _get_llm_client()
        
        current_data = json.dumps(CURRENT_PROGRAM, indent=2)
        
        prompt = f"""You are a data correction assistant. The user wants to fix some data in a concert program.

Current program data:
{current_data}

User's correction instruction:
{fix_instruction}

Apply the correction and return the COMPLETE updated program data as valid JSON.
Return ONLY the JSON, no markdown, no backticks, no explanation.
Keep the exact same JSON structure, only change what the user asked to fix."""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt]
        )
        
        result_text = response.text.strip()
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1]
            if result_text.endswith("```"):
                result_text = result_text[:-3].strip()
        
        updated = json.loads(result_text)
        CURRENT_PROGRAM.update(updated)
        
        # Build summary of what changed
        summary_lines = ["Program data updated successfully. Current program:"]
        for p in CURRENT_PROGRAM.get("performances", []):
            summary_lines.append(
                f"  {p['order']}. {p['student_name']} — {p['piece_name']} "
                f"({p.get('instrument', 'N/A')}, ~{p.get('estimated_duration_minutes', '?')} min)"
            )
        
        return "\n".join(summary_lines)
        
    except Exception as e:
        logger.error(f"Error fixing program data: {e}")
        return f"Error fixing program data: {str(e)}"


# ============================================================
# Default theme (fallback)
# ============================================================
DEFAULT_THEME = {
    "name": "Default",
    "bg_color": "#1a1a2e",
    "accent_color": "#c9a84c",
    "text_color": "#2d2d2d",
    "subtitle_color": "#666666",
    "header_decoration": "*  *  *",
    "footer_decoration": "*  *  *",
    "layout": "list",
    "font_style": "serif",
    "title_size": 28,
}

FONT_MAP = {
    "serif": {"title": "Times-Bold", "body": "Times-Roman", "italic": "Times-Italic"},
    "sans-serif": {"title": "Helvetica-Bold", "body": "Helvetica", "italic": "Helvetica-Oblique"},
}

# Cache generated themes to avoid repeated API calls
_THEME_CACHE = {}


def _generate_theme_from_description(style_description: str) -> dict:
    # Check cache first
    cache_key = style_description.lower().strip()
    if cache_key in _THEME_CACHE:
        logger.info(f"Using cached theme for: {cache_key}")
        return _THEME_CACHE[cache_key]
    """Use LLM to generate a PDF color/style theme from natural language description."""
    try:
        client = _get_llm_client()
        
        prompt = f"""You are a graphic designer. Based on the user's style description, generate a color theme for a concert program PDF.

User's style request: "{style_description}"

Return ONLY valid JSON with no markdown, no backticks, no explanation. The JSON must have this exact structure:
{{
    "name": "Theme Name (2-3 words)",
    "bg_color": "#hexcolor (dark color for table header background)",
    "accent_color": "#hexcolor (decorative lines and accents)",
    "text_color": "#hexcolor (main text, should be dark and readable)",
    "subtitle_color": "#hexcolor (lighter secondary text)",
    "header_decoration": "short decorative text or symbols for section divider, e.g. snowflakes, stars, musical notes, waves. Use unicode symbols. Max 20 chars",
    "footer_decoration": "short decorative text or symbols for footer area. Use unicode symbols. Max 20 chars",
    "layout": "list or table (list=centered piece-by-piece, table=structured grid)",
    "font_style": "serif or sans-serif",
    "title_size": 28
}}

Rules:
- Colors must be valid hex codes
- text_color must be dark enough to read on white background
- bg_color should work well with white text on top
- Match the mood: Christmas=red/green/gold, Summer=blue/cyan/light, Elegant=gold/navy, etc.
- header_decoration should use thematic unicode symbols (e.g. Christmas: snowflakes, stars; Summer: waves, sun; Music: notes)
- Choose serif for formal/classical, sans-serif for modern/casual"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt]
        )
        
        result_text = response.text.strip()
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1]
            if result_text.endswith("```"):
                result_text = result_text[:-3].strip()
        
        theme = json.loads(result_text)
        
        # Validate required fields
        required = ["name", "bg_color", "accent_color", "text_color", "subtitle_color"]
        for field in required:
            if field not in theme:
                theme[field] = DEFAULT_THEME[field]
        
        # Set defaults for optional fields
        theme.setdefault("header_decoration", "*  *  *")
        theme.setdefault("footer_decoration", "*  *  *")
        theme.setdefault("layout", "list")
        theme.setdefault("font_style", "serif")
        theme.setdefault("title_size", 28)
        
        logger.info(f"Generated theme: {theme['name']} for description: {style_description}")
        return theme
        
    except Exception as e:
        logger.error(f"Error generating theme: {e}. Using default.")
        return DEFAULT_THEME


@mcp.tool
def generate_program_pdf(concert_title: str = "", concert_date: str = "", concert_time: str = "", venue: str = "", style: str = "elegant") -> str:
    """
    Generate a printable concert program PDF from the current program data.
    The style can be ANY natural language description and the AI will generate matching colors and design.
    
    Args:
        concert_title: Override title (uses stored title if empty)
        concert_date: Override date (uses stored date if empty)  
        concert_time: Override time (uses stored time if empty)
        venue: Override venue (uses stored venue if empty)
        style: Any style description in natural language. Examples: "Christmas red and green", "summer beach vibes", "elegant gold", "modern minimalist", "cherry blossom spring", "dark gothic". The AI will generate matching colors and decorations.
    """
    global CURRENT_PROGRAM
    logger.info(f"Generating program PDF with style '{style}'...")
    
    if not CURRENT_PROGRAM["performances"]:
        return "Error: No program data available. Please parse a program first using parse_program_text."
    
    # Use overrides or stored values
    title = concert_title or CURRENT_PROGRAM.get("concert_title", "Concert Program")
    date = concert_date or CURRENT_PROGRAM.get("concert_date", "")
    time_str = concert_time or CURRENT_PROGRAM.get("concert_time", "")
    venue_str = venue or CURRENT_PROGRAM.get("concert_venue", "")
    
    # Generate theme from natural language description using AI
    theme = _generate_theme_from_description(style)
    
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.units import inch
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib import colors
        
        output_path = os.path.join("static", "concert_program.pdf")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=60,
            bottomMargin=60
        )
        
        styles = getSampleStyleSheet()
        
        # Resolve fonts from theme
        font_style = theme.get("font_style", "serif")
        fonts = FONT_MAP.get(font_style, FONT_MAP["serif"])
        
        # Theme-based styles
        title_style = ParagraphStyle(
            'ConcertTitle',
            parent=styles['Title'],
            fontSize=theme.get("title_size", 28),
            spaceAfter=8,
            alignment=TA_CENTER,
            fontName=fonts["title"],
            textColor=colors.HexColor(theme["text_color"])
        )
        
        subtitle_style = ParagraphStyle(
            'ConcertSubtitle',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=4,
            alignment=TA_CENTER,
            fontName=fonts["italic"],
            textColor=colors.HexColor(theme["subtitle_color"])
        )
        
        divider_style = ParagraphStyle(
            'Divider',
            parent=styles['Normal'],
            fontSize=14,
            spaceBefore=16,
            spaceAfter=16,
            alignment=TA_CENTER,
            fontName=fonts["title"],
            textColor=colors.HexColor(theme["accent_color"]),
        )
        
        # Build the PDF content
        story = []
        
        # Top border line
        story.append(Spacer(1, 0.3 * inch))
        story.append(HRFlowable(
            width="80%", thickness=1.5,
            color=colors.HexColor(theme["accent_color"]),
            spaceAfter=20, spaceBefore=0
        ))
        
        # Title
        story.append(Spacer(1, 0.2 * inch))
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 0.1 * inch))
        
        # Date, Time, Venue
        info_parts = []
        if date:
            info_parts.append(date)
        if time_str:
            info_parts.append(time_str)
        if info_parts:
            story.append(Paragraph("  |  ".join(info_parts), subtitle_style))
        if venue_str:
            story.append(Paragraph(venue_str, subtitle_style))
        
        story.append(Spacer(1, 0.15 * inch))
        
        # Divider with theme decoration
        decoration = theme.get("header_decoration", "*  *  *")
        story.append(Paragraph(decoration, divider_style))
        story.append(Spacer(1, 0.15 * inch))
        
        # Performance list — card style instead of table
        num_performers = len(CURRENT_PROGRAM["performances"])
        total_minutes = sum(p.get("estimated_duration_minutes", 0) for p in CURRENT_PROGRAM["performances"])
        
        layout = theme.get("layout", "list")
        if layout == "list":
            # Elegant/Classic: List style with dotted separators
            for i, p in enumerate(CURRENT_PROGRAM["performances"]):
                order = p.get("order", i + 1)
                name = p.get("student_name", "")
                piece = p.get("piece_name", "")
                instrument = p.get("instrument", "")
                duration = p.get("estimated_duration_minutes", "?")
                
                # Piece name (bold, larger)
                piece_style = ParagraphStyle(
                    f'Piece_{i}',
                    parent=styles['Normal'],
                    fontSize=12,
                    fontName=fonts["title"],
                    textColor=colors.HexColor(theme["text_color"]),
                    alignment=TA_CENTER,
                    spaceAfter=2
                )
                story.append(Paragraph(piece, piece_style))
                
                # Performer + instrument + duration
                detail_style = ParagraphStyle(
                    f'Detail_{i}',
                    parent=styles['Normal'],
                    fontSize=10,
                    fontName=fonts["italic"],
                    textColor=colors.HexColor(theme["subtitle_color"]),
                    alignment=TA_CENTER,
                    spaceAfter=8
                )
                detail_text = name
                if instrument:
                    detail_text += f", {instrument}"
                detail_text += f"  ({duration} min)"
                story.append(Paragraph(detail_text, detail_style))
                
                # Separator between pieces
                if i < num_performers - 1:
                    story.append(HRFlowable(
                        width="30%", thickness=0.5,
                        color=colors.HexColor('#cccccc'),
                        spaceAfter=10, spaceBefore=4
                    ))
        else:
            # Modern/Minimal: Clean table style
            table_data = [["#", "Performer", "Piece", "Instrument", "Duration"]]
            for p in CURRENT_PROGRAM["performances"]:
                table_data.append([
                    str(p.get("order", "")),
                    p.get("student_name", ""),
                    p.get("piece_name", ""),
                    p.get("instrument", ""),
                    f"{p.get('estimated_duration_minutes', '?')} min"
                ])
            
            table = Table(table_data, colWidths=[0.4*inch, 1.5*inch, 2.2*inch, 1.0*inch, 0.7*inch])
            
            table_styles = [
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(theme["bg_color"])),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), fonts["title"]),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTNAME', (0, 1), (-1, -1), fonts["body"]),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
                ('ALIGN', (1, 1), (2, -1), 'LEFT'),
            ]
            
            if layout == "table":
                table_styles.append(('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor(theme["accent_color"])))
                table_styles.append(('LINEBELOW', (0, 1), (-1, -2), 0.5, colors.HexColor('#eeeeee')))
            else:  # minimal
                table_styles.append(('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor('#dddddd')))
            
            table.setStyle(TableStyle(table_styles))
            story.append(table)
        
        # Footer
        story.append(Spacer(1, 0.4 * inch))
        
        # Footer decoration
        footer_dec = theme.get("footer_decoration", "")
        if footer_dec:
            footer_dec_style = ParagraphStyle(
                'FooterDec', parent=styles['Normal'],
                fontSize=12, alignment=TA_CENTER,
                textColor=colors.HexColor(theme["accent_color"]),
            )
            story.append(Paragraph(footer_dec, footer_dec_style))
            story.append(Spacer(1, 0.1 * inch))
        
        story.append(HRFlowable(
            width="80%", thickness=1.5,
            color=colors.HexColor(theme["accent_color"]),
            spaceAfter=12, spaceBefore=0
        ))
        
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#999999'),
            fontName=fonts["italic"]
        )
        story.append(Paragraph(f"{num_performers} performances  \u00b7  Approximately {total_minutes} minutes", footer_style))
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph("Generated by MusicNBrain", footer_style))
        
        # Build PDF
        doc.build(story)
        
        logger.info(f"PDF generated at: {output_path}")
        return f"Done! Concert program PDF generated in '{theme['name']}' style with {num_performers} performances. Saved at concert_program.pdf. Available styles: classic, elegant, modern, minimal."
        
    except ImportError:
        logger.error("reportlab not installed")
        return "Error: reportlab library not installed. Please install it with: pip install reportlab"
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        return f"Error generating PDF: {str(e)}"


@mcp.tool
def get_current_program() -> str:
    """
    Get the current program data as a readable summary.
    Use this to check what data is currently loaded.
    """
    if not CURRENT_PROGRAM["performances"]:
        return "No program data loaded yet. Please parse a program first."
    
    lines = []
    if CURRENT_PROGRAM.get("concert_title"):
        lines.append(f"Concert: {CURRENT_PROGRAM['concert_title']}")
    if CURRENT_PROGRAM.get("concert_date"):
        lines.append(f"Date: {CURRENT_PROGRAM['concert_date']}")
    if CURRENT_PROGRAM.get("concert_time"):
        lines.append(f"Time: {CURRENT_PROGRAM['concert_time']}")
    if CURRENT_PROGRAM.get("concert_venue"):
        lines.append(f"Venue: {CURRENT_PROGRAM['concert_venue']}")
    
    lines.append(f"\nProgram ({len(CURRENT_PROGRAM['performances'])} performances):")
    for p in CURRENT_PROGRAM["performances"]:
        lines.append(
            f"  {p['order']}. {p['student_name']} — {p['piece_name']} "
            f"({p.get('instrument', 'N/A')}, ~{p.get('estimated_duration_minutes', '?')} min)"
        )
    
    return "\n".join(lines)


@mcp.tool
def update_concert_info(concert_title: str = "", concert_date: str = "", concert_time: str = "", venue: str = "", concert_type: str = "") -> str:
    """
    Update concert metadata (title, date, time, venue, type).
    
    Args:
        concert_title: The title of the concert
        concert_date: The date (e.g. "March 15, 2026")
        concert_time: The start time (e.g. "2:00 PM")
        venue: The venue name and/or address
        concert_type: ONLINE or OFFLINE
    """
    global CURRENT_PROGRAM
    
    if concert_title:
        CURRENT_PROGRAM["concert_title"] = concert_title
    if concert_date:
        CURRENT_PROGRAM["concert_date"] = concert_date
    if concert_time:
        CURRENT_PROGRAM["concert_time"] = concert_time
    if venue:
        CURRENT_PROGRAM["concert_venue"] = venue
    if concert_type:
        CURRENT_PROGRAM["concert_type"] = concert_type.upper()
    
    return f"Concert info updated: {CURRENT_PROGRAM.get('concert_title', 'Untitled')} on {CURRENT_PROGRAM.get('concert_date', 'TBD')} at {CURRENT_PROGRAM.get('concert_venue', 'TBD')}"


if __name__ == "__main__":
    mcp.run()
