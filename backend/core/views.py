from django.core.files.storage import default_storage
# Utility to safely fetch a model instance or raise a 404 if not found


# Django REST Framework core tools
from rest_framework import status                                # HTTP status codes (200, 400, 201, etc.)
from rest_framework import permissions                          # Shortcut import for permissions
from rest_framework.pagination import PageNumberPagination       # Pagination base class
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response   

# Extra imports
from decimal import Decimal   # Work with precise numbers (money, etc.)
import uuid                   # Generate unique IDs
import stripe                 # Stripe payment library
from django.conf import settings
from datetime import date     # Handle dates

# Import local serializers and models
from core import serializers as core_serializers
from userauths import serializers as userauths_serializers
from core import models as core_models
from userauths import models as userauths_models

# Set Stripe secret key from settings (so we can use Stripe API)
stripe.api_key = settings.STRIPE_SECRET_KEY

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permissions_classes = [permissions.AllowAny]  # Allow any user to upload files
    authentication_classes = []  # No authentication required for this view

    def post(self, request, *args, **kwargs):
        serializer = core_serializers.FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            uploaded_file = serializer.validated_data['file']
            # Save the file using Django's default storage system
            file_name = default_storage.save(uploaded_file.name, uploaded_file)
            file_url = request.build_absolute_uri(default_storage.url(file_name))
            return Response({'file_url': file_url}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)