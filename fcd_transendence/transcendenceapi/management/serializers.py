from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Game, User, Tournament, FriendRequest

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    games_as_user1 = GameSerializer(many=True, read_only=True)
    games_as_user2 = GameSerializer(many=True, read_only=True)
    tournaments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'is_active', 'win', 'lose', 'nickname',
            'friends', 'games', 'games_as_user1', 'games_as_user2', 'tournaments', 'is_42_student', 'is_online', 'email_token'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        if 'nickname' not in validated_data or not validated_data['nickname']:
            validated_data['nickname'] = validated_data['username']
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).update(instance, validated_data)

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user_id = serializers.IntegerField(source='from_user.id')
    from_user_username = serializers.CharField(source='from_user.username')

    class Meta:
        model = FriendRequest
        fields = ['from_user_id', 'from_user_username', 'created_at']

class TournamentSerializer(serializers.ModelSerializer):
    tournamentUsers = UserSerializer(many=True, read_only=True)
    tournamentGame = GameSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = '__all__'

class MyTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def get_token(cls, user):
        from rest_framework_simplejwt.tokens import RefreshToken
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        username = attrs.get('username')

        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError('User not found')

        # check is 42 student
        user = User.objects.get(username=username)
        if user.is_42_student:
            raise serializers.ValidationError('User is a 42 student use 42Oauth')

        password = attrs.get('password')
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError('Wrong username or password')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id' : user.id,
        }