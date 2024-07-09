import { IConnectionObject, IDiosphere, IRoom, IRoomObject } from '@diory/types'
import { IDiograph, IDiory, IDioryObject } from '@diory/types'

export interface IDioryClient {
  diosphere: IDiosphere
  diograph: IDiograph
  room?: IRoom
  diory?: IDiory
  initialiseDiosphere: (connections: IConnectionObject[]) => Promise<IDiosphere>
  initialiseDiograph: (roomObject: IRoomObject) => Promise<IDiograph>
  selectRoom: (roomObject: IRoomObject) => IRoom
  focusDiory: (dioryObject: IDioryObject) => IDiory
}
