import { Diosphere } from '@diory/diosphere-js'
import { Diograph } from '@diograph/diograph'
import { ConnectionClient } from '@diory/connection-client-js'

import {
  IConnectionObject,
  IDiosphere,
  IRoom,
  IRoomObject,
  IDiograph,
  IDiory,
  IDioryObject,
  IDataClient,
} from '@diory/types'

import { IDioryClient } from '../types'

import { addDefaultRoom } from '../utils/addDefaultRoom'
import { addDefaultDiograph } from '../utils/addDefaultDiograph'

class DioryClient implements IDioryClient {
  diosphere: IDiosphere
  diograph: IDiograph
  room?: IRoom
  diory?: IDiory

  constructor(dataClients: IDataClient[]) {
    this.diosphere = new Diosphere(new ConnectionClient(dataClients))
    this.diograph = new Diograph(new ConnectionClient(dataClients))
  }

  initialiseDiosphere = async (connections: IConnectionObject[]): Promise<IDiosphere> => {
    console.info('initialiseDiosphere: connections', connections)

    this.diosphere.initialise(connections)
    await this.diosphere.getDiosphere()

    if (!Object.keys(this.diosphere.rooms)) {
      addDefaultRoom(this.diosphere, connections)
    }

    this.selectRoom({ id: '/' })

    return this.diosphere
  }

  initialiseDiograph = async (roomObject: IRoomObject): Promise<IDiograph> => {
    console.info('initialiseDiograph: room', roomObject)
    this.selectRoom(roomObject)

    if (this.room?.connections) {
      this.diograph.initialise(this.room?.connections)
      await this.diograph.getDiograph()

      if (!Object.keys(this.diograph.diograph)) {
        addDefaultDiograph(this.diograph)
      }

      this.focusDiory({ id: '/' })
    }

    return this.diograph
  }

  selectRoom = (roomObject: IRoomObject): IRoom => {
    return (this.room = this.diosphere.getRoom(roomObject))
  }

  focusDiory = (dioryObject: IDioryObject): IDiory => {
    return (this.diory = this.diograph.getDiory(dioryObject))
  }
}

export { DioryClient }
