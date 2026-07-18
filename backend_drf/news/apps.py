"""Django app configuration for the S C News CMS."""

from __future__ import annotations

from django.apps import AppConfig


class NewsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "news"
    verbose_name = "S C News"
