"""Branding application configuration."""

from __future__ import annotations

from django.apps import AppConfig


class BrandingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "branding"

    def ready(self) -> None:
        from . import signals  # noqa: F401
