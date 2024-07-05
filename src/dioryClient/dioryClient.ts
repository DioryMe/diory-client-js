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
import { debounce } from '../utils/debounce'

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

    this.diosphere.saveDiosphere = debounce(this.saveDiosphere, 1000)
    this.diograph.saveDiograph = debounce(this.saveDiograph, 1000)
  }

  focusDiory = (dioryObject: IDioryObject): IDiory => {
    return (this.diory = this.diograph.getDiory(dioryObject))
  }

  selectRoom = (roomObject: IRoomObject): IRoom => {
    return (this.room = this.diosphere.getRoom(roomObject))
  }

  getDiographClients = (connections?: IConnectionObject[]) => {
    return getConnectionClients(this.dataClients, connections ?? this.room?.connections)
  }

  initialiseDiograph = async (roomObject: IRoomObject): Promise<IDiograph> => {
    console.info('initialiseDiograph', roomObject)
    this.selectRoom(roomObject)

    this.diograph.resetDiograph()
    const diographObject = (await this.getDiograph()) ?? getDefaultDiograph()
    this.diograph.addDiograph(diographObject)

    this.focusDiory({ id: '/' })

    console.info(this.diograph.toObject())
    return this.diograph
  }

  getDiograph = async (): Promise<IDiographObject | undefined> => {
    console.info('getDiograph')

    let diographObject
    await Promise.all(
      this.getDiographClients().map(async (connectionClient) => {
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

  saveDiograph = async (): Promise<IDiographObject> => {
    console.info('saveDiograph')

    const diographObject = this.diograph.toObject()
    await Promise.all(
      this.getDiographClients().map(async (connectionClient) => {
        await connectionClient.saveDiograph(diographObject)
        console.info(diographObject)
        return
      }),
    )

    return diographObject
  }

  importDiograph = async (): Promise<IDiograph> => {
    const diographObject = await this.generateDiograph()

    if (diographObject) {
      const diory = this.diory?.toObject()
      Object.entries(diographObject).forEach(([key, dioryObject]) => {
        try {
          key === '/' && diory
            ? this.diograph.addDioryLink(diory, diographObject['/'])
            : this.diograph.addDiory(dioryObject)
        } catch (error) {
          console.error(error)
        }
      })

      await this.saveDiograph()
      console.info(this.diograph.toObject())
    }

    return this.diograph
  }

  generateDiograph = async (): Promise<IDiographObject | undefined> => {
    console.info('generateDiograph')

    let diographObject
    await Promise.all(
      this.getDiographClients().map(async (connectionClient) => {
        diographObject = await connectionClient.generateDiograph()
        console.info(diographObject)
        return
      }),
    )

    return diographObject
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

    this.selectRoom({ id: '/' })

    console.info(this.diosphere.toObject())
    return this.diosphere
  }

  getDiosphere = async (): Promise<IDiosphereObject | undefined> => {
    console.info('getDiosphere')

    let diosphereObject
    await Promise.all(
      this.getDiosphereClients().map(async (connectionClient) => {
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

  saveDiosphere = async (): Promise<IDiosphereObject> => {
    console.info('saveDiosphere')

    const diosphereObject = this.diosphere.toObject()
    await Promise.all(
      this.getDiosphereClients().map(async (connectionClient) => {
        await connectionClient.saveDiosphere(diosphereObject)
        console.info(diosphereObject)
        return
      }),
    )

    return diosphereObject
  }
}

export { DioryClient }
