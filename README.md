# Purple_2048

## Project link

This project is hosted in render the link is [https://purple-2048-bfda.onrender.com](https://purple-2048-bfda.onrender.com)

## Description

Replicate of the game 2048 giving it a new design and new options allowing the user to save 5
different games, this app works on desktop and mobile devices.

This game is a project for the development of web applications and services class, the frontend is HTML, CSS, and JavaScript. The backend is Node.js using express, cors, and jsonwebtoken, and the database is Mongo DB.

This project is setup to use docker, and the docker file is in the root of the project. Also, the project has a github action that runs on every push to the main branch, and it will build the docker image and push it to an AWS ECR repository and then deploy the image to AWS EC2 instances.

## How to run the project

### local

To run the project locally, you need node.js and npm installed on your machine. Then, run the following commands:

```bash
npm install
npm run start
```

### Docker

To run the project using docker, you need to have docker installed on your machine.Then, run the following commands:

```bash
docker build -t purple_2048 .
docker run -p 3000:3000 purple_2048
```

### Development

To run the project in development mode, you need to have node.js and npm installed on your machine. Then, run the following commands:

```bash
npm install
npm run dev
```
