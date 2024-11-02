import bleach

# Define allowed HTML tags and attributes globally
ALLOWED_TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'span', 'div'
]

ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target'],
    'span': ['style'],
    'div': ['style'],
}

def sanitize_html(html_content):
    """
    Sanitize HTML content to prevent XSS attacks.

    Args:
        html_content (str): The HTML content to sanitize.

    Returns:
        str: The sanitized HTML content.
    """
    sanitized_content = bleach.clean(
        html_content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )
    return sanitized_content
