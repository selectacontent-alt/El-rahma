"""Database models for the Visual Branding & Identity module."""

from __future__ import annotations

import uuid
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from django.utils import timezone

from .validators import (
    validate_brief_goals,
    validate_hex_color,
    validate_lottie_config,
    validate_mockup_mapping,
    validate_safe_json_payload,
    validate_svg_path_data,
    validate_uploaded_brand_asset,
)


def brand_asset_upload_to(instance: models.Model, filename: str) -> str:
    """Store assets in deterministic folders for CDN-friendly delivery."""

    model_folder = instance.__class__.__name__.lower()
    return f"branding/{model_folder}/{uuid.uuid4().hex}/{filename}"


class TimestampedModel(models.Model):
    """Common created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublicationStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    ACTIVE = "active", "Active"
    ARCHIVED = "archived", "Archived"


class BudgetTier(models.TextChoices):
    STARTUP = "startup", "Startup"
    GROWTH = "growth", "Growth"
    PREMIUM = "premium", "Premium"
    ENTERPRISE = "enterprise", "Enterprise"


class InquiryStatus(models.TextChoices):
    NEW = "new", "New"
    QUALIFIED = "qualified", "Qualified"
    PROPOSAL = "proposal", "Proposal"
    WON = "won", "Won"
    LOST = "lost", "Lost"
    SPAM = "spam", "Spam"


class BrandingBlueprint(TimestampedModel):
    """High-level blueprint for the identity-creation journey."""

    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, db_index=True)
    category = models.CharField(max_length=80, db_index=True)
    status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    summary = models.TextField(max_length=1200)
    metadata = models.JSONField(default=dict, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ("sort_order", "title")
        indexes = [
            models.Index(fields=("status", "category", "sort_order"), name="bb_status_cat_sort_idx"),
            models.Index(fields=("slug", "status"), name="bb_slug_status_idx"),
        ]

    def __str__(self) -> str:
        return self.title

    def clean(self) -> None:
        validate_safe_json_payload(self.metadata)


class BrandingBlueprintStep(TimestampedModel):
    """Renderable step with SVG path data and optional Lottie animation JSON."""

    blueprint = models.ForeignKey(
        BrandingBlueprint,
        related_name="steps",
        on_delete=models.CASCADE,
        db_index=True,
    )
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, db_index=True)
    step_key = models.CharField(max_length=80, db_index=True)
    description = models.TextField(max_length=1800)
    svg_path_data = models.TextField(blank=True, validators=[validate_svg_path_data])
    lottie_config = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0, db_index=True)
    is_interactive = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ("sort_order", "id")
        constraints = [
            models.UniqueConstraint(fields=("blueprint", "slug"), name="unique_blueprint_step_slug"),
            models.UniqueConstraint(fields=("blueprint", "step_key"), name="unique_blueprint_step_key"),
        ]
        indexes = [
            models.Index(fields=("blueprint", "sort_order"), name="bbs_blueprint_sort_idx"),
            models.Index(fields=("step_key", "is_interactive"), name="bbs_key_interactive_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.blueprint.slug}: {self.title}"

    def clean(self) -> None:
        validate_lottie_config(self.lottie_config)
        validate_safe_json_payload(self.metadata)


class BrandingPalette(TimestampedModel):
    """Pre-curated identity color system for live frontend palette pickers."""

    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    category = models.CharField(max_length=80, db_index=True)
    status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    primary_hex = models.CharField(max_length=7, validators=[validate_hex_color], db_index=True)
    secondary_hex = models.CharField(max_length=7, validators=[validate_hex_color])
    accent_hex = models.CharField(max_length=7, validators=[validate_hex_color])
    neutral_hex = models.CharField(max_length=7, validators=[validate_hex_color], default="#0f010c")
    mockup_mapping = models.JSONField(default=dict, blank=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    sort_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ("sort_order", "name")
        indexes = [
            models.Index(fields=("status", "category", "sort_order"), name="bp_status_cat_sort_idx"),
            models.Index(fields=("is_featured", "status"), name="bp_featured_status_idx"),
        ]

    def __str__(self) -> str:
        return self.name

    def clean(self) -> None:
        validate_mockup_mapping(self.mockup_mapping)


class PortfolioShowcase(TimestampedModel):
    """Before/after rebranding story for the interactive portfolio slider."""

    client_name = models.CharField(max_length=160, db_index=True)
    slug = models.SlugField(max_length=180, unique=True, db_index=True)
    industry = models.CharField(max_length=100, db_index=True)
    status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    headline = models.CharField(max_length=220)
    story = models.TextField(max_length=3000)
    legacy_logo = models.FileField(upload_to=brand_asset_upload_to, validators=[validate_uploaded_brand_asset])
    legacy_typography = models.CharField(max_length=180)
    legacy_palette = models.JSONField(default=dict, blank=True)
    transformed_logo = models.FileField(upload_to=brand_asset_upload_to, validators=[validate_uploaded_brand_asset])
    transformed_typography = models.CharField(max_length=180)
    transformed_assets = models.JSONField(default=dict, blank=True)
    palette = models.ForeignKey(
        BrandingPalette,
        related_name="showcases",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_index=True,
    )
    published_at = models.DateTimeField(default=timezone.now, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    sort_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ("sort_order", "-published_at")
        indexes = [
            models.Index(fields=("status", "industry", "-published_at"), name="ps_status_ind_pub_idx"),
            models.Index(fields=("is_featured", "status", "sort_order"), name="ps_feat_status_sort_idx"),
        ]

    def __str__(self) -> str:
        return self.client_name

    def clean(self) -> None:
        validate_safe_json_payload(self.legacy_palette)
        validate_safe_json_payload(self.transformed_assets)


class BrandingPackage(TimestampedModel):
    """Bookable branding package used by the instant inquiry funnel."""

    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    tier = models.CharField(max_length=24, choices=BudgetTier.choices, db_index=True)
    status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    starting_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.CharField(
        max_length=3,
        default="USD",
        validators=[RegexValidator(r"^[A-Z]{3}$", "Use a valid ISO 4217 currency code.")],
    )
    estimated_timeline_days = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(365)]
    )
    deliverables = models.JSONField(default=list, blank=True)
    is_priority = models.BooleanField(default=False, db_index=True)
    sort_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ("sort_order", "starting_price")
        indexes = [
            models.Index(fields=("status", "tier", "sort_order"), name="pkg_status_tier_sort_idx"),
            models.Index(fields=("is_priority", "status"), name="pkg_priority_status_idx"),
        ]

    def __str__(self) -> str:
        return self.title

    def clean(self) -> None:
        validate_safe_json_payload(self.deliverables)


class BrandingInquiry(TimestampedModel):
    """Client request entering the branding sales pipeline."""

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    package = models.ForeignKey(
        BrandingPackage,
        related_name="inquiries",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_index=True,
    )
    palette = models.ForeignKey(
        BrandingPalette,
        related_name="inquiries",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_index=True,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="branding_inquiries",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_index=True,
    )
    full_name = models.CharField(max_length=140)
    email = models.EmailField(db_index=True)
    company_name = models.CharField(max_length=160, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    website = models.URLField(max_length=300, blank=True)
    budget_tier = models.CharField(max_length=24, choices=BudgetTier.choices, db_index=True)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    project_summary = models.TextField(max_length=3000)
    goals = models.JSONField(default=list, blank=True, validators=[validate_brief_goals])
    status = models.CharField(
        max_length=24,
        choices=InquiryStatus.choices,
        default=InquiryStatus.NEW,
        db_index=True,
    )
    source = models.CharField(max_length=80, default="branding_page", db_index=True)
    utm_payload = models.JSONField(default=dict, blank=True)
    client_ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True)
    last_status_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("status", "-created_at"), name="inq_status_created_idx"),
            models.Index(fields=("budget_tier", "status"), name="inq_tier_status_idx"),
            models.Index(fields=("email", "-created_at"), name="inq_email_created_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.full_name} - {self.budget_tier}"

    def clean(self) -> None:
        validate_safe_json_payload(self.utm_payload)
        if self.budget_min is not None and self.budget_max is not None and self.budget_min > self.budget_max:
            raise ValidationError({"budget_max": "budget_max must be greater than or equal to budget_min."})


class BrandingInquiryStatusEvent(TimestampedModel):
    """Auditable status history for real-time inquiry tracking."""

    inquiry = models.ForeignKey(
        BrandingInquiry,
        related_name="status_events",
        on_delete=models.CASCADE,
        db_index=True,
    )
    status = models.CharField(max_length=24, choices=InquiryStatus.choices, db_index=True)
    note = models.CharField(max_length=500, blank=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="branding_status_events",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_index=True,
    )

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("inquiry", "-created_at"), name="inq_event_inquiry_created_idx"),
            models.Index(fields=("status", "-created_at"), name="inq_event_status_created_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.inquiry.public_id}: {self.status}"
