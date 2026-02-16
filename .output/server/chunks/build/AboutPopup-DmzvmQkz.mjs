import { v as vueExports, an as fetchDefaults, J as useAsyncData, ao as useRequestFetch, u as useRuntimeConfig, s as serverRenderer_cjs_prodExports, am as requireShared_cjs_prod } from './server.mjs';
import { P as ProjectCardSVG } from './JVDW WEB LIGHT BOX copy-sd8M1dxc.mjs';
import { V as hash } from '../nitro/nitro.mjs';
import 'tailwindcss/colors';
import 'consola';
import 'http';
import 'https';
import 'stream';
import 'url';
import 'node:stream';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'pocketbase';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'ipx';

var shared_cjs_prodExports = /* @__PURE__ */ requireShared_cjs_prod();
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = vueExports.computed(() => vueExports.toValue(request));
  const key = vueExports.computed(() => vueExports.toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    ...fetchOptions
  } = opts;
  const _fetchOptions = vueExports.reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  const asyncData = useAsyncData(watchSources === false ? key.value : key, (_, { signal }) => {
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!vueExports.toValue(opts.baseURL) || vueExports.toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  const segments = [
    vueExports.toValue(opts.method)?.toUpperCase() || "GET",
    vueExports.toValue(opts.baseURL)
  ];
  for (const _obj of [opts.query || opts.params]) {
    const obj = vueExports.toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[vueExports.toValue(key)] = vueExports.toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = vueExports.toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const obj = {};
      for (const entry of value.entries()) {
        const [key, val] = entry;
        obj[key] = val instanceof File ? val.name : val;
      }
      segments.push(hash(obj));
    } else if (shared_cjs_prodExports.isPlainObject(value)) {
      segments.push(hash(vueExports.reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const Asset7Logo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_2'%20data-name='Layer%202'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20152.29%2030.46'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%23fff;%20}%20%3c/style%3e%3c/defs%3e%3cg%20id='Layer_1-2'%20data-name='Layer%201'%3e%3cg%3e%3cpath%20class='cls-1'%20d='M0,30.46c2.52-1.4,2.99-3.78,2.99-9.9V4.03c0-1.87-.54-3.06-1.66-3.67h9.61c-1.12.61-1.66,1.8-1.66,3.67v16.52c0,7.31-4.14,9.29-9.29,9.9Z'/%3e%3cpath%20class='cls-1'%20d='M27.29,24.62c-7.96,0-12.85-5.4-12.85-12.31S19.33,0,27.29,0s12.85,5.44,12.85,12.31-4.82,12.31-12.85,12.31ZM21.28,12.31c0,6.44,1.91,9.29,6.01,9.29s5.98-2.84,5.98-9.29-1.84-9.29-5.98-9.29-6.01,2.88-6.01,9.29Z'/%3e%3cpath%20class='cls-1'%20d='M40.65,24.26c1.15-.79,1.76-1.91,2.52-3.49l7.99-16.52c-.94-1.91-1.58-3.28-3.46-3.89h8.75c.11.94.58,1.87,1.01,2.77l8.96,18.79c.47.97.94,1.91,1.73,2.34h-9.61c1.51-.68,1.4-1.69.94-2.66l-1.08-2.23h-11.09l-.61,1.26c-.9,1.84-.4,2.92,1.08,3.64h-7.13ZM48.67,16.56h8.39l-4.18-8.82-4.21,8.82Z'/%3e%3cpath%20class='cls-1'%20d='M70.25,24.26c1.12-.61,1.76-1.8,1.76-3.67V4.03c0-1.87-.65-3.06-1.76-3.67h7.99c.32,1.12.86,2.02,1.87,3.38l9.72,13.1V4.03c0-1.87-.61-3.06-1.73-3.67h6.66c-1.12.61-1.73,1.8-1.73,3.67v16.56c0,1.44.29,2.81,1.01,3.67h-7.2c-.07-.9-.47-1.8-1.22-2.81l-10.44-13.86v13c0,1.87.65,3.06,1.76,3.67h-6.7Z'/%3e%3cpath%20class='cls-1'%20d='M98.08,24.26c1.12-.61,1.76-1.8,1.76-3.67V4.03c0-1.87-.65-3.06-1.76-3.67h7.99c.32,1.12.86,2.02,1.87,3.38l9.72,13.1V4.03c0-1.87-.61-3.06-1.73-3.67h6.66c-1.12.61-1.73,1.8-1.73,3.67v16.56c0,1.44.29,2.81,1.01,3.67h-7.2c-.07-.9-.47-1.8-1.22-2.81l-10.44-13.86v13c0,1.87.65,3.06,1.76,3.67h-6.7Z'/%3e%3cpath%20class='cls-1'%20d='M124.79,24.26c1.15-.79,1.76-1.91,2.52-3.49l7.99-16.52c-.94-1.91-1.59-3.28-3.46-3.89h8.75c.11.94.58,1.87,1.01,2.77l8.96,18.79c.47.97.94,1.91,1.73,2.34h-9.61c1.51-.68,1.4-1.69.94-2.66l-1.08-2.23h-11.09l-.61,1.26c-.9,1.84-.39,2.92,1.08,3.64h-7.13ZM132.81,16.56h8.39l-4.18-8.82-4.21,8.82Z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
const Asset11Logo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_2'%20data-name='Layer%202'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20280.68%2025.34'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%23fff;%20}%20%3c/style%3e%3c/defs%3e%3cg%20id='Layer_1-2'%20data-name='Layer%201'%3e%3cg%3e%3cpath%20class='cls-1'%20d='M1.98,3.06c-.47-.97-1.08-1.94-1.98-2.34h10.01c-1.55.79-1.33,1.55-.79,2.66l5.36,11.2,4.57-10.22c.76-1.66.36-2.92-1.12-3.64h7.27c-1.22.79-1.84,1.94-2.59,3.49l-8.39,17.93c-.61,1.3-.97,2.3-1.22,3.2L1.98,3.06Z'/%3e%3cpath%20class='cls-1'%20d='M21.65,24.62c1.15-.79,1.76-1.91,2.52-3.49l7.99-16.52c-.94-1.91-1.58-3.28-3.46-3.89h8.75c.11.94.58,1.87,1.01,2.77l8.96,18.79c.47.97.94,1.91,1.73,2.34h-9.61c1.51-.68,1.4-1.69.94-2.66l-1.08-2.23h-11.09l-.61,1.26c-.9,1.84-.4,2.92,1.08,3.64h-7.13ZM29.68,16.92h8.39l-4.18-8.82-4.21,8.82Z'/%3e%3cpath%20class='cls-1'%20d='M51.26,24.62c1.12-.61,1.76-1.8,1.76-3.67V4.39c0-1.87-.65-3.06-1.76-3.67h7.99c.32,1.12.86,2.02,1.87,3.38l9.72,13.1V4.39c0-1.87-.61-3.06-1.73-3.67h6.66c-1.12.61-1.73,1.8-1.73,3.67v16.56c0,1.44.29,2.81,1.01,3.67h-7.2c-.07-.9-.47-1.8-1.22-2.81l-10.44-13.86v13c0,1.87.65,3.06,1.76,3.67h-6.7Z'/%3e%3cpath%20class='cls-1'%20d='M87.71,24.62c1.12-.61,1.66-1.8,1.66-3.67V4.39c0-1.87-.54-3.06-1.66-3.67h10.8c9.65,0,13.86,5.08,13.86,11.95s-4.21,11.95-13.86,11.95h-10.8ZM95.67,21.56l2.84.04c5.26,0,6.98-2.84,6.98-8.93,0-5.72-2.09-8.93-6.98-8.93l-2.84.04v17.78Z'/%3e%3cpath%20class='cls-1'%20d='M136.23,24.98c-1.01-.36-2.02-.36-3.02-.36h-17.21c1.12-.61,1.66-1.8,1.66-3.67V4.39c0-1.87-.54-3.06-1.66-3.67h16.2c1.4,0,2.16-.04,2.92-.72v8.5c-1.26-3.6-2.88-4.75-6.26-4.75h-4.9v7.38h4.28c1.4,0,2.81-.11,3.67-2.63v7.92c-.86-2.2-2.27-2.3-3.67-2.3h-4.28v7.49h6.01c3.38,0,5-1.33,6.26-5.22v8.6Z'/%3e%3cpath%20class='cls-1'%20d='M139.95,24.62c1.12-.61,1.66-1.8,1.66-3.67V4.39c0-1.87-.54-3.06-1.66-3.67h11.23c6.62,0,10.8,1.76,10.8,6.73,0,4.68-3.78,6.41-8.32,6.7,3.67.11,4.68.79,5.76,2.74l2.7,4.61c.9,1.51,1.48,2.23,2.88,3.13h-9.58c.72-.58.76-1.22.14-2.3l-3.13-5.36c-.83-1.44-1.51-1.84-2.84-1.84h-1.69v5.83c0,1.87.54,3.06,1.66,3.67h-9.61ZM147.91,12.24h3.28c2.77,0,4.25-1.15,4.25-4.25s-1.48-4.25-4.25-4.25h-3.28v8.5Z'/%3e%3cpath%20class='cls-1'%20d='M174.55,3.06c-.43-1.01-1.08-1.94-1.98-2.34h9.72c-1.15.72-1.19,1.69-.61,3.1l3.92,9.86,3.56-8.93c-1.15-2.56-1.84-3.71-2.48-4.03h9.18c-1.08.65-1.22,1.66-.58,3.17l3.96,9.86,3.6-9.4c.68-1.76.32-2.92-1.15-3.64h7.09c-1.22.79-1.94,1.87-2.59,3.46l-7.31,18.14c-.5,1.26-.76,2.12-.97,2.99l-7.16-16.85-5.51,13.75c-.5,1.3-.79,2.23-.97,3.1l-9.72-22.25Z'/%3e%3cpath%20class='cls-1'%20d='M231.07,24.98c-1.01-.36-2.02-.36-3.02-.36h-17.21c1.12-.61,1.66-1.8,1.66-3.67V4.39c0-1.87-.54-3.06-1.66-3.67h16.2c1.4,0,2.16-.04,2.92-.72v8.5c-1.26-3.6-2.88-4.75-6.26-4.75h-4.9v7.38h4.28c1.4,0,2.81-.11,3.67-2.63v7.92c-.86-2.2-2.27-2.3-3.67-2.3h-4.28v7.49h6.01c3.38,0,5-1.33,6.26-5.22v8.6Z'/%3e%3cpath%20class='cls-1'%20d='M234.79,24.62c1.12-.61,1.66-1.8,1.66-3.67V4.39c0-1.87-.54-3.06-1.66-3.67h11.23c6.62,0,10.8,1.76,10.8,6.73,0,4.68-3.78,6.41-8.32,6.7,3.67.11,4.68.79,5.76,2.74l2.7,4.61c.9,1.51,1.48,2.23,2.88,3.13h-9.58c.72-.58.76-1.22.14-2.3l-3.13-5.36c-.83-1.44-1.51-1.84-2.84-1.84h-1.69v5.83c0,1.87.54,3.06,1.66,3.67h-9.61ZM242.75,12.24h3.28c2.77,0,4.25-1.15,4.25-4.25s-1.48-4.25-4.25-4.25h-3.28v8.5Z'/%3e%3cpath%20class='cls-1'%20d='M261.56,24.62c1.12-.61,1.66-1.8,1.66-3.67V4.39c0-1.87-.54-3.06-1.66-3.67h16.2c1.4,0,2.16-.04,2.92-.72v8.5c-1.26-3.53-2.84-4.75-6.26-4.75h-4.9v7.38h4.28c1.4,0,2.81-.11,3.67-2.63v7.92c-.86-2.2-2.27-2.3-3.67-2.3h-4.28v6.3c0,2.16,1.04,3.6,3.24,4.21h-11.2Z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
function useAboutData() {
  const config = useRuntimeConfig();
  const { data: response, status, error, refresh } = useFetch(
    `${config.public.pbUrl}/api/collections/About/records`,
    {
      key: "about"
    },
    "$FPKwY6qm__"
    /* nuxt-injected */
  );
  const loading = vueExports.computed(() => status.value === "pending");
  const hasError = vueExports.computed(() => !!error.value);
  const aboutData = vueExports.computed(() => {
    return response.value?.items.find((item) => item.Is_Active) ?? null;
  });
  return { aboutData, loading, hasError, error, refresh };
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AboutPopup",
  __ssrInlineRender: true,
  setup(__props) {
    const { aboutData } = useAboutData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "popup-container" }, _attrs))}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(ProjectCardSVG))} alt="About Card" class="popup-card-image"><div class="absolute inset-0 flex flex-col justify-between px-4 py-8"><div class="flex justify-center"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(Asset7Logo))} alt="Joanna Logo" class="h-auto w-[4.5rem] brightness-0"></div><div class="flex flex-1 flex-col justify-center"><h2 class="text-popup-title">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aboutData)?.Portfolio_Title || "Story Driven Strategy")}</h2><p class="text-popup-body">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aboutData)?.About_Description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit, eu porta ligula mattis. Phasellus mattis rutrum elit, sed cursus risus tempus quis. Mauris sed ante et lectus consectetur aliquet. Sed in orci a metus aliquam porttitor.")}</p><h3 class="text-popup-title">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aboutData)?.Expertise_Title || "Expertise")}</h3><p class="text-popup-body">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aboutData)?.Expertise_Description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit.")}</p><h3 class="text-popup-title">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aboutData)?.Selected_Clients_Title || "Selected Clients")}</h3><p class="text-popup-body">${serverRenderer_cjs_prodExports.ssrInterpolate((vueExports.unref(aboutData)?.Client_List_Json || [])?.join(", ") || "Ipsum, Dolor, Sit Amet, Consectetur, Adipiscing, Aenean, Mattis, Blandit.")}</p><button class="text-popup-link">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(aboutData)?.Contact_Message || "Get in touch")}</button></div><div class="flex justify-center"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(Asset11Logo))} alt="Van Der Weg Logo" class="h-auto w-32 brightness-0"></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutPopup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "AboutPopup" });
const AboutPopup = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_7
}, Symbol.toStringTag, { value: "Module" }));

export { Asset7Logo as A, __nuxt_component_7 as _, Asset11Logo as a, useAboutData as b, AboutPopup as c, useFetch as u };
//# sourceMappingURL=AboutPopup-DmzvmQkz.mjs.map
