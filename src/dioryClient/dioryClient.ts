import { Diosphere, IConnectionObject, IDiosphere, IRoom, IRoomObject } from '@diory/diosphere-js'
import { Diograph, IDiograph, IDiory, IDioryObject } from '@diograph/diograph'

import { IDioryClient, IDataClient } from '../types'
import { getConnectionClients } from '../utils/getConnectionClients'

class DioryClient implements IDioryClient {
  dataClients: IDataClient[] = []
  connections: IConnectionObject[] = []
  diosphere: IDiosphere
  room?: IRoom
  diograph: IDiograph
  diory?: IDiory

  constructor(dataClients: IDataClient[]) {
    this.dataClients = dataClients

    this.diosphere = new Diosphere()
    this.diograph = new Diograph()

    this.diosphere.saveDiosphere = this.saveDiosphere
    this.diograph.saveDiograph = this.saveDiograph
  }

  initialise = async (connections: IConnectionObject[]): Promise<IDioryClient> => {
    this.connections = connections

    this.diosphere.resetRooms()
    await this.getDiosphere()
    await this.enterRoom({ id: '/' })

    return this
  }

  enterRoom = async (roomObject: IRoomObject): Promise<IRoom> => {
    this.room = this.diosphere.getRoom(roomObject)

    this.diograph.resetDiograph()
    await this.getDiograph()
    this.focusDiory({ id: '/' })

    await this.generateDiograph()

    return this.room
  }

  focusDiory = (dioryObject: IDioryObject): IDiory => {
    return (this.diory = this.diograph.getDiory(dioryObject))
  }

  getDiosphere = async (): Promise<IDiosphere> => {
    console.info('getDiosphere', this.connections)
    if (this.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          const diosphereObject = await connectionClient.getDiosphere()
          console.info(diosphereObject)
          return this.diosphere.addDiosphere(diosphereObject)
        }),
      )
    }

    return this.diosphere
  }

  saveDiosphere = async (): Promise<IDiosphere> => {
    console.info('saveDiosphere', this.connections)
    if (this.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          console.info(this.diosphere.toObject())
          await connectionClient.saveDiosphere(this.diosphere.toObject())
          return
        }),
      )
    }

    return this.diosphere
  }

  getDiograph = async (): Promise<IDiograph> => {
    console.info('getDiograph', this.room?.connections)
    if (this.room?.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.room.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          const diographObject = await connectionClient.getDiograph()
          console.info(diographObject)
          this.diograph.addDiograph(diographObject)
          return
        }),
      )
    }

    return this.diograph
  }

  saveDiograph = async (): Promise<IDiograph> => {
    console.info('saveDiograph', this.room?.connections)
    if (this.room?.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.room.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          console.info(this.diograph.toObject())
          await connectionClient.saveDiograph(this.diograph.toObject())
          return
        }),
      )
    }

    return this.diograph
  }

  generateDiograph = async (): Promise<IDiograph> => {
    console.info('generateDiograph', this.room?.connections)
    if (this.room?.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.room?.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          const diographObject = await connectionClient.generateDiograph()
          console.info(diographObject)
          this.diograph.addDiograph(diographObject)

          await connectionClient.saveDiograph(this.diograph.toObject())
          return
        }),
      )
    }

    return this.diograph
  }
}

export { DioryClient }
