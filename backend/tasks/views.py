from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsManagerOrSuperAdmin
from .models import Task
from .serializers import TaskSerializer
from rest_framework.pagination import PageNumberPagination

# Create your views here
class TaskListCreateView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsManagerOrSuperAdmin()
            ]
        return [
            IsAuthenticated()
        ]

    def get(self, request):
        if request.user.role in [
            "SUPER_ADMIN",
            "MANAGER",
        ]:
            tasks = Task.objects.all().order_by(
                "-created_at"
            )
        else:
            tasks = Task.objects.filter(
                assigned_to=request.user
            ).order_by(
                "-created_at"
            ) 

        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(
            tasks,
            request
        )

        serializer = TaskSerializer(
            result_page,
            many=True
        )
        
        return paginator.get_paginated_response(
            serializer.data
        )

    def post(self, request):
        serializer = TaskSerializer(
            data=request.data
        )
        if serializer.is_valid():
            task = serializer.save(
                created_by=request.user
            )
            return Response(
                TaskSerializer(task).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class TaskDetailView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self, task_id):

        try:
            return Task.objects.get(
                id=task_id
            )

        except Task.DoesNotExist:
            return None

    def get(self, request, task_id):

        task = self.get_object(task_id)

        if task is None:

            return Response(
                {
                    "error": "Task not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # USER can only view assigned tasks
        if request.user.role == "USER":

            if task.assigned_to != request.user:

                return Response(
                    {
                        "error": "You do not have permission to view this task."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = TaskSerializer(task)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, task_id):

        task = self.get_object(task_id)

        if task is None:

            return Response(
                {
                    "error": "Task not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # USER can update only assigned task
        if request.user.role == "USER":

            if task.assigned_to != request.user:

                return Response(
                    {
                        "error": "You can only update tasks assigned to you."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            # User must not change assignment
            if "assigned_to" in request.data:

                return Response(
                    {
                        "error": "Users cannot assign tasks."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = TaskSerializer(
            task,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            task = serializer.save()

            return Response(
                TaskSerializer(task).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, task_id):

        task = self.get_object(task_id)

        if task is None:

            return Response(
                {
                    "error": "Task not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # User cannot delete
        if request.user.role == "USER":

            return Response(
                {
                    "error": "Users cannot delete tasks."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        task.delete()

        return Response(
            {
                "message": "Task deleted successfully"
            },
            status=status.HTTP_204_NO_CONTENT
        )