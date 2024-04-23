import { IDiographObject } from '@diograph/diograph'
import { IConnectionObject, IDiosphereObject } from '@diory/diosphere-js'
import { IConnectionClient, IDataClient } from './types'

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
    const diosphereString = await this.client.readTextItem(this.connection.address)
    return JSON.parse(diosphereString)
  }

  saveDiosphere = async (diosphereObject: IDiosphereObject) => {
    const diosphereString = JSON.stringify(diosphereObject, null, 2)
    return this.client.writeItem(this.connection.address, diosphereString)
  }

  getDiograph = async () => {
    const diographString = await this.client.readTextItem(this.connection.address)
    return JSON.parse(diographString)
  }

  saveDiograph = async (diographObject: IDiographObject) => {
    const diographString = JSON.stringify(diographObject, null, 2)
    return this.client.writeItem(this.connection.address, diographString)
  }
}

export { ConnectionClient }
