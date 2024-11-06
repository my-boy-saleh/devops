# Task Management Application

This application allows users to manage tasks efficiently by adding and deleting them, all powered by **MongoDB** for database management. The project is built using **Node.js** and features both frontend and backend components. The architecture is designed to enable seamless integration and real-time database interactions, ensuring a smooth user experience.

![1](<Screenshot 2024-11-05 130936.png>)

We have added user authentication to our MongoDB setup, with a specific username and password, which allows us to securely access and easily view our tasks in the database.

![2](<Screenshot 2024-11-05 130925.png>)

## Dockerfile Explanation

Our `Dockerfile` defines the steps to build and run the Task Management Application in a Docker container:

- **Base Image**: Uses `node:18` to provide a stable Node.js runtime.
- **Working Directory**: Sets `/app` as the directory for the app's files.
- **Copy Files**: Transfers `package.json` and `package-lock.json` first to install dependencies, followed by the rest of the code.
- **Install Dependencies**: Runs `npm install` to install all necessary packages.
- **Expose Port**: Opens port 3000 for the application.
- **Start App**: Runs `server.js` using Node.js to launch the app.

This setup ensures the app is containerized efficiently and ready to run.


![3](<Screenshot 2024-11-06 104813.png>)


## Docker Compose Explanation

The `docker-compose.yml` defines two services:

- **Backend**:
  - Built from the current directory (`.`).
  - Exposes port `3000` and connects to MongoDB via `MONGO_URL`.
  - Depends on the `mongo` service and uses a volume for code changes.

- **Mongo**:
  - Uses the `mongo:6` image and exposes port `27017`.
  - Data is stored persistently in the `mongo-data` volume.

This setup runs both services in separate containers with persistent MongoDB data.

![4](<Screenshot 2024-11-06 104724.png>)

## Project Files

- **node_modules**: Contains installed dependencies.
- **npm-debug.log**: Log file for npm errors.
- **Dockerfile**: Defines steps to build the Docker image.
- **.dockerignore**: Specifies files to exclude from the Docker image.
- **.git**: Git version control directory.

![5](<Screenshot 2024-11-06 104838.png>)


## GitLab Integration

We have added our application code to GitLab for version control and collaboration. The GitLab repository hosts the entire project, including the backend, frontend, and Docker configuration, ensuring seamless deployment and continuous integration.

![6](<Screenshot 2024-11-06 103741.png>)

# CI/CD Pipeline for Dockerized Node.js Application

This repository uses GitLab CI/CD to automate the process of building, testing, and deploying a Dockerized Node.js application. The pipeline consists of three stages: *Build, **Test, and **Deploy*.

## Pipeline Stages

### 1. *Build Stage*
   - *Image*: docker:latest (for running Docker commands)
   - *Service*: docker:dind (Docker-in-Docker for building images)
   - *Steps*:
     - Log into the GitLab Container Registry using the $CI_REGISTRY_USER and $CI_REGISTRY_PASSWORD environment variables.
     - Build the Docker image and tag it using the commit reference ($CI_COMMIT_REF_NAME).
     - Push the built image to the GitLab Container Registry.
   - *Trigger*: This stage runs only on the master branch.

### 2. *Test Stage*
   - *Image*: node:18 (for running Node.js tests)
   - *Steps*:
     - Install project dependencies using npm install.
     - Run tests using npm test.
   - *Trigger*: This stage runs only on the master branch.

### 3. *Deploy Stage*
   - *Image*: docker:latest
   - *Service*: docker:dind (Docker-in-Docker for managing containers)
   - *Steps*:
     - Log into the Docker registry.
     - Pull the Docker image from the registry.
     - Run the Docker container on the production server, exposing it on port 80.
   - *Environment*: The application is deployed to the production environment with the URL http://35.232.89.185.
   - *Trigger*: This stage runs on the master branch and on tagged commits.

## CI/CD Variables

- DOCKER_DRIVER: Specifies the Docker storage driver (overlay2).
- IMAGE: The Docker image path (35.232.89.185/root/projectt).
- DOCKER_REGISTRY: The GitLab Container Registry URL (registry.gitlab.com).
- TAG: The Git commit reference name, used for tagging the Docker image.

## GitLab Runner

- *Tag*: The pipeline is configured to run on a specific GitLab runner tagged with runnerr1.

## Notes
- The pipeline automates the process of building, testing, and deploying the application to production, ensuring consistency and efficiency.
- The application is deployed via Docker on a server with the IP address 35.232.89.185.

## GitLab CI/CD Configuration

Our `.gitlab-ci.yml` defines the CI/CD pipeline for building, testing, and deploying our application:

```yaml
variables:
  DOCKER_DRIVER: overlay2
  IMAGE: "35.232.89.185/root/projectt"
  DOCKER_REGISTRY: "registry.gitlab.com"  
  TAG: "$CI_COMMIT_REF_NAME"

stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: docker:latest
  services:
    - name: docker:dind  
  script:
    - echo "Logging into GitLab Container Registry"
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $DOCKER_REGISTRY
    - echo "Building the Docker image"
    - docker build -t $DOCKER_REGISTRY/$CI_PROJECT_PATH:$TAG .
    - echo "Pushing Docker image to GitLab Container Registry"
    - docker push $DOCKER_REGISTRY/$CI_PROJECT_PATH:$TAG
  tags:
    - runnerr1
  only:
    - master

test:
  stage: test
  image: node:18  
  script:
    - echo "Installing dependencies"
    - npm install  
    - echo "Running tests"
    - npm test
  tags:
    - runnerr1
  only:
    - master

deploy:
  stage: deploy
  image: docker:latest
  services:
    - name: docker:dind
  script:
    - echo "Logging into Docker registry"
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $DOCKER_REGISTRY
    - echo "Pulling Docker image from registry"
    - docker pull $DOCKER_REGISTRY/$CI_PROJECT_PATH:$TAG
    - echo "Running the Docker container"
    - docker run -d -p 80:80 --name projectt-app $DOCKER_REGISTRY/$CI_PROJECT_PATH:$TAG
  environment:
    name: production
    url: http://35.232.89.185
  only:
    - master
    - tags


```
## Ansible Playbooks for GitLab and Docker

We have written Ansible playbooks to automate the installation and configuration of **GitLab** and **Docker** on the target systems:

- **GitLab Installation**: The Ansible playbook automates the entire GitLab setup, including system preparation, installation, and service configuration for version control and CI/CD purposes.

![6](<Screenshot 2024-11-06 114144.png>)
  
- **Docker Installation**: Another playbook automates Docker installation and configuration, setting up Docker services and ensuring the system is ready to run containers for the application.

![7](<Screenshot 2024-11-06 114622.png>)

These playbooks simplify the setup process, enabling quick deployment and consistent configuration of GitLab and Docker across multiple environments.

