from django.contrib.auth.models import User
from rest_framework import views, status, permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from .models import Task
from django.contrib.auth.models import User
from django.http import JsonResponse
import json

class TaskPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class CreateNewUser(views.APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if not username or not email or not password:
                return JsonResponse({"error": "All fields are required"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password)
            user.is_active = True 
            user.save()

            return JsonResponse({"message": "User registered successfully"}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TaskListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = TaskPagination

    def get(self, request):      
        
        try:  
            
            tasks = Task.objects.filter(user=request.user)
            
            status_filter = request.query_params.get('status')
            if status_filter:
                tasks = tasks.filter(completed=(status_filter.lower() == 'completed'))
                
         
            sort_by = request.query_params.get('sort_by', '-created_date')
            tasks = tasks.order_by(sort_by)
            
       
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(tasks, request)
            
            tasks_data = [{
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'completed': task.completed,
                'created_date': task.created_date
            } for task in page]
            
            return paginator.get_paginated_response(tasks_data)
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            data = request.data
            task = Task.objects.create(
                user=request.user,
                title=data.get('title'),
                description=data.get('description', ''),
                completed=data.get('completed', False)
            )
            data = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'completed': task.completed,
                'created_date': task.created_date
            }
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            task = get_object_or_404(Task, id=pk, user=request.user)
            
            data = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'completed': task.completed,
                'created_date': task.created_date
            }
            
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            task = get_object_or_404(Task, id=pk, user=request.user)
            data = request.data
            
            task.title = data.get('title', task.title)
            task.description = data.get('description', task.description)
            task.completed = data.get('completed', task.completed)
            task.save()
            data = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'completed': task.completed,
                'created_date': task.created_date
            }
            
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            task = get_object_or_404(Task, id=pk, user=request.user)
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)