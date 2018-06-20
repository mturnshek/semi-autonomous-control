import rospy
from std_msgs.msg import Float32MultiArray

import numpy as np


def parsed_msg_callback_fn(msg):
    callback_fn(np.array(msg.data))

# callback_fn is passed just the state array
def upon_receive_state(callback_fn):
    rospy.init_node('sim_bridge')
    rospy.Subscriber('/state', Float32MultiArray, parsed_msg_callback_fn)
    rospy.spin()
