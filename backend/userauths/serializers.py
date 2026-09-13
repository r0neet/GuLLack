from rest_framework import serializers
from .models import User
from django.utils import timezone

class UserRegisterSerializer(serializers.ModelSerializer):
    
    class Meta:   # discription of what the the serializer should do(defining what comes in)
        model = User
        # FIX: Accept the optional username sent by the signup form.
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {
            'password': {'write_only': True},  # User will not be able to read password
            'username': {'required': False},   # Use the email prefix when it is omitted.
        }
    
    def create(self, validated_data):  # method called when creating the model instance(validated_data)
        email = validated_data['email'] # Extract email from the request(from the frontend)
        local_part = email.split('@')[0]  # take whatever that is before @ (example: ["omijah", "gmail"])
        # FIX: Preserve a supplied username; otherwise use the email prefix.
        username = validated_data.pop('username', '') or local_part
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password']
        )
        return user  # hence user is created in the system
    
    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'Email already exists'})
        return attrs

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "email", "username"]
