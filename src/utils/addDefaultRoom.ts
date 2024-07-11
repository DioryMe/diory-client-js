import { IConnectionObject, IDiosphere } from '@diory/types'

export const addDefaultRoom = (diosphere: IDiosphere, connections: IConnectionObject[]): void => {
  diosphere.addRoom(
    {
      text: 'Home room',
      connections,
    },
    '/',
  )
}
