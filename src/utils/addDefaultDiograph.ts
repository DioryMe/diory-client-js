import { IDiograph } from '@diograph/diograph'

export const addDefaultDiograph = (diograph: IDiograph): void => {
  const diory = diograph.addDiory({
    text: 'Welcome to Diory',
    latlng: '60.01366036242365, 20.007133483886722',
  })
  diograph.addDiory(
    {
      text: 'Root diory',
      links: [{ id: diory.id }],
    },
    '/',
  )
}
