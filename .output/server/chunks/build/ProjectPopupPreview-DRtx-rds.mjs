import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { P as ProjectCardSVG } from './JVDW WEB LIGHT BOX copy-sd8M1dxc.mjs';
import '../nitro/nitro.mjs';
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
import 'consola';
import 'ipx';
import 'tailwindcss/colors';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectPopupPreview",
  __ssrInlineRender: true,
  props: {
    projectTitle: {},
    projectDescription: {},
    projectResponsibility: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative w-[280px]" }, _attrs))}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(ProjectCardSVG))} alt="Project Card" class="h-auto w-[280px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)]"><div class="absolute inset-0 flex flex-col justify-center px-4 py-8"><h2 class="text-popup-title text-black">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.projectTitle)}</h2><div class="text-popup-title text-black"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(__props.projectResponsibility, (responsibility, index) => {
        _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(responsibility)}`);
        if (index < __props.projectResponsibility.length - 1) {
          _push(`<br>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span>`);
      });
      _push(`<!--]--></div><p class="text-popup-body text-black">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.projectDescription)}</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/components/ProjectPopupPreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProjectPopupPreview = Object.assign(_sfc_main, { __name: "ProjectPopupPreview" });

export { ProjectPopupPreview as default };
//# sourceMappingURL=ProjectPopupPreview-DRtx-rds.mjs.map
