# Diosphere

## Install

```
npm install @diory/client-js
# or
yarn add @diory/client-js
```

## Usage

```
const dataClients = [localClient, S3Client, ...]
const dioryClient = new DioryClient(clients)
const diograph = dioryClient.getDiograph(address)
console.log('My Diory', diograph.toObject())
```

### Methods

```
dioryClient.addDiograph(address, diograph)
dioryClient.getDiograph(address)
dioryClient.fetchDiograph(address)
dioryClient.generateDiograph(address)
dioryClient.saveDiograph(address)
```

## Development

Compile typescript in real time to `/dist` folder:

```
yarn build-watch
```

Run unit tests in the background:

```
yarn test-watch
```
