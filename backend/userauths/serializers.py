# users/serializers.py

from rest_framework import serializers
from .models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creation of a new user with a hashed password.
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        email = validated_data['email']
        local_part = email.split('@')[0]
        user = User.objects.create_user(
            username=local_part,
            email=email,
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')
      