# Mafialand

Visit deployed site [here](https://mafialand.herokuapp.com/).

## This repo contains Mafialand's backend developed with:

- Node js
- MongoDB
- Express
- Websockets

## Run Locally

### Clone and install dependencies

```bash
gh repo clone frxzn/mafia-api
cd ./mafia-api
npm install
npm install --only=dev
```

### Set enviroment variables

Create a 'config' folder at the root of the project with a 'dev.env' file containing the following:

- PORT=4000
- MONGODB_URL=mongodb://127.0.0.1:27017/mafia-api
- JWT_SECRET=YOUR_JWT_SECRET
- NODE_ENV=DEV

### Start up your local MongoDB instance

```
.\YOUR\PATH\mongodb\bin\mongod.exe --dbpath=\YOUR\PATH\mongodb-data
```

### Seed database with roles

```
npm run seed
npm run seedTest
```

### Start server

```
npm run dev
```

### Run unit tests

```
npm run test
```
