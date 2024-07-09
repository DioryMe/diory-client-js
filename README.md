# Diosphere

## Install

```
npm install @diory/client-js
# or
yarn add @diory/client-js
```

## Usage

```
const clients = [localClient, S3Client, ...]
const dioryClient = DioryClient(clients)
dioryClient.initialiseDiosphere([connections])
diosphere.initialise([connection])
diosphere.enterRoom(room)
diograph.focusDiory(diory)
console.log('Hello Diosphere!', diosphere.toObject())
```

### Internal methods

```
client.getDiosphere()
client.saveDiosphere()
client.getDiograph()
client.saveDiograph()
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
