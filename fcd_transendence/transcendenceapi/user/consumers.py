import json
from channels.generic.websocket import AsyncWebsocketConsumer
from management.models import User
from asgiref.sync import sync_to_async

class ActiveUserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user_id = self.scope['query_string'].decode('utf-8').split('=')[1]
        user = await sync_to_async(User.objects.get)(id=user_id)

        if user.is_authenticated:
            await self.set_user_online(user.id)
            await self.accept()

    async def disconnect(self, close_code):
        user_id = self.scope['query_string'].decode('utf-8').split('=')[1]
        user = await sync_to_async(User.objects.get)(id=user_id)

        if user.is_authenticated:
            await self.set_user_offline(user.id)

    async def set_user_online(self, user_id):
        user = await sync_to_async(User.objects.get)(id=user_id)
        user.is_online = True
        await sync_to_async(user.save)()

    async def set_user_offline(self, user_id):
        user = await sync_to_async(User.objects.get)(id=user_id)
        user.is_online = False
        await sync_to_async(user.save)()

    async def receive(self, text_data):
        pass
