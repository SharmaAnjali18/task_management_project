from django.urls import path
from .views import (RegisterView, LoginView, ProfileView, UserListCreateView, AdminUserCreateView)

urlpatterns = [
    path(
        'auth/register/',
        RegisterView.as_view(),
        name='register'
    ),
    path(
        'auth/login/',
        LoginView.as_view(),
        name='login',
    ),
    path(
        'profile/',
        ProfileView.as_view(),
        name='profile',
    ),
    path(
        'users/',
        UserListCreateView.as_view(),
        name='users',
    ),
    path(
        'admin/users/',
        AdminUserCreateView.as_view(),
        name="admin-user-create"
    )
]
