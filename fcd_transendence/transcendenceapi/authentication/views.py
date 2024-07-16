from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from management.serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework import status
from django.shortcuts import redirect
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from authentication.forms import UserSignupForm
import requests
from requests_oauthlib import OAuth2Session
from django.core.mail import send_mail
from django.core.signing import Signer


User = get_user_model()

# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def send_verification_code(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    signer = Signer()
    token = signer.sign(user.email)

    print(f'User: {user.username}')

    subject = 'Transcendence Email Verification'
    message = f'Your verification code is: {token}'
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = user.email

    # Store token
    user.emailToken = token
    user.save()

    print(f'Subject: {subject}')
    print(f'Message: {message}')
    print(f'From Email: {from_email}')
    print(f'To Email: {to_email}')

    try:
        send_mail(subject, message, from_email, [to_email], fail_silently=False)    
        print("Email sent successfully")
        return Response({'message': 'Verification code has been sent to your email', 'code': token}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Error sending email: {e}')
        return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request, pk):
    user = User.objects.get(pk=pk)
    if not user:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if user.emailToken == request.data['code']:
        user.emailToken = None
        user.is_active = True
        user.save()
        return Response({'message': 'Email has been verified'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = UserSignupForm(request.data)
    if form.is_valid():
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'username': user.username,
                'email': user.email,
                'user_id': user.id,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def oauth_login(request):
    client_id = settings.CLIENT_ID
    redirect_uri = 'http://localhost:5500'
    ##auth_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code'
    auth_url = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-7ad0db3b049f11579ed2953ded55cb7773c1e5741b99c5070316b817d40918f5&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500&response_type=code'
    return redirect(auth_url)

@api_view(['GET'])
@permission_classes([AllowAny])
def oauth_callback(request):
    code = request.GET.get('code')
    if not code:
        return Response({'error': 'Code parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)

    token_url = 'https://api.intra.42.fr/oauth/token'
    payload = {
        'grant_type': 'authorization_code',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'code': code,
        'redirect_uri': 'http://127.0.0.1:5500',
    }

    oauth = OAuth2Session(settings.CLIENT_ID, redirect_uri='http://127.0.0.1:5500')
    response = oauth.post(token_url, data=payload)
    print(f"----------------test : {response.status_code}")

    if response.status_code < 200 or response.status_code >= 300:
        return Response({
            'error': 'Failed to obtain access token',
            'details': response.json()
        }, status=response.status_code)

    access_token = response.json().get('access_token')
    if not access_token:
        return Response({'error': 'Access token is missing from the response'}, status=status.HTTP_400_BAD_REQUEST)

    user_info_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_info_response = requests.get(user_info_url, headers=headers)
    if user_info_response.status_code != 200:
        return Response({'error': 'Failed to obtain user info'}, status=user_info_response.status_code)

    user_info = user_info_response.json()

    if 'login' not in user_info or 'email' not in user_info:
        return Response({'error': 'Required user info is missing (login or email)'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=user_info['email'])
        user.username = user_info['login'] + '_42'
        user.nickname = user_info['login']
        user.is_42_student = True
        user.save()
    except User.DoesNotExist:
        user = User.objects.create(
            username=user_info['login'] + '_42',
            email=user_info['email'],
            nickname=user_info['login'],
            is_42_student=True
        )

    refresh = RefreshToken.for_user(user)
    token = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user_id': user.id,
    }

    return Response(token, status=status.HTTP_200_OK)
