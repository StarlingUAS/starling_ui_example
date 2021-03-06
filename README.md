# Starling Initial UI

Builds a container that serves a web-based UI for the system. Uses
RobotWebTools' `ros2-web-bridge` and `rclnodejs` internally.

![starling-ui](ui.png)

## Contents
[TOC]

## Layout
Contains several elements:
- Contains a main page which publishes `std_msgs/Empty` to either the topic `/emergency_stop` or `/mission_start` depending on the button pressed
- The javascript file `src/ros_buttons.js` contains the javascript control for the buttons
- Button images are in the `src/images` directory

### Building

From the root directory run `make`. This will build the image as `uobflightlabstarling/starling-ui-example`


### Running

To start the image:
`docker run -it --rm --net=host -p 3000:3000 -p 9090:9090 uobflightlabstarling/starling-ui-example`

> NB: Port 3000 is exposed for the webserver, while port 9090 is exposed for the
websocket.

> Also note that you may need to change the `--net=` argument to the docker network currently running. Usually is `<folder_in_which_docker-compose_is_run>_default`, e.g. `px4_default` if docker-compose is run from the `px4` folder.

> **NOTE:** The default behavious does not start the rosbridge server itself. It is assumed that this will be run with `ProjectStarling` and that a bridge already exists on the network. To run this standalone, include `-e USE_ROSBRIDGE=true` when running `docker run` above.

Once the container is running, navigate to:
[`http://127.0.0.1:3000`](http://127.0.0.1:3000)

> The website can be accessed on other computers by using `http://<computer_ip_address>:3000`

In a connected ros2 instance, the command below can be run to see the output.
Note, if the topic has not yet been published to, the command will exit
immediately complaining that it could not determine the type.
fixes: either press the E-STOP button to publish an initial message or supply
the type: `std_msgs/Empty` as a further argument.

```bash
ros2 topic echo /mission_start
ros2 topic echo /emergency_stop
```

> **NOTE**:
> Note that when running locally using docker, port 9090 is required for ros web bridge traffic.

### Development

First ensure that you are in this repositories folder, otherwise the relative file paths will be wrong.

To start the image with development folder bound into the container, in this folder run:
```console
docker run -it --rm --network projectstarling_default -v "$(pwd)"/ui/src:/ros_ws/src/ros2-web-bridge/examples/ -p 3000:3000 -p 9090:9090 starling-ui
# or for windows powershell
docker run -it --rm --network projectstarling_default -v ${PWD}/ui/src:/ros_ws/src/ros2-web-bridge/examples/ -p 3000:3000 -p 9090:9090 starling-ui
```
This will bind mount the html folder into the wanted directory.

> **Bind mounting** refers to attaching a file or directory on the host machine into a container. This allows the container to access and read the local version of the folder. Therefore allowing any local changes to be seen within the container itself.

This will allow local changes made to the web files to be reflected by refreshing the page brings.

This only serves as a simple example GUI and it is recommended that it is extended for further use.

### Kubernetes Deployment

The UI can also be run within the kubernetes deployment and network. To start as a kubernetes Deployment simply apply the `kubernetes.yaml` file in this directory.
```bash
sudo k3s kubectl apply -f kubernetes.yaml
```

This will both start the `uobflightlabstarling/starling-ui` image, and a kubernetes service which exposes the website to outside of the cluster. The web page is then located at [https://localhost:3000](https://localhost:3000).

> **NOTE**:
> Localhost port 9090 is also used for `ros_bridge` traffic
