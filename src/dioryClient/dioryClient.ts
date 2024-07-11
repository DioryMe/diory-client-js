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
  IConnectionClient,
} from '@diory/types'

import { IDioryClient } from '../types'

import { addDefaultRoom } from '../utils/addDefaultRoom'
import { addDefaultDiograph } from '../utils/addDefaultDiograph'

class DioryClient implements IDioryClient {
  dataClients: IDataClient[]
  diosphere: IDiosphere
  diograph: IDiograph
  room?: IRoom
  diory?: IDiory

  constructor(dataClients: IDataClient[]) {
    this.dataClients = dataClients
    this.diosphere = new Diosphere()
    this.diograph = new Diograph()
  }

  initialiseDiosphere = async (connections: IConnectionObject[]): Promise<IDiosphere> => {
    console.info('initialiseDiosphere: connections', connections)

    const connectionClient: IConnectionClient = new ConnectionClient(this.dataClients, connections)
    this.diosphere.connect(connectionClient)
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
      const connectionClient: IConnectionClient = new ConnectionClient(
        this.dataClients,
        this.room?.connections,
      )
      this.diograph.connect(connectionClient)
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
