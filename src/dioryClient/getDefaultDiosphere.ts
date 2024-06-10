import { Diosphere, IConnectionObject, IDiosphereObject } from '@diory/diosphere-js'

export const getDefaultDiosphere = (connections: IConnectionObject[]): IDiosphereObject => {
  const diosphere = new Diosphere()
  diosphere.addRoom(
    {
      text: 'Room',
      connections,
    },
    '/',
  )

  return diosphere.toObject()
}
