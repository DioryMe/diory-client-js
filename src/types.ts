import {
  IConnectionObject,
  IDiosphere,
  IDiosphereObject,
  IRoom,
  IRoomObject,
} from '@diory/diosphere-js'
import { IDiograph, IDiory } from '@diograph/diograph'
import { IDiographObject, IDioryObject } from '@diograph/diograph'

export interface IDataClient {
  type: string
  readTextItem(url: string): Promise<string>
  readItem(url: string): Promise<Buffer>
  readToStream(url: string): any
  exists(url: string): Promise<boolean>
  writeTextItem(url: string, fileContent: string): Promise<boolean>
  writeItem(url: string, fileContent: Buffer | string): Promise<boolean>
  deleteItem(url: string): Promise<boolean>
  deleteFolder(url: string): Promise<void>
  list(url: string): Promise<string[]>
}

export interface IConnectionClient {
  type: string
  client: IDataClient
  connection: IConnectionObject
  getDiosphere: () => Promise<IDiosphereObject>
  saveDiosphere: (diosphereObject: IDiosphereObject) => void
  getDiograph: () => Promise<IDiographObject>
  saveDiograph: (diographObject: IDiographObject) => void
}

export interface IDioryClient {
  dataClients: IDataClient[]
  connections: IConnectionObject[]
  diosphere: IDiosphere
  room?: IRoom
  diograph: IDiograph
  diory?: IDiory
  initialise: (connections: IConnectionObject[]) => Promise<void>
  enterRoom: (roomObject: IRoomObject) => Promise<void>
  focusDiory: (dioryObject: IDioryObject) => IDiory
  getDiosphere: () => void
  saveDiosphere: () => void
  getDiograph: () => void
  saveDiograph: () => void
}
