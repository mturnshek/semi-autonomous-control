roslaunch rosbridge_server rosbridge_websocket.launch &
sleep 3
python ./train/train_dqn.py &
sleep 3
nodejs ./train/test_node.js &
