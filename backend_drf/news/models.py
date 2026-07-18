"""CMS models for S C News."""

from __future__ import annotations

import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


def news_asset_upload_to(instance: models.Model, filename: str) -> str:
    model_folder = instance.__class__.__name__.lower()
    return f"news/{model_folder}/{uuid.uuid4().hex}/{filename}"


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublicationStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class ArticleType(models.TextChoices):
    NEWS = "news", "News"
    COMPANY_UPDATE = "company_update", "Company update"
    GUIDE = "guide", "Guide"
    VIDEO = "video", "Video"
    CASE_STUDY = "case_study", "Case study"


class NewsCategory(TimestampedModel):
    name_ar = models.CharField(max_length=120)
    name_en = models.CharField(max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True, db_index=True)
    description_ar = models.TextField(max_length=700, blank=True)
    description_en = models.TextField(max_length=700, blank=True)
    status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.PUBLISHED,
        db_index=True,
    )
    sort_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ("sort_order", "name_ar")
        verbose_name_plural = "News categories"
        indexes = [
            models.Index(fields=("status", "sort_order"), name="news_cat_status_sort_idx"),
        ]

    def __str__(self) -> str:
        return self.name_ar


class NewsTag(TimestampedModel):
    name_ar = models.CharField(max_length=80)
    name_en = models.CharField(max_length=80, blank=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)

    class Meta:
        ordering = ("name_ar",)

    def __str__(self) -> str:
        return self.name_ar


class NewsAuthor(TimestampedModel):
    name_ar = models.CharField(max_length=120)
    name_en = models.CharField(max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True, db_index=True)
    title_ar = models.CharField(max_length=140, blank=True)
    title_en = models.CharField(max_length=140, blank=True)
    bio_ar = models.TextField(max_length=1200, blank=True)
    bio_en = models.TextField(max_length=1200, blank=True)
    avatar = models.ImageField(upload_to=news_asset_upload_to, blank=True)
    social_links = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ("name_ar",)

    def __str__(self) -> str:
        return self.name_ar


class NewsArticle(TimestampedModel):
    title_ar = models.CharField(max_length=220)
    title_en = models.CharField(max_length=220, blank=True)
    slug = models.SlugField(max_length=240, unique=True, db_index=True)
    excerpt_ar = models.TextField(max_length=600)
    excerpt_en = models.TextField(max_length=600, blank=True)
    body_ar = models.TextField()
    body_en = models.TextField(blank=True)
    featured_image = models.ImageField(upload_to=news_asset_upload_to, blank=True)
    image_alt_ar = models.CharField(max_length=180, blank=True)
    image_alt_en = models.CharField(max_length=180, blank=True)
    category = models.ForeignKey(
        NewsCategory,
        related_name="articles",
        on_delete=models.PROTECT,
        db_index=True,
    )
    tags = models.ManyToManyField(NewsTag, related_name="articles", blank=True)
    author = models.ForeignKey(
        NewsAuthor,
        related_name="articles",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_index=True,
    )
    article_type = models.CharField(
        max_length=24,
        choices=ArticleType.choices,
        default=ArticleType.NEWS,
        db_index=True,
    )
    status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    is_featured = models.BooleanField(default=False, db_index=True)
    is_breaking = models.BooleanField(default=False, db_index=True)
    is_trending = models.BooleanField(default=False, db_index=True)
    published_at = models.DateTimeField(default=timezone.now, db_index=True)
    read_time_minutes = models.PositiveSmallIntegerField(default=4, validators=[MinValueValidator(1)])
    views_count = models.PositiveIntegerField(default=0, db_index=True)
    meta_title_ar = models.CharField(max_length=180, blank=True)
    meta_title_en = models.CharField(max_length=180, blank=True)
    meta_description_ar = models.CharField(max_length=220, blank=True)
    meta_description_en = models.CharField(max_length=220, blank=True)

    class Meta:
        ordering = ("-published_at", "-created_at")
        indexes = [
            models.Index(fields=("status", "-published_at"), name="news_article_status_pub_idx"),
            models.Index(fields=("article_type", "status", "-published_at"), name="news_article_type_status_idx"),
            models.Index(fields=("category", "status", "-published_at"), name="news_article_cat_status_idx"),
            models.Index(fields=("is_featured", "status", "-published_at"), name="news_article_featured_idx"),
            models.Index(fields=("is_breaking", "status", "-published_at"), name="news_article_breaking_idx"),
            models.Index(fields=("is_trending", "status", "-published_at"), name="news_article_trending_idx"),
        ]

    def __str__(self) -> str:
        return self.title_ar


class NewsletterSubscriber(TimestampedModel):
    email = models.EmailField(unique=True, db_index=True)
    source = models.CharField(max_length=80, default="sc_news")
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.email
