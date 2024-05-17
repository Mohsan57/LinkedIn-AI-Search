from rest_framework.views import APIView
from rest_framework.response import Response
from social_django.utils import psa
from rest_framework.permissions import AllowAny


class GoogleLogin(APIView):
    permission_classes = [AllowAny] 
    @psa()
    def post(self, request):
        return Response({'url': request.backend.auth_url()})

class GoogleCallback(APIView):
    permission_classes = [AllowAny]
    @psa()
    def post(self, request):
        user = request.backend.do_auth(request.POST.get('access_token'))
        # Handle user creation, login, and token generation
        return Response({'user_id': user.id, 'token': user.auth_token.key})
