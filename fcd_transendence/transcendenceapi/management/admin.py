from django.contrib import admin
from .models import Game, User, Tournament, FriendRequest
# Register your models here.

admin.site.register(Game)
admin.site.register(User)
admin.site.register(Tournament)
admin.site.register(FriendRequest)
