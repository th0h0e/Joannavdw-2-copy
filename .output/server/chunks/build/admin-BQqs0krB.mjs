import { _ as _sfc_main$2, a as _sfc_main$1, b as _sfc_main$3 } from './Input-DiPoUQEC.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, _ as _sfc_main$9, a as __nuxt_component_4, n as navigateTo } from './server.mjs';
import { p as pb } from './pocketbase-DJpo7-rk.mjs';
import './index-CtsWe4-H.mjs';
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

const loginBackground = "" + __buildAssetsURL("admin-login-bg.DU-PuJil.jpg");
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const formState = vueExports.reactive({
      email: "",
      password: ""
    });
    const error = vueExports.ref("");
    const loading = vueExports.ref(false);
    async function handleLogin() {
      error.value = "";
      loading.value = true;
      try {
        await pb.collection("users").authWithPassword(formState.email, formState.password);
        await navigateTo("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        const typedErr = err;
        error.value = typedErr?.response?.message || typedErr?.message || "Failed to login. Please check your credentials.";
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UForm = _sfc_main$2;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$3;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-default relative flex min-h-screen items-center justify-center overflow-hidden px-6 font-sans" }, _attrs))}><div class="absolute inset-0 bg-cover bg-center" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
        backgroundImage: `url(${vueExports.unref(loginBackground)})`,
        filter: "blur(8px)",
        transform: "scale(1.1)"
      })}"></div><div class="bg-default/70 absolute inset-0"></div><div class="bg-elevated border-default relative z-10 w-full max-w-md border p-10 backdrop-blur-xl"><div class="mb-8 text-center"><h1 class="text-highlighted text-xl font-medium tracking-tight"> Admin Login </h1><p class="text-muted mt-2 text-xs tracking-wide uppercase"> Access Dashboard </p></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UForm, {
        state: vueExports.unref(formState),
        class: "space-y-6",
        onSubmit: handleLogin
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "admin@example.com",
                    color: "neutral",
                    variant: "subtle",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                      type: "email",
                      placeholder: "admin@example.com",
                      color: "neutral",
                      variant: "subtle",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Password",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).password,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                    type: "password",
                    placeholder: "••••••••",
                    color: "neutral",
                    variant: "subtle",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                      type: "password",
                      placeholder: "••••••••",
                      color: "neutral",
                      variant: "subtle",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(error)) {
              _push2(`<div class="bg-error-950/20 border-error-800/30 text-error-200 border px-4 py-3 text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(error))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              type: "submit",
              variant: "outline",
              color: "neutral",
              loading: vueExports.unref(loading),
              class: "w-full"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(loading) ? "Logging in..." : "Login")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Logging in..." : "Login"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Email",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "admin@example.com",
                    color: "neutral",
                    variant: "subtle",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Password",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).password,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                    type: "password",
                    placeholder: "••••••••",
                    color: "neutral",
                    variant: "subtle",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "bg-error-950/20 border-error-800/30 text-error-200 border px-4 py-3 text-sm"
              }, vueExports.toDisplayString(vueExports.unref(error)), 1)) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_UButton, {
                type: "submit",
                variant: "outline",
                color: "neutral",
                loading: vueExports.unref(loading),
                class: "w-full"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Logging in..." : "Login"), 1)
                ]),
                _: 1
              }, 8, ["loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-6 text-center">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-muted hover:text-highlighted text-xs tracking-wide uppercase transition-colors"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to Portfolio `);
          } else {
            return [
              vueExports.createTextVNode(" ← Back to Portfolio ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-BQqs0krB.mjs.map
