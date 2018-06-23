import redis
import time
import numpy as np
import json


class Connection:
    def __init__(self):
        self.r = redis.StrictRedis(host='localhost', port=6379)
        self.p = self.r.pubsub()
        self.p.subscribe('state_buffer')

    def get_state_buffer(self):
        while True:
            msg = self.p.get_message()
            if msg:
                if type(msg['data']) == bytes:
                    s = msg['data'].decode('utf-8')
                    d = json.loads(s)
                    a = np.array(d['data'], dtype='float32')
                    return a
            time.sleep(0.001)

    def publish_action(self, action):
        self.r.publish('action', list(action))


# Test
if __name__ == '__main__':
    connection = Connection()
    while True:
        connection.publish_action(np.array([1.0, 0.0, 0.0, 0.0, 0.0]))
        print(connection.get_state_buffer())
        time.sleep(0.0001)
