import { join } from 'path-browserify'
import { generateDiograph } from '@diograph/folder-generator'

import { IDiographObject } from '@diograph/diograph'
import { IConnectionObject, IDiosphereObject } from '@diory/diosphere-js'
import { IConnectionClient, IDataClient } from './types'

const DIOSPHERE_JSON = 'diosphere.json'
const DIOGRAPH_JSON = 'diograph.json'

class ConnectionClient implements IConnectionClient {
  type: string
  client: IDataClient
  connection: IConnectionObject

  constructor(dataClient: IDataClient, connection: IConnectionObject) {
    this.type = dataClient.type
    this.client = dataClient
    this.connection = connection
  }

  getDiosphere = async () => {
    const path = join(this.connection.address, DIOSPHERE_JSON)
    const diosphereString = await this.client.readTextItem(path)
    return JSON.parse(diosphereString)
  }

  saveDiosphere = async (diosphereObject: IDiosphereObject) => {
    const path = join(this.connection.address, DIOSPHERE_JSON)
    const diosphereString = JSON.stringify(diosphereObject, null, 2)
    return this.client.writeItem(path, diosphereString)
  }

  getDiograph = async () => {
    const path = join(this.connection.address, DIOGRAPH_JSON)
    const diographString = await this.client.readTextItem(path)
    return JSON.parse(diographString)
  }

  saveDiograph = async (diographObject: IDiographObject) => {
    const path = join(this.connection.address, DIOGRAPH_JSON)
    const diographString = JSON.stringify(diographObject, null, 2)
    return this.client.writeItem(path, diographString)
  }

  generateDiograph = async (): Promise<IDiographObject> => {
    const { diograph } = await generateDiograph(this.connection.address) // TODO: Client
    return diograph.toObject()
  }
}

export { ConnectionClient }
