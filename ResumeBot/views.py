from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import api_view, permission_classes, action
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import ResumeSerializer, UserSerializer
from .models import Resume, User
from rest_framework.permissions import IsAuthenticated
from ATS.similarity import get_score
from ATS.JobDescriptionProcessor import JobDescriptionProcessor


@permission_classes([permissions.AllowAny])
class UserView(GenericViewSet):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract user id from the JWT token
        user_id = request.user.id
        try:
            # Retrieve user object from the database using the user id
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            data = serializer.data
            data  = dict(data)
            try:
                resume = Resume.objects.get(user=user_id)
                resume = ResumeSerializer(resume).data
                data['resume'] = resume.get('resume')
            except Resume.DoesNotExist:
                data['resume'] = None
            return Response({'user': data})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(methods=['post'], detail=False) 
    def signup(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            try:
                # user = .objects.get(email=request.data['email'])
                refresh = RefreshToken.for_user(user)
                res = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response(res)
            except TokenError as e:
                return Response({'error': 'Something went wrong. Please try again.', 'detail': str(e)})
            except Exception as e:
                return Response({'error': 'Something went wrong. Please try again.', 'detail': str(e)})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['post'], detail=False) 
    def login(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.login_validate(request.data):
            try: 
                user = User.objects.get(email=request.data['email'])
                if not user.check_password(request.data['password']):
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
                refresh = RefreshToken.for_user(user)
                
                refresh.lifetime = None
                refresh.access_token.lifetime = None

                res = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response(res)
            except TokenError as e:
                return Response({'error': 'Something went wrong. Please try again.', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': 'Something went wrong. Please try again.', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeView(GenericViewSet):

    permission_classes = [IsAuthenticated]
    def post(self, request):
        user_id = request.user.id
        try:
            resume = request.FILES['resume']
            resume = Resume.objects.create(user_id=user_id, resume=resume)
            return Response({'uploaded': True}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_id = request.user.id
        try:
            resume = Resume.objects.get(user = user_id)
            serializer = ResumeSerializer(resume)
            return Response(serializer.data)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Something went wrong', 'detail': str(e)})

    permission_classes = [IsAuthenticated]
    def put(self, request):
        user_id = request.user.id
        try:
            resume = Resume.objects.get(user = user_id)
            serializer = ResumeSerializer(resume, data=request.data, partial=True)
            if serializer.is_valid():
                resume = serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Something went wrong', 'detail': str(e)})
        
@permission_classes([permissions.AllowAny])
class ResumeMatchView(GenericViewSet):
    
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user_id = request.user.id
        try:
            resume = Resume.objects.get(user = user_id)
            resume_dict = resume.resume_json
            job_description = request.data['jobDescription']
            job_description_processor = JobDescriptionProcessor(input_file_text=job_description, output_file_name=f'{user_id}_temp_jd')
            jd_dict = job_description_processor.process()
            if not jd_dict or not resume_dict:
                return Response({'error': 'Invalid input data'}, status=status.HTTP_400_BAD_REQUEST)
            score = get_score.get_similarity_score(resume_dict, jd_dict)
            score = score * 100
            score = round(score, 2)
            required_skills = ''
            # Add your logic to calculate the score, reason, and required skills here
            return Response({'score': score, 'required_skills': required_skills})
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Something went wrong', 'detail': str(e)})
    def get(self, request):
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)