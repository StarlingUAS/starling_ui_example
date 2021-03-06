FROM ros:foxy-ros-base-focal

# Install nvm
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        ros-foxy-mavros-msgs \
    && rm -rf /var/lib/apt/lists/*

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash


# Install node
# Use bash shell for this next bit...
SHELL [ "/usr/bin/bash", "-c" ]
RUN source /root/.nvm/nvm.sh && nvm install 12

# Get ros2-web-bridge
RUN git clone --recurse-submodules -j4 --depth 1 --shallow-submodules https://github.com/RobotWebTools/ros2-web-bridge /ros_ws/src/ros2-web-bridge

# Change the working directory
WORKDIR /ros_ws/src/ros2-web-bridge

# Install ros2-web-bridge
RUN source /opt/ros/${ROS_DISTRO}/setup.bash && source /root/.nvm/nvm.sh && npm install

# Copy over the launch scripts
COPY ui/ui.launch.xml /ros_ws/launch/ui.launch.xml
COPY ui/node_entrypoint.sh /node_entrypoint.sh

# Add all html file example
COPY ui/src/ /ros_ws/src/ros2-web-bridge/examples/

# Add custom ROS DDS configuration (force UDP always)
COPY ui/fastrtps_profiles.xml /ros_ws/
ENV FASTRTPS_DEFAULT_PROFILES_FILE /ros_ws/fastrtps_profiles.xml

# Change the working directory
WORKDIR /ros_ws

ENV USE_ROSBRIDGE false
ENV HTML_PORT 3000
ENV ROSBRIDGE_PORT 9090

# Expose html server
EXPOSE ${HTML_PORT}
# Expose websocket server
EXPOSE ${ROSBRIDGE_PORT}

# Set initial command
CMD [ "ros2", "launch", "launch/ui.launch.xml" ]