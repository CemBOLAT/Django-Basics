from django.urls import path
from .views import MyTokenObtainPairView, signup, oauth_login, oauth_callback,send_verification_code, verify_email
from rest_framework_simplejwt.views import  TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('oauth/login/', oauth_login, name='oauth_login'),
    path('signup/', signup, name='signup'),
    path('callback/', oauth_callback, name='oauth_callback'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('<int:pk>/send-verification-code/', send_verification_code, name='send_verification_code'),
    path('<int:pk>/verify-email/', verify_email, name='verify-email'),
]