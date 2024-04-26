import { IConnectionObject } from '@diory/diosphere-js'

import { IConnectionClient, IDataClient } from '../types'
import { ConnectionClient } from '../connectionClient'

function getDataClient(
  dataClients: IDataClient[],
  { client }: IConnectionObject,
): IDataClient | undefined {
  return dataClients.find(({ type }) => type === client)
}

export function getConnectionClients(
  dataClients: IDataClient[],
  connections: IConnectionObject[],
): IConnectionClient[] {
  return connections
    .filter(({ client }) => dataClients.some(({ type }) => type === client))
    .map((connection) => {
      const dataClient = getDataClient(dataClients, connection)
      return new ConnectionClient(dataClient!, connection)
    }) as IConnectionClient[]
}