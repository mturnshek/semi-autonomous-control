from upon_receive_state import upon_receive_state
import numpy as np


def f(msg):
    for i in range(100):
        print np.array(msg.data)

upon_receive_state(f)
