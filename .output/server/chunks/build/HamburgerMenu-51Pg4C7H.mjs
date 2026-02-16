import { u as usePortfolioProjects, _ as __nuxt_component_0 } from './index-CA6a8yDh.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './AboutPopup-DmzvmQkz.mjs';
import './JVDW WEB LIGHT BOX copy-sd8M1dxc.mjs';
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
import './useDevice-S3-EEo3A.mjs';
import './index-CtsWe4-H.mjs';
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
  __name: "HamburgerMenu",
  __ssrInlineRender: true,
  props: {
    isPopupVisible: { type: Boolean, default: false }
  },
  setup(__props) {
    const { projectTitles } = usePortfolioProjects();
    const isOpen = vueExports.ref(false);
    vueExports.ref([]);
    function closeMenu() {
      isOpen.value = false;
    }
    function handleLinkClick(index) {
      closeMenu();
      return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProjectNavigation = __nuxt_component_0;
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (!__props.isPopupVisible) {
          _push2(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "hamburger-button--open": vueExports.unref(isOpen) }, "hamburger-button"])}" aria-label="Toggle menu" data-v-966e3871><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([[vueExports.unref(isOpen) ? "hamburger-icon--open" : "hamburger-icon--closed"], "hamburger-icon pointer-events-none"])}" data-v-966e3871></div></button>`);
        } else {
          _push2(`<!---->`);
        }
        if (vueExports.unref(isOpen)) {
          _push2(`<div class="menu-backdrop" role="button" tabindex="0" aria-label="Close menu" data-v-966e3871></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (vueExports.unref(isOpen)) {
          _push2(`<div class="menu-content" data-v-966e3871><div class="pointer-events-auto flex w-full items-center justify-center" data-v-966e3871>`);
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectNavigation, {
            "project-titles": vueExports.unref(projectTitles),
            onLinkClick: handleLinkClick
          }, null, _parent));
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HamburgerMenu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HamburgerMenu = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-966e3871"]]), { __name: "HamburgerMenu" });

export { HamburgerMenu as default };
//# sourceMappingURL=HamburgerMenu-51Pg4C7H.mjs.map
