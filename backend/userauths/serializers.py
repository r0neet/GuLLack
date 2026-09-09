from rest_framework import serializers
from .models import User
from django.utils import timezone

class UserRegisterSerializer(serializers.ModelSerializer):
    
    class Meta:   # discription of what the the serializer should do(defining what comes in)
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {     # User will not be able to read password
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):  # method called when creating the model instance(validated_data)
        email = validated_data['email'] # Extract email from the request(from the frontend)
        local_part = email.split('@')[0]  # take whatever that is before @ (example: ["omijah", "gmail"])
        user = User.objects.create_user(
            username=local_part,   # will take from the split
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