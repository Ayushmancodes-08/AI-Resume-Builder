import os
import tempfile
import logging

logger = logging.getLogger(__name__)

try:
    from weasyprint import HTML, CSS
    HAS_WEASYPRINT = True
    # Basic A4 styling ensuring standard PDF layout
    A4_CSS = CSS(string='''
        @page {
            size: A4;
            margin: 1cm;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
        }
    ''')
except Exception as e:
    logger.warning(f"Weasyprint could not be loaded, falling back to stub PDF generation. Error: {e}")
    HAS_WEASYPRINT = False
    A4_CSS = None

def generate_pdf_from_html(html_content: str, template_css: str = "") -> bytes:
    """
    Generate an A4 PDF from an HTML string using Weasyprint.
    Returns the PDF as raw bytes.
    """
    try:
        if not HAS_WEASYPRINT:
            logger.info("Weasyprint not available, returning raw HTML content as fallback bytes")
            return html_content.encode('utf-8')

        # Include base A4 styling and any template-specific CSS
        stylesheets = [A4_CSS]
        if template_css:
            stylesheets.append(CSS(string=template_css))
            
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf(stylesheets=stylesheets)
        
        return pdf_bytes
    except Exception as e:
        logger.error(f"Failed to generate PDF: {str(e)}")
        raise Exception(f"PDF Generation failed: {str(e)}")

def export_resume(resume_data: dict, template_id: str) -> bytes:
    """
    Service wrapper that would normally load a Jinja2 template,
    render the resume_data into HTML, and pass it to Weasyprint.
    """
    # For architecture purposes, we simulate the HTML rendering
    # In production, use Jinja2: template.render(**resume_data)
    
    html_content = f"""
    <html>
    <head><title>{resume_data.get('title', 'Resume')}</title></head>
    <body>
        <h1>{resume_data.get('personalInfo', {}).get('name', 'Name')}</h1>
        <p>{resume_data.get('personalInfo', {}).get('title', 'Professional Title')}</p>
        <hr>
        <h2>Experience</h2>
        <p>Your experience details here...</p>
        <p>Template ID used: {template_id}</p>
    </body>
    </html>
    """
    
    return generate_pdf_from_html(html_content)
