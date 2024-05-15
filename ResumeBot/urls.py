from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

register = views.UserView.as_view({'post': 'signup'})
login = views.UserView.as_view({'post': 'login'})

urlpatterns = [
    path('user', views.UserView.as_view({'get': 'get'}), name='user'),
    path('register', register, name='signup'),
    path('login', login, name='login'),
    path('resume', views.ResumeView.as_view({'post': 'post'}), name='resume'),
    path('resume-analyze', views.ResumeMatchView.as_view({'post':'post'}), name='analyze-resume'),
]