set -e


if [[ ! -v $USE_REMOTE ]]
then
    /node_entrypoint.sh /ros_ws/src/ros2-web-bridge/bin/rosbridge.js --address "ws://$REMOTE_ADDRESS:$REMOTE_PORT"
    echo "Deploying rosbridge, connecting as client at ws://$REMOTE_ADDRESS:$REMOTE_PORT"
else
    /node_entrypoint.sh /ros_ws/src/ros2-web-bridge/bin/rosbridge.js
    echo "Deploying rosbridge as server and client"
fi

INDEX_FOLDER=

echo "Starting "
cd /ros_ws/src/ros2-web-bridge/examples
/node_entrypoint.sh index.js 