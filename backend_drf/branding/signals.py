"""Cache invalidation signals for branding content."""

from __future__ import annotations

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .cache import bump_branding_cache_version
from .models import (
    BrandingBlueprint,
    BrandingBlueprintStep,
    BrandingInquiry,
    BrandingInquiryStatusEvent,
    BrandingPackage,
    BrandingPalette,
    PortfolioShowcase,
)


@receiver(post_save, sender=BrandingBlueprint)
@receiver(post_delete, sender=BrandingBlueprint)
@receiver(post_save, sender=BrandingBlueprintStep)
@receiver(post_delete, sender=BrandingBlueprintStep)
@receiver(post_save, sender=BrandingPalette)
@receiver(post_delete, sender=BrandingPalette)
@receiver(post_save, sender=PortfolioShowcase)
@receiver(post_delete, sender=PortfolioShowcase)
@receiver(post_save, sender=BrandingPackage)
@receiver(post_delete, sender=BrandingPackage)
@receiver(post_save, sender=BrandingInquiry)
@receiver(post_delete, sender=BrandingInquiry)
@receiver(post_save, sender=BrandingInquiryStatusEvent)
@receiver(post_delete, sender=BrandingInquiryStatusEvent)
def invalidate_branding_cache(**_: object) -> None:
    """Invalidate branding API caches after administrative data changes."""

    bump_branding_cache_version()
