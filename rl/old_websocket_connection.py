import asyncio
import websocket
import json


class SimulationConnection:
    def __init__(self):
        self.poll_period = 0.01
        self.ws = websocket.create_connection('ws://localhost:8000')

    def get_state_buffer(self):
        while True:
            state = self.ws.recv()
            if state:
                return json.loads(state)
            time.sleep(0.01)

    def send_action(self, action):
        self.ws.send(json.dumps(action))

class SimulationConnection:
    def __init__(self, fn_upon_recv_state_buffer):
        pass




async def echo(websocket, path):
    async for message in websocket:
        await websocket.send(message)

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, 'localhost', 8765))
asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    """
        Test, if called as standalone script.
    """
    conn = SimulationConnection()
    state = conn.get_state_buffer()
    action = [0, 0, 0, 1, 0]
    conn.send_action(action)
