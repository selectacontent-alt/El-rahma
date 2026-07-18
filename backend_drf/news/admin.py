"""Admin registrations for S C News."""

from __future__ import annotations

from django.contrib import admin

from .models import NewsArticle, NewsAuthor, NewsCategory, NewsTag, NewsletterSubscriber


@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_ar", "slug", "status", "sort_order", "updated_at")
    list_filter = ("status",)
    search_fields = ("name_ar", "name_en", "slug")
    prepopulated_fields = {"slug": ("name_ar",)}


@admin.register(NewsTag)
class NewsTagAdmin(admin.ModelAdmin):
    list_display = ("name_ar", "slug", "updated_at")
    search_fields = ("name_ar", "name_en", "slug")
    prepopulated_fields = {"slug": ("name_ar",)}


@admin.register(NewsAuthor)
class NewsAuthorAdmin(admin.ModelAdmin):
    list_display = ("name_ar", "title_ar", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name_ar", "name_en", "slug", "title_ar")
    prepopulated_fields = {"slug": ("name_ar",)}


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title_ar",
        "category",
        "article_type",
        "status",
        "is_featured",
        "is_breaking",
        "is_trending",
        "published_at",
    )
    list_filter = ("status", "article_type", "category", "is_featured", "is_breaking", "is_trending")
    search_fields = ("title_ar", "title_en", "slug", "excerpt_ar")
    prepopulated_fields = {"slug": ("title_ar",)}
    autocomplete_fields = ("category", "author")
    filter_horizontal = ("tags",)
    date_hierarchy = "published_at"


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "source", "is_active", "created_at")
    list_filter = ("is_active", "source")
    search_fields = ("email",)
