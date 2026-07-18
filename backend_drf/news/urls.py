"""URL routes for S C News."""

from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NewsArticleViewSet, NewsCategoryViewSet, NewsletterSubscriberViewSet, news_home

router = DefaultRouter()
router.register("articles", NewsArticleViewSet, basename="news-articles")
router.register("categories", NewsCategoryViewSet, basename="news-categories")
router.register("newsletter", NewsletterSubscriberViewSet, basename="news-newsletter")

urlpatterns = [
    path("home/", news_home, name="news-home"),
    path("", include(router.urls)),
]
