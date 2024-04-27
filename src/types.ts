import {
  IConnectionObject,
  IDiosphere,
  IDiosphereObject,
  IRoom,
  IRoomObject,
} from '@diory/diosphere-js'
import { IDiograph, IDiographObject, IDiory, IDioryObject } from '@diograph/diograph'

export interface IMetadata {
  name: string
  created?: string
  modified?: string
  duration?: string
  thumbnail?: string
  latlng?: string
}

export interface IFileType {
  ext?: string
  mime?: string
}

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
  getFileNames(url: string): Promise<string[]>
  getFolderNames(url: string): Promise<string[]>
  getFileType(url: string): Promise<IFileType>
  getMetadata(url: string): IMetadata
  getThumbnail?(imageUrl: string): Promise<string | undefined>
  getVideoMetadata?(videoUrl: string): Promise<IMetadata>
}

export interface IConnectionClient {
  type: string
  client: IDataClient
  connection: IConnectionObject
  getDiosphere: () => Promise<IDiosphereObject>
  saveDiosphere: (diosphereObject: IDiosphereObject) => void
  getDiograph: () => Promise<IDiographObject>
  saveDiograph: (diographObject: IDiographObject) => void
  generateDiograph: () => Promise<IDiographObject>
}

export interface IDioryClient {
  dataClients: IDataClient[]
  connections: IConnectionObject[]
  diosphere: IDiosphere
  room?: IRoom
  diograph: IDiograph
  diory?: IDiory
  initialise: (connections: IConnectionObject[]) => Promise<IDioryClient>
  enterRoom: (roomObject: IRoomObject) => Promise<IRoom>
  focusDiory: (dioryObject: IDioryObject) => IDiory
  getDiosphere: () => Promise<IDiosphere>
  saveDiosphere: () => Promise<IDiosphere>
  getDiograph: () => Promise<IDiograph>
  saveDiograph: () => Promise<IDiograph>
  generateDiograph: () => Promise<IDiograph>
}
