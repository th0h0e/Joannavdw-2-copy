import { join } from 'node:path'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

const dataStorage = createStorage({
  driver: fsDriver({
    base: join(process.cwd(), '.data'),
  }),
})

const defaults = {
  mobile: 1.4,
  tablet: 2.5,
  desktop: 2.25,
  largeDesktop: 3,
}

export default defineEventHandler(async () => {
  const fontSizes = await dataStorage.getItem('font-sizes.json')
  return fontSizes || defaults
})
