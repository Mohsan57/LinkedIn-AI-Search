from django.db import models
from .helpers import extractInfoFromPDF
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from . import constants as user_constants
from ATS import ResumeProcessor

class SimpleUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', user_constants.SUPERUSER)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    user_type = models.PositiveSmallIntegerField(choices=user_constants.USER_TYPE_CHOICES, default=user_constants.BASICUSER)

    objects = SimpleUserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    resume = models.FileField(upload_to='LinkedIn/upload/resumes/')
    resume_json = models.JSONField(null=True, blank=True)
    resume_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
    def save(self, *args, **kwargs):
        try:
            self.resume_text = extractInfoFromPDF(self.resume)
            resume_processor = ResumeProcessor(self.resume_text)
            self.resume_json = resume_processor.process()
        except:
            pass
        super(Resume, self).save(*args, **kwargs)
    

    class Meta:
        db_table = 'resumes'
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'