from rest_framework import serializers
from .models import Resume, User
from .helpers import extractInfoFromPDF
from django.contrib.auth.models import Group



class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
    
    def create(self, resume):
        return Resume.objects.create(**resume)



class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password1', 'password2', 'user_type']
        extra_kwargs = {
            'user_type': {'required': False}  # Only required if not set to default
        }
    
    

    def validate(self, data):
        # Ensure passwords match
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        validated_data['password'] = password


        # Create user
        user = User.objects.create_user(**validated_data)
        return user
    
    def login_validate(self, data):
        if 'email' not in data:
            raise serializers.ValidationError({'email': 'This field is required'})
        if 'password' not in data:
            raise serializers.ValidationError({'password': 'This field is required'})
        return data
        
