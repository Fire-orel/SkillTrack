
from django.urls import path
from .views import (
    EduView, SphereView, HashtagView, ProfiView,CustomUserListView,CustomUserDetailView,CertificateView,AchievementsView,WorksView,LinksView,SkillView,CareerRecommendationView,SberParserView,HHVacancyParserView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('users/', CustomUserListView.as_view(), name='users-list-create'),
    path('users/<int:pk>/', CustomUserDetailView.as_view(), name='users-detail'),

    path('education/', EduView.as_view(), name='education-list-create'),
    path('education/<int:pk>/', EduView.as_view(), name='education-detail'),

    path('spheres/', SphereView.as_view(), name='sphere-list-create'),
    path('spheres/<int:pk>/', SphereView.as_view(), name='sphere-detail'),

    path('hashtags/', HashtagView.as_view(), name='hashtag-list-create'),
    path('hashtags/<int:pk>/', HashtagView.as_view(), name='hashtag-detail'),

    path('professions/', ProfiView.as_view(), name='profi-list-create'),
    path('professions/<int:pk>/', ProfiView.as_view(), name='profi-detail'),


    path('certificates/', CertificateView.as_view(), name='certificates'),
    path('certificates/<int:pk>/', CertificateView.as_view(), name='certificates'),
    path('achievements/', AchievementsView.as_view(), name='achievements'),
    path('works/', WorksView.as_view(), name='works'),
    path('works/<int:work_id>/', WorksView.as_view(), name='works'),


    path("links/", LinksView.as_view(), name="links"),
    path("links/<int:pk>/", LinksView.as_view(), name="link-detail"),

    path('skills/', SkillView.as_view(), name='skills-list-create'),
    path('skills/<int:pk>/', SkillView.as_view(), name='skill-delete'),

    path('career-recommendations/', CareerRecommendationView.as_view(), name='career-recommendations'),
    path('sber-parser/', SberParserView.as_view(), name='sber-parser'),


    path('hh-parser/', HHVacancyParserView.as_view(), name='hh-parser'),
]
