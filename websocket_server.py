import asyncio
import websockets
import json


class SendToAllOtherClientsServer:
    """
        The clients connecting to this server will have their messages sent
        to all clients except themselves.
    """
    def __init__(self, port=8000):
        self.ws_list = []
        self.port = 8000

        async def send_to_all_other_clients(ws, path):
            self.handle_client(ws)
            while True:
                msg = await ws.recv()
                for ws_iter in self.ws_list:
                    if ws != ws_iter:
                        await ws_iter.send(msg)

        server = websockets.serve(send_to_all_other_clients, 'localhost', self.port)
        asyncio.get_event_loop().run_until_complete(server)
        asyncio.get_event_loop().run_forever()

    def handle_client(self, client):
        if client not in self.ws_list:
            self.ws_list.append(client)


if __name__ == '__main__':
    send_to_all_other_clients_server = SendToAllOtherClientsServer()
