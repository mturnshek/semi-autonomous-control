import asyncio
import websockets
import json
import redis

from time import sleep


class RLAgentServer:
    def __init__(self, train=True):
        self.state = None
        self.state_updated = False
        self.action = None
        self.action_updated = False
        self.period = 0.01

        async def communicate(websocket, path):
            while True:
                # wait to get the state, set it once we have it
                state_buffer = await websocket.recv()
                self.state = state_buffer
                self.state_updated = True

                # wait for rl agent to execute action
                while not self.action_updated:
                    await asyncio.sleep(self.period)
                print('action was updated')

                # send the action to the simulation
                await websocket.send(json.dumps(self.action))
                self.state_updated = False

        rl_agent_server = websockets.serve(f, 'localhost', 8000)

    def get_state_buffer(self):
        while not self.state_updated:
            sleep(self.period)
        return self.state

    def send_action(self, action):
        self.action = action
        self.action_updated = True
