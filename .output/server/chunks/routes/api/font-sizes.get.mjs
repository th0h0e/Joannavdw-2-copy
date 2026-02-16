import { d as defineEventHandler, a as createStorage } from '../../nitro/nitro.mjs';
import { join } from 'node:path';
import process from 'node:process';
import { f as fsDriver } from '../../_/fs.mjs';
import 'pocketbase';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';
import 'anymatch';

const dataStorage = createStorage({
  driver: fsDriver({
    base: join(process.cwd(), ".data")
  })
});
const defaults = {
  mobile: 1.4,
  tablet: 2.5,
  desktop: 2.25,
  largeDesktop: 3
};
const fontSizes_get = defineEventHandler(async () => {
  const fontSizes = await dataStorage.getItem("font-sizes.json");
  return fontSizes || defaults;
});

export { fontSizes_get as default };
//# sourceMappingURL=font-sizes.get.mjs.map
