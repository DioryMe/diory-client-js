import { IDataClient } from '@diory/types'
import { IDiograph } from '@diograph/diograph'

export type IConnectionObject = {
  client: string
  path: string
  id: string
}

export interface IDioryClient {
  diographs: { [address: string]: IDiograph }
  dataClients: IDataClient[]
  getDiograph: (address: string) => IDiograph | undefined
  generateDiograph: (address: string) => Promise<IDioryClient>
  fetchDiograph: (address: string) => Promise<IDioryClient>
  saveDiograph: (address: string) => () => void
}
