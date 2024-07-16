from django import forms
from management.models import User

class UserSignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    

    def clean_username(self):
        username = self.cleaned_data.get('username')
        #username is empty
        if not username:
            raise forms.ValidationError("Username is required")
        if '_' in username:
            raise forms.ValidationError("Username cannot contain underscore ('_')")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        #email is empty
        if not email:
            raise forms.ValidationError("Email is required")
        return email
    
    def clean_password(self):
        password = self.cleaned_data.get('password')
        #password is empty
        if not password:
            raise forms.ValidationError("Password is required")
        return password