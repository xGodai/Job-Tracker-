import os
from django import template

register = template.Library()


@register.filter
def basename(value):
    """Return only the filename portion of a path or FileField value.

    Usage in template: {{ some_filefield.name|basename }}
    """
    if not value:
        return ''
    try:
        return os.path.basename(str(value))
    except Exception:
        return str(value)
