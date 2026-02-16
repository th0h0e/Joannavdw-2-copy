import { d as defineEventHandler, g as getAuthenticatedPb, r as readMultipartFormData, c as createError, a as createStorage } from '../../nitro/nitro.mjs';
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

const assetStorage = createStorage({
  driver: fsDriver({
    base: join(process.cwd(), "public", "assets")
  })
});
const favicon_put = defineEventHandler(async (event) => {
  getAuthenticatedPb(event);
  try {
    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      throw createError({ statusCode: 400, message: "No file provided" });
    }
    const iconFile = form.find((item) => item.name === "icon");
    if (!iconFile || !iconFile.data) {
      throw createError({ statusCode: 400, message: "Icon file is required" });
    }
    const contentType = iconFile.type || "";
    if (!contentType.startsWith("image/")) {
      throw createError({ statusCode: 400, message: "File must be an image" });
    }
    await assetStorage.setItemRaw("favicon.ico", iconFile.data);
    return {
      success: true,
      message: "Favicon updated successfully",
      url: "/assets/favicon.ico"
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to update favicon: ${error}`
    });
  }
});

export { favicon_put as default };
//# sourceMappingURL=favicon.put.mjs.map
