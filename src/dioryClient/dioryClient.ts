import {
  Diosphere,
  IConnectionObject,
  IDiosphere,
  IDiosphereObject,
  IRoom,
  IRoomObject,
} from '@diory/diosphere-js'
import { Diograph, IDiograph, IDiographObject, IDiory, IDioryObject } from '@diograph/diograph'

import { IDioryClient, IDataClient } from '../types'
import { getConnectionClients } from '../utils/getConnectionClients'

import { getDefaultDiosphere } from './getDefaultDiosphere'
import { getDefaultDiograph } from './getDefaultDiograph'

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

  selectRoom = (roomObject: IRoomObject): IRoom => {
    return (this.room = this.diosphere.getRoom(roomObject))
  }

  getDiosphereClients = (connections?: IConnectionObject[]) => {
    return getConnectionClients(this.dataClients, connections ?? this.connections)
  }

  initialiseDiosphere = async (connections: IConnectionObject[]): Promise<IDiosphere> => {
    console.info('initialiseDiosphere', connections)
    this.connections = connections

    this.diosphere.resetRooms()
    const diosphereObject = (await this.getDiosphere()) ?? getDefaultDiosphere(connections)
    this.diosphere.addDiosphere(diosphereObject)
    await this.saveDiosphere()

    this.selectRoom({ id: '/' })

    console.info(this.diosphere.toObject())
    return this.diosphere
  }

  getDiosphere = async (
    connections?: IConnectionObject[],
  ): Promise<IDiosphereObject | undefined> => {
    console.info('getDiosphere', connections)

    let diosphereObject
    await Promise.all(
      this.getDiosphereClients(connections).map(async (connectionClient) => {
        try {
          diosphereObject = await connectionClient.getDiosphere()
          console.info(diosphereObject)
        } catch (error) {
          console.error(error)
        }
        return
      }),
    )

    return diosphereObject
  }

  saveDiosphere = async (connections?: IConnectionObject[]): Promise<IDiosphereObject> => {
    console.info('saveDiosphere', connections)

    const diosphereObject = this.diosphere.toObject()
    await Promise.all(
      this.getDiosphereClients(connections).map(async (connectionClient) => {
        await connectionClient.saveDiosphere(diosphereObject)
        console.info(diosphereObject)
        return
      }),
    )

    return diosphereObject
  }

  getDiographClients = (connections?: IConnectionObject[]) => {
    return getConnectionClients(this.dataClients, connections ?? this.room?.connections)
  }

  focusDiory = (dioryObject: IDioryObject): IDiory => {
    return (this.diory = this.diograph.getDiory(dioryObject))
  }

  initialiseDiograph = async (roomObject: IRoomObject): Promise<IDiograph> => {
    console.info('initialiseDiograph', roomObject)
    this.selectRoom(roomObject)

    this.diograph.resetDiograph()
    const diographObject = (await this.getDiograph()) ?? getDefaultDiograph()
    this.diograph.addDiograph(diographObject)
    await this.saveDiograph()

    this.focusDiory({ id: '/' })

    console.info(this.diograph.toObject())
    return this.diograph
  }

  getDiograph = async (connections?: IConnectionObject[]): Promise<IDiographObject | undefined> => {
    console.info('getDiograph', connections)

    let diographObject
    await Promise.all(
      this.getDiographClients(connections).map(async (connectionClient) => {
        try {
          diographObject = await connectionClient.getDiograph()
          console.info(diographObject)
        } catch (error) {
          console.error(error)
        }
        return
      }),
    )

    return diographObject
  }

  saveDiograph = async (connections?: IConnectionObject[]): Promise<IDiographObject> => {
    console.info('saveDiograph', connections)

    const diographObject = this.diograph.toObject()
    await Promise.all(
      this.getDiographClients(connections).map(async (connectionClient) => {
        await connectionClient.saveDiograph(diographObject)
        console.info(diographObject)
        return
      }),
    )

    return diographObject
  }

  generateDiograph = async (connections?: IConnectionObject[]): Promise<IDiograph> => {
    console.info('generateDiograph', connections)

    await Promise.all(
      this.getDiographClients(connections).map(async (connectionClient) => {
        const diographObject = await connectionClient.generateDiograph()
        Object.entries(diographObject).forEach(([key, dioryObject]) => {
          key === '/'
            ? this.diograph.addDioryLink({ id: '/' }, diographObject['/'])
            : this.diograph.addDiory(dioryObject)
        })

        await connectionClient.saveDiograph(this.diograph.toObject())
        console.info(this.diograph.toObject())

        return
      }),
    )

    return this.diograph
  }
}

export { DioryClient }
