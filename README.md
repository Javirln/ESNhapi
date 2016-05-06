<a href="http://hapijs.com/"><img src="https://raw.github.com/hapijs/hapi/master/images/hapi.png" /></a>

# ESNHapi

The ESNhapi is an API written in Node.JS that tries to centralize the content from all the network. 
With it, we try to provide a one stop place for fetching any kind of information.

## Platform

ESNhapi is built on the API framework hapi.js, written in Javascript.
To deploy and develop, there is a Docker configuration that creates a container with the API.

## Development

Development is done through Docker container. The development container syncs the code
between the host folder and the container and reloads at any event of change of the code.
Using containers allows to setup a development system, including databases and other 
options just with a command and 0 configuration.

### Steps
1. Install docker
    
    1.1 MacOS/Windows: https://www.docker.com/products/docker-toolbox 
    
    Note, there are some permissions problems in MacOS, though the actual setup might work well
    
    1.2 Linux: https://docs.docker.com/engine/installation/
2. Build the container using docker-compose: `docker-compose build`
3. Run the container
    
    3.1 As a daemon (in background): `docker-compose -d up`
    
    3.2 As a process (stoppable with CTR+C): `docker-compose up`
    
Logs and changes are printed in the console.

### Ports and paths
*  3000: API port
*  3000/documentation: Swagger API documentation endpoint
*  5858: Node.JS debug port
*  27017: MongoDB port

### Debugging
#### Webstorm
Setup a remote debugging connecting to port 5858 of the container

#### Node Inspector
Install node-inspector with `sudo npm install -g node-inspector` and connect to it using
`node-debug --web-host=127.0.0.1 --cli app/index.js`.

**Note: this still needs to be tested!**