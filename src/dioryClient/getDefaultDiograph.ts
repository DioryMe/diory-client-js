import { Diograph, IDiographObject } from '@diograph/diograph'

export const getDefaultDiograph = (): IDiographObject => {
  const diograph = new Diograph()
  const diory = diograph.addDiory({
    text: 'Welcome to Diory',
    latlng: '60.01366036242365, 20.007133483886722',
  })
  diograph.addDiory(
    {
      text: 'Root',
      links: [{ id: diory.id }],
    },
    '/',
  )

  return diograph.toObject()
}
