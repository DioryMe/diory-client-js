import { join } from 'path-browserify'
import { IDataClient } from '@diory/types'
import { Diograph, IDiograph, IDiographObject } from '@diograph/diograph'
import { generateDiograph } from '@diograph/folder-generator'

import { IConnectionObject, IDioryClient } from '../types'

import { debounce } from '../utils/debounce'

const resolveConnection = (address: string): IConnectionObject => {
  const addressArray = (address || '').split('/') || []
  return {
    client: addressArray[0],
    path: addressArray.slice(1, -1).join('/'),
    id: addressArray[addressArray.length - 1],
  }
}

const getDiographKey = (connection: IConnectionObject) => `${connection.client}/${connection.path}`

const findDataClient = (dataClients: IDataClient[], client: string): IDataClient | undefined => {
  return dataClients.find(({ type }) => type === client)
}

const DIOGRAPH_JSON = 'diograph.json'

export class DioryClient implements IDioryClient {
  diographs: { [address: string]: IDiograph } = {}
  dataClients: IDataClient[]

  constructor(dataClients: IDataClient[]) {
    this.dataClients = dataClients
  }

  addDiograph = (address: string, diographObject: IDiographObject): IDioryClient => {
    const connection = resolveConnection(address)
    const diographKey = getDiographKey(connection)
    this.diographs[diographKey] = new Diograph(this.saveDiograph(address)).addDiograph(
      diographObject,
    )
    return this
  }

  getDiograph = (address: string): IDiograph | undefined => {
    const connection = resolveConnection(address)
    const diographKey = getDiographKey(connection)
    return this.diographs[diographKey]
  }

  fetchDiograph = async (address: string): Promise<IDioryClient> => {
    const { client, path } = resolveConnection(address)
    const dataClient = findDataClient(this.dataClients, client)
    if (dataClient) {
      const diographString = await dataClient.readTextItem(join(path, DIOGRAPH_JSON))
      if (diographString) this.addDiograph(address, JSON.parse(diographString))
    }

    return this
  }

  generateDiograph = async (address: string): Promise<IDioryClient> => {
    const { client, path } = resolveConnection(address)
    const dataClient = findDataClient(this.dataClients, client)
    if (dataClient) {
      const diographObject = await generateDiograph(path, '/', dataClient)
      if (diographObject) this.addDiograph(address, diographObject)
    }

    return this
  }

  saveDiograph = (address: string) =>
    debounce(async () => {
      const { client, path } = resolveConnection(address)
      const dataClient = findDataClient(this.dataClients, client)
      if (dataClient) {
        const diograph = this.getDiograph(address)
        if (diograph) dataClient.writeItem(join(path, DIOGRAPH_JSON), diograph.toJson())
      }

      return
    }, 1000)
}
