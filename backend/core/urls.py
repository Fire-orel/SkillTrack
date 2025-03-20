
from django.urls import path
from .views import (
    EduView, SphereView, HashtagView, ProfiView,CustomUserListView,CustomUserDetailView
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
]
