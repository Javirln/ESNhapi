![build status](https://codeship.com/projects/YOUR_PROJECT_UUID/status?branch=master)

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
    
    1.1 MacOS/Windows: 
    * Install Docker Toolbox: https://www.docker.com/products/docker-toolbox 
    * Install Docker Native
       * Mac OS: https://download.docker.com/mac/beta/Docker.dmg
       * Windows: https://download.docker.com/win/beta/InstallDocker.msi 
       (with Hyper-V enabled machines only. Otherwise install Docker Toolbox for Windows)
    
    1.2 Linux:
    * Install docker-engine: https://docs.docker.com/engine/installation/
    * Install docker-compose: https://docs.docker.com/compose/install/

2. Install npm packages for development: `npm install`
3. Build the container: `npm run build`

### Running the API
* Run the API and mongoDB containers: `npm start`
* Run the tests and coverage: `npm test`

You can find the real commands called in docker-compose inside the `package.json` file.

If you want to run the containers as daemons (in background), add a `-d` as a parameter to `docker-compose`. 
By default it will be run as a command and logs and changes will be printed in the console.

### Ports and paths
*  http://localhost:3000: API port
*  http://localhost:3000/documentation: Swagger API documentation endpoint
*  http://localhost:5858: Node.JS debug port
*  http://localhost:27017: MongoDB port
*  http://localhost:5859: Node.JS debug port in test container

### Debugging

In order to run in local configurations, add `mongo 127.0.0.1` in the hosts file of your computer


#### Webstorm
*  **Remote Debug configuration:** Start a remote debugging connecting to `localhost:5858` 
*  **Run Local configuration:** Start index.js in debug mode

#### Node Inspector
Install node-inspector with `sudo npm install -g node-inspector` and connect to it using
`node-debug --web-host=127.0.0.1 --cli app/index.js`.

**Note: this still needs to be tested!**

### Testing and coverage

Tests ar ran using mocha library as a test driver and istanbul as a coverage measurer.

Coverage outputs are saved in the coverage folders. Also they are saved as artifacts in GitlabCI.

#### Webstorm
* `npm test`
* **Run Tests local configuration:** Start mocha from the command line
#### Command line
* `node_modules/.bin/_mocha --recursive`

## Continuous Integration

CI is done through Gitlab CI and steps are defined in .gitlab-ci.yml file.

There are 4 steps:
*  Testing: Tests and code coverage are run against the code
*  Building: The docker image is built and saved in the Gitlab Registry
*  Deploying: The docker image is updated in the server using rancher-compose
*  CleanUp: The update is finished or reverted back depending on the result of the previous Job.

We do Testing before Building, because the real building ('npm install') takes nothing.
Building is building the docker image itself.

