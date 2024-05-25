import { IConnectionObject } from '@diory/diosphere-js'

import { ConnectionClient } from '../connectionClient/connectionClient'
import { IConnectionClient, IDataClient } from '../types'

function getDataClient(
  dataClients: IDataClient[],
  { client }: IConnectionObject,
): IDataClient | undefined {
  return dataClients.find(({ type }) => type === client)
}

export function getConnectionClients(
  dataClients: IDataClient[],
  connections?: IConnectionObject[],
): IConnectionClient[] {
  return connections
    ?.filter(({ client }) => dataClients.some(({ type }) => type === client))
    .map((connection) => {
      const dataClient = getDataClient(dataClients, connection)
      return new ConnectionClient(dataClient!, connection)
    }) as IConnectionClient[]
}
