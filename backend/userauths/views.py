from django.contrib.auth import authenticate  #Built - in helper to check email and password and return to user
from django.conf import settings #Access to project setting

from rest_framework.views import APIView  # base class for DRF views
from rest_framework.response import Response # Standard DRF Http responce wrapper
from rest_framework import status # handy HTTp status codes (200,400, etc.)
from rest_framework.permissions import IsAuthenticated # Permission class required a valid login

from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView # Build-in Token refresh view
from rest_framework_simplejwt.serializers import TokenRefreshSerializer # Serializer for token refresh
from rest_framework_simplejwt.tokens import RefreshToken # Token class for token operations (creating/handling JWT refresh)
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken # Exception classes for token operations (bad/expired tokens)

from userauths import serializers as userauths_serializers # the app's serializers (aliased for clarity)
from userauths import models as userauths_models # the app's models (aliased for clarity)


class RegisterView(APIView):
    def post(self, request):
        serializer = userauths_serializers.UserRegisterSerializer(data=request.data) # call the serializer to grab the data sent from the frontend

        if serializer.is_valid(raise_exception=True): # if it is valid
            user = serializer.save() # create the user in the database

            refresh = RefreshToken.for_user(user) # create a refresh token for the user so that he can stay logged in for 7 days

            response_data = {
                'access': str(refresh.access_token), # send access token to the front end so that he can use it to access protected routes
                'message': "User registered and logged in successfully" # send response to the front end when successful
            }

            response = Response(response_data, status=status.HTTP_201_CREATED) # return 201 if the data is valid

            response.set_cookie(
                key="refresh",
                value=str(refresh),
                httponly=True, # prevent client-side (JavaScript) access, enhancing security
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),  # Cookie lifetime in seconds
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),  # Restrict cross-site sending
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG),  # HTTPS-only in prod
            )

            return response
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # return 400 if the data is invalid
    

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Please provide both email and password"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            response_data = {
                'access': str(refresh.access_token),
            }

            response = Response(response_data, status=status.HTTP_200_OK)

            response.set_cookie(
                key="refresh",
                value=str(refresh),
                httponly=True,
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),  # Cookie lifetime in seconds
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),  # Restrict cross-site sending
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG),  # HTTPS-only in prod
            )

            return response
        
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh") # grabs the refresh token from the browser's cookie

        if not refresh_token:
            return Response({"error": "Refresh token not found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist() # blacklist the token   
            response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
            response.delete_cookie("refresh")

            return response
        except (TokenError, InvalidToken):
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)
            

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = userauths_serializers.UserSerializer(request.user) # serializes the user model into JSON format
        return Response(serializer.data, status=status.HTTP_200_OK) # it can properly return the user data to the frontend
    


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    """
    This custom serializer reads the refresh token from the httpOnly cookie.
    """
    # We don’t expect the client to send 'refresh' in the body; we'll inject it from the request cookie
    refresh = None # We will get it from the request context instead.

    def validate(self, attrs):
        # Pull the refresh token from the request's cookies and place it into attrs so parent logic works
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh', None)

        # If there’s no cookie, we can’t refresh—throw a clear error
        if attrs['refresh'] is None:
            raise InvalidToken('No valid refresh token found in cookie.')
        
        # Delegate the rest (signature checks, expiry, rotation logic) to the parent serializer
        return super().validate(attrs)


class CookieTokenRefreshView(SimpleJWTTokenRefreshView):
    """
    This view overrides the default TokenRefreshView to work with httpOnly cookies.
    """
    # Use our custom serializer that reads the cookie instead of expecting JSON input
    serializer_class = CookieTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        # Call the original post method to perform the actual refresh logic
        response = super().post(request, *args, **kwargs)
        
        # If the refresh succeeded, response.data may include:
        # - a new access token (always)
        # - possibly a new refresh token (if rotation is enabled)
        # We move any new refresh token into a secure cookie and remove it from the JSON body.
        if response.status_code == 200 and 'refresh' in response.data:
            # Pop removes 'refresh' from the body and returns it
            refresh_token = response.data.pop('refresh', None)
            
            # Store the rotated refresh token back into httpOnly cookie (safer than exposing in JSON)
            response.set_cookie(
                key='refresh',
                value=str(refresh_token),
                httponly=True,
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG),
            )
        
        # Return the response with access token in body and refresh in cookie
        return response