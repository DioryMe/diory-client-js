import { IConnectionObject, IDiosphere } from '@diory/diosphere-js'

export const addDefaultRoom = (diosphere: IDiosphere, connections: IConnectionObject[]): void => {
  diosphere.addRoom(
    {
      text: 'Home room',
      connections,
    },
    '/',
  )
}
