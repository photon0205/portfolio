from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, JSONParser
import json
from .services import compute_diff, apply_diff


@ensure_csrf_cookie
@require_http_methods(["GET"])
def csrf_view(request):
    """Bootstrap CSRF cookie for sync operations."""
    return JsonResponse({"csrf": "token set"})


class PreviewView(APIView):
    """Preview diff of uploaded portfolio.json against database."""
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, JSONParser]

    def post(self, request):
        try:
            # Get uploaded file
            if 'file' not in request.FILES:
                return Response(
                    {"error": "No file uploaded"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            uploaded_file = request.FILES['file']
            
            # Parse JSON
            try:
                content = uploaded_file.read().decode('utf-8')
                payload = json.loads(content)
            except (UnicodeDecodeError, json.JSONDecodeError) as e:
                return Response(
                    {"error": f"Invalid JSON: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Compute diff
            diff_result = compute_diff(payload)
            return Response(diff_result)
            
        except Exception as e:
            return Response(
                {"error": f"Preview failed: {str(e)}"}, 
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )


class ApplyView(APIView):
    """Apply diff changes to database and refresh portfolio.json."""
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, JSONParser]

    def post(self, request):
        try:
            # Get uploaded file
            if 'file' not in request.FILES:
                return Response(
                    {"error": "No file uploaded"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            uploaded_file = request.FILES['file']
            
            # Parse JSON
            try:
                content = uploaded_file.read().decode('utf-8')
                payload = json.loads(content)
            except (UnicodeDecodeError, json.JSONDecodeError) as e:
                return Response(
                    {"error": f"Invalid JSON: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get deletions (optional)
            deletions = {}
            if 'deletions' in request.data:
                try:
                    deletions = json.loads(request.data['deletions'])
                except json.JSONDecodeError:
                    return Response(
                        {"error": "Invalid deletions JSON"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Apply changes
            result = apply_diff(payload, deletions, request.user)
            return Response(result)
            
        except Exception as e:
            return Response(
                {"error": f"Apply failed: {str(e)}"}, 
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )