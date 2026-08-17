from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (RegisterSerializer, UserSerializer, AdminUserCreateSerializer)

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import User
from .permissions import IsSuperAdmin

# Create your views here.

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self,request):
        serializer = RegisterSerializer(
            data=request.data
        )
        if serializer.is_valid():
            user=serializer.save()
            return Response(
                {
                    'message': 'User registered successfully',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class LoginView(APIView):
    permission_classes=[AllowAny]
    authentication_classes = []

    def post(self,request):
        username=request.data.get("username")
        password=request.data.get("password")

        user=authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {
                    'error': 'Invalid username or password'
                },
                status= status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            },
            status=status.HTTP_200_OK
        )

class ProfileView(APIView):

    def get(self, request):
        return Response(
            {
                "message": "You are authenticated",
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                    "role": request.user.role,
                }
            }
        )

class UserListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        users = User.objects.all()

        serializer = UserSerializer(
            users,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        if request.user.role != "SUPER_ADMIN":

            return Response(
                {
                    "error": "Only Super Admin can create users"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = UserSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class AdminUserCreateView(APIView):
    def post(self, request):
    
        serializer = AdminUserCreateSerializer(
            data=request.data
        )
    
        if serializer.is_valid():
        
            user = serializer.save()
    
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
    
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )