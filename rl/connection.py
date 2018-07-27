import asyncio
import json
from websocket import create_connection


class Connection:
    def __init__(self, train=True):
        self.ws = create_connection('ws://localhost:8000')

    def get_state(self):
        return json.loads(self.ws.recv())

    def send_action(self, action):
        self.ws.send(json.dumps(list(action)))
