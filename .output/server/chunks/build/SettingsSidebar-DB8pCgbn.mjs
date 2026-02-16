import { _ as _sfc_main$3, a as _sfc_main$2$1, c as _sfc_main$5, b as _sfc_main$1$1 } from './InputTags-rlTKzWvK.mjs';
import { v as vueExports, J as useAsyncData, s as serverRenderer_cjs_prodExports, _ as _sfc_main$9, b as _sfc_main$f, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2, a as _sfc_main$1, b as _sfc_main$4 } from './Input-DiPoUQEC.mjs';
import { _ as _sfc_main$4$1 } from './dashboard-Co8oTG6T.mjs';
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
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '@vueuse/integrations/useSortable';

const __nuxt_component_10_lazy = vueExports.defineAsyncComponent(() => import('./AboutPopup-DmzvmQkz.mjs').then((n) => n.c).then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SettingsSidebar",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close", "showToast"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = vueExports.computed({
      get: () => props.isOpen,
      set: (value) => {
        if (!value)
          emit("close");
      }
    });
    const faviconFileInput = vueExports.ref(null);
    const saving = vueExports.ref(false);
    const { data: rawData, refresh, status } = useAsyncData(
      "settings-sidebar",
      async () => {
        const [about, homepage, settings, fontSizes] = await Promise.all([
          pb.collection("About").getFirstListItem("Is_Active = true"),
          pb.collection("Homepage").getFirstListItem("Is_Active = true"),
          pb.collection("Settings").getFirstListItem(""),
          $fetch("/api/font-sizes")
        ]);
        return { about, homepage, settings, fontSizes };
      },
      { immediate: false }
    );
    vueExports.watch(open, (isOpen) => {
      if (isOpen)
        refresh();
    });
    const loading = vueExports.computed(() => status.value === "pending" || saving.value);
    const aboutData = vueExports.computed(() => rawData.value?.about || null);
    const homepageData = vueExports.computed(() => rawData.value?.homepage || null);
    const settingsData = vueExports.computed(() => rawData.value?.settings || null);
    const heroTitle = vueExports.ref("");
    const showTopProgressBar = vueExports.ref(false);
    const mobileFontSize = vueExports.ref(1.25);
    const tabletFontSize = vueExports.ref(1.875);
    const desktopFontSize = vueExports.ref(2.25);
    const largeDesktopFontSize = vueExports.ref(3);
    const faviconUrl = vueExports.ref("");
    const aboutDescription = vueExports.ref("");
    const expertiseDescription = vueExports.ref("");
    const clientList = vueExports.ref([]);
    const contactEmail = vueExports.ref("");
    const uppercaseDisplay = (value) => value.toUpperCase();
    vueExports.watch(rawData, (data) => {
      if (!data)
        return;
      aboutDescription.value = data.about.About_Description ?? "";
      expertiseDescription.value = data.about.Expertise_Description ?? "";
      clientList.value = data.about.Client_List_Json ?? [];
      contactEmail.value = data.about.Contact_Email ?? "";
      heroTitle.value = data.homepage.Hero_Title ?? "";
      showTopProgressBar.value = data.settings.Show_Top_Progress_Bar ?? false;
      mobileFontSize.value = data.fontSizes.mobile;
      tabletFontSize.value = data.fontSizes.tablet;
      desktopFontSize.value = data.fontSizes.desktop;
      largeDesktopFontSize.value = data.fontSizes.largeDesktop;
      faviconUrl.value = `/assets/favicon.ico?v=${data.settings.updated}`;
    });
    function handleAddTag(value) {
      return value.toUpperCase();
    }
    async function handleFaviconUpdate(event) {
      const file = event.target.files?.[0];
      if (!file)
        return;
      try {
        const formData = new FormData();
        formData.append("icon", file);
        await $fetch("/api/favicon", {
          method: "PUT",
          body: formData,
          headers: { Authorization: `Bearer ${pb.authStore.token}` }
        });
        faviconUrl.value = `/assets/favicon.ico?v=${Date.now()}`;
        emit("showToast", "Favicon updated successfully!", "success");
      } catch (err) {
        console.error("Error updating favicon:", err);
        const error = err;
        emit("showToast", `Failed to update favicon: ${error?.message || "Unknown error"}`, "error");
      }
    }
    async function handleSubmit(e) {
      e.preventDefault();
      saving.value = true;
      try {
        if (homepageData.value) {
          await pb.collection("Homepage").update(homepageData.value.id, { Hero_Title: heroTitle.value });
        }
        if (aboutData.value) {
          await pb.collection("About").update(aboutData.value.id, {
            About_Description: aboutDescription.value,
            Expertise_Description: expertiseDescription.value,
            Client_List_Json: clientList.value,
            Contact_Email: contactEmail.value
          });
        }
        if (settingsData.value) {
          await pb.collection("Settings").update(settingsData.value.id, {
            Show_Top_Progress_Bar: showTopProgressBar.value
          });
        }
        await $fetch("/api/font-sizes", {
          method: "PUT",
          body: {
            mobile: mobileFontSize.value,
            tablet: tabletFontSize.value,
            desktop: desktopFontSize.value,
            largeDesktop: largeDesktopFontSize.value
          },
          headers: { Authorization: `Bearer ${pb.authStore.token}` }
        });
        emit("showToast", "Settings saved successfully!", "success");
        open.value = false;
      } catch (err) {
        console.error("Error saving settings:", err);
        const error = err;
        if (error?.status === 401 || error?.status === 403) {
          emit("showToast", "Your session has expired. Please login again.", "error");
          pb.authStore.clear();
          navigateTo("/admin");
          return;
        }
        emit("showToast", `Failed to save settings: ${error?.data?.message || error?.message || "Unknown error"}`, "error");
      } finally {
        saving.value = false;
      }
    }
    const previewAboutData = vueExports.computed(() => {
      if (!aboutData.value)
        return null;
      return {
        ...aboutData.value,
        About_Description: aboutDescription.value,
        Expertise_Description: expertiseDescription.value,
        Client_List_Json: clientList.value,
        Contact_Email: contactEmail.value
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDrawer = _sfc_main$3;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UForm = _sfc_main$2;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$4;
      const _component_UTextarea = _sfc_main$2$1;
      const _component_UInputTags = _sfc_main$5;
      const _component_UInputNumber = _sfc_main$1$1;
      const _component_USwitch = _sfc_main$4$1;
      const _component_LazyAboutPopup = __nuxt_component_10_lazy;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDrawer, {
        open: vueExports.unref(open),
        "onUpdate:open": ($event) => vueExports.isRef(open) ? open.value = $event : null,
        direction: "right",
        handle: false,
        ui: {
          content: "h-full w-3/4 md:w-1/2 max-w-none",
          body: "p-0",
          header: "p-6 border-b border-default"
        }
      }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="flex-1"${_scopeId}><h2 class="text-highlighted text-xl font-medium tracking-tight"${_scopeId}> Settings </h2><p class="text-muted mt-1 text-xs tracking-wide uppercase"${_scopeId}> Configure site content </p></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              color: "neutral",
              class: "h-12 w-12 flex-shrink-0 overflow-hidden",
              title: "Click to update favicon",
              onClick: ($event) => vueExports.unref(faviconFileInput)?.click()
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (vueExports.unref(faviconUrl)) {
                    _push3(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(faviconUrl))} alt="Favicon" class="h-full w-full object-cover"${_scopeId2}>`);
                  } else {
                    _push3(`<div class="flex h-full w-full items-center justify-center"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-ph-image",
                      class: "size-6"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    vueExports.unref(faviconUrl) ? (vueExports.openBlock(), vueExports.createBlock("img", {
                      key: 0,
                      src: vueExports.unref(faviconUrl),
                      alt: "Favicon",
                      class: "h-full w-full object-cover"
                    }, null, 8, ["src"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex h-full w-full items-center justify-center"
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-ph-image",
                        class: "size-6"
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<input id="faviconFileInput" type="file" accept="image/png,image/x-icon,image/svg+xml" class="hidden" aria-label="Update Favicon"${_scopeId}></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center gap-4" }, [
                vueExports.createVNode("div", { class: "flex-1" }, [
                  vueExports.createVNode("h2", { class: "text-highlighted text-xl font-medium tracking-tight" }, " Settings "),
                  vueExports.createVNode("p", { class: "text-muted mt-1 text-xs tracking-wide uppercase" }, " Configure site content ")
                ]),
                vueExports.createVNode(_component_UButton, {
                  variant: "ghost",
                  color: "neutral",
                  class: "h-12 w-12 flex-shrink-0 overflow-hidden",
                  title: "Click to update favicon",
                  onClick: ($event) => vueExports.unref(faviconFileInput)?.click()
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(faviconUrl) ? (vueExports.openBlock(), vueExports.createBlock("img", {
                      key: 0,
                      src: vueExports.unref(faviconUrl),
                      alt: "Favicon",
                      class: "h-full w-full object-cover"
                    }, null, 8, ["src"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex h-full w-full items-center justify-center"
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-ph-image",
                        class: "size-6"
                      })
                    ]))
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                vueExports.createVNode("input", {
                  id: "faviconFileInput",
                  ref_key: "faviconFileInput",
                  ref: faviconFileInput,
                  type: "file",
                  accept: "image/png,image/x-icon,image/svg+xml",
                  class: "hidden",
                  "aria-label": "Update Favicon",
                  onChange: handleFaviconUpdate
                }, null, 544)
              ])
            ];
          }
        }),
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UForm, {
              state: {},
              class: "flex h-full flex-col",
              onSubmit: handleSubmit
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex-1 space-y-8 overflow-y-auto p-6"${_scopeId2}><div${_scopeId2}><h3 class="text-highlighted mb-4 text-sm font-medium tracking-wider uppercase"${_scopeId2}> Hero Section </h3>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Hero Title" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                          modelValue: vueExports.unref(heroTitle),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(heroTitle) ? heroTitle.value = $event : null,
                          placeholder: "Creative Strategy and Communication",
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInput, {
                            modelValue: vueExports.unref(heroTitle),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(heroTitle) ? heroTitle.value = $event : null,
                            placeholder: "Creative Strategy and Communication",
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="border-default border-t"${_scopeId2}></div><div${_scopeId2}><h3 class="text-highlighted mb-4 text-sm font-medium tracking-wider uppercase"${_scopeId2}> About Section </h3><div class="space-y-4"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "About Description" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                          modelValue: vueExports.unref(aboutDescription),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(aboutDescription) ? aboutDescription.value = $event : null,
                          rows: 4,
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UTextarea, {
                            modelValue: vueExports.unref(aboutDescription),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(aboutDescription) ? aboutDescription.value = $event : null,
                            rows: 4,
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Expertise Description" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                          modelValue: vueExports.unref(expertiseDescription),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(expertiseDescription) ? expertiseDescription.value = $event : null,
                          rows: 3,
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UTextarea, {
                            modelValue: vueExports.unref(expertiseDescription),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(expertiseDescription) ? expertiseDescription.value = $event : null,
                            rows: 3,
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                    label: "Client List",
                    help: "Press Enter to add a client"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputTags, {
                          modelValue: vueExports.unref(clientList),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(clientList) ? clientList.value = $event : null,
                          placeholder: "e.g., NIKE",
                          color: "neutral",
                          variant: "subtle",
                          "display-value": uppercaseDisplay,
                          "convert-value": handleAddTag,
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputTags, {
                            modelValue: vueExports.unref(clientList),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(clientList) ? clientList.value = $event : null,
                            placeholder: "e.g., NIKE",
                            color: "neutral",
                            variant: "subtle",
                            "display-value": uppercaseDisplay,
                            "convert-value": handleAddTag,
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div><div class="border-default border-t"${_scopeId2}></div><div${_scopeId2}><h3 class="text-highlighted mb-4 text-sm font-medium tracking-wider uppercase"${_scopeId2}> Global Settings </h3><div class="space-y-4"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Contact Email" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                          modelValue: vueExports.unref(contactEmail),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(contactEmail) ? contactEmail.value = $event : null,
                          type: "email",
                          placeholder: "hello@example.com",
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInput, {
                            modelValue: vueExports.unref(contactEmail),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(contactEmail) ? contactEmail.value = $event : null,
                            type: "email",
                            placeholder: "hello@example.com",
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="text-toned mb-2 text-xs font-medium tracking-wider uppercase"${_scopeId2}> Font Sizes (rem) </p><div class="grid grid-cols-4 gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Mobile" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputNumber, {
                          modelValue: vueExports.unref(mobileFontSize),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(mobileFontSize) ? mobileFontSize.value = $event : null,
                          step: 0.125,
                          increment: false,
                          decrement: false,
                          color: "neutral",
                          variant: "subtle"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputNumber, {
                            modelValue: vueExports.unref(mobileFontSize),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(mobileFontSize) ? mobileFontSize.value = $event : null,
                            step: 0.125,
                            increment: false,
                            decrement: false,
                            color: "neutral",
                            variant: "subtle"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tablet" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputNumber, {
                          modelValue: vueExports.unref(tabletFontSize),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(tabletFontSize) ? tabletFontSize.value = $event : null,
                          step: 0.125,
                          increment: false,
                          decrement: false,
                          color: "neutral",
                          variant: "subtle"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputNumber, {
                            modelValue: vueExports.unref(tabletFontSize),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(tabletFontSize) ? tabletFontSize.value = $event : null,
                            step: 0.125,
                            increment: false,
                            decrement: false,
                            color: "neutral",
                            variant: "subtle"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Desktop" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputNumber, {
                          modelValue: vueExports.unref(desktopFontSize),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(desktopFontSize) ? desktopFontSize.value = $event : null,
                          step: 0.125,
                          increment: false,
                          decrement: false,
                          color: "neutral",
                          variant: "subtle"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputNumber, {
                            modelValue: vueExports.unref(desktopFontSize),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(desktopFontSize) ? desktopFontSize.value = $event : null,
                            step: 0.125,
                            increment: false,
                            decrement: false,
                            color: "neutral",
                            variant: "subtle"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Large" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputNumber, {
                          modelValue: vueExports.unref(largeDesktopFontSize),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(largeDesktopFontSize) ? largeDesktopFontSize.value = $event : null,
                          step: 0.125,
                          increment: false,
                          decrement: false,
                          color: "neutral",
                          variant: "subtle"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputNumber, {
                            modelValue: vueExports.unref(largeDesktopFontSize),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(largeDesktopFontSize) ? largeDesktopFontSize.value = $event : null,
                            step: 0.125,
                            increment: false,
                            decrement: false,
                            color: "neutral",
                            variant: "subtle"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, null, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                          modelValue: vueExports.unref(showTopProgressBar),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(showTopProgressBar) ? showTopProgressBar.value = $event : null,
                          label: "Show Top Progress Bar"
                        }, null, _parent4, _scopeId3));
                        _push4(`<p class="text-dimmed mt-1 text-xs"${_scopeId3}> Display progress bar at top of carousel </p>`);
                      } else {
                        return [
                          vueExports.createVNode(_component_USwitch, {
                            modelValue: vueExports.unref(showTopProgressBar),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(showTopProgressBar) ? showTopProgressBar.value = $event : null,
                            label: "Show Top Progress Bar"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          vueExports.createVNode("p", { class: "text-dimmed mt-1 text-xs" }, " Display progress bar at top of carousel ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div><div class="border-default flex flex-shrink-0 gap-3 border-t p-6"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    type: "button",
                    variant: "outline",
                    class: "flex-1",
                    onClick: ($event) => open.value = false
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Cancel `);
                      } else {
                        return [
                          vueExports.createTextVNode(" Cancel ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    variant: "outline",
                    color: "neutral",
                    loading: vueExports.unref(loading),
                    class: "flex-1"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(loading) ? "Saving..." : "Save Changes")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Saving..." : "Save Changes"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex-1 space-y-8 overflow-y-auto p-6" }, [
                      vueExports.createVNode("div", null, [
                        vueExports.createVNode("h3", { class: "text-highlighted mb-4 text-sm font-medium tracking-wider uppercase" }, " Hero Section "),
                        vueExports.createVNode(_component_UFormField, { label: "Hero Title" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UInput, {
                              modelValue: vueExports.unref(heroTitle),
                              "onUpdate:modelValue": ($event) => vueExports.isRef(heroTitle) ? heroTitle.value = $event : null,
                              placeholder: "Creative Strategy and Communication",
                              color: "neutral",
                              variant: "subtle",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      vueExports.createVNode("div", { class: "border-default border-t" }),
                      vueExports.createVNode("div", null, [
                        vueExports.createVNode("h3", { class: "text-highlighted mb-4 text-sm font-medium tracking-wider uppercase" }, " About Section "),
                        vueExports.createVNode("div", { class: "space-y-4" }, [
                          vueExports.createVNode(_component_UFormField, { label: "About Description" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_UTextarea, {
                                modelValue: vueExports.unref(aboutDescription),
                                "onUpdate:modelValue": ($event) => vueExports.isRef(aboutDescription) ? aboutDescription.value = $event : null,
                                rows: 4,
                                color: "neutral",
                                variant: "subtle",
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_UFormField, { label: "Expertise Description" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_UTextarea, {
                                modelValue: vueExports.unref(expertiseDescription),
                                "onUpdate:modelValue": ($event) => vueExports.isRef(expertiseDescription) ? expertiseDescription.value = $event : null,
                                rows: 3,
                                color: "neutral",
                                variant: "subtle",
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_UFormField, {
                            label: "Client List",
                            help: "Press Enter to add a client"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_UInputTags, {
                                modelValue: vueExports.unref(clientList),
                                "onUpdate:modelValue": ($event) => vueExports.isRef(clientList) ? clientList.value = $event : null,
                                placeholder: "e.g., NIKE",
                                color: "neutral",
                                variant: "subtle",
                                "display-value": uppercaseDisplay,
                                "convert-value": handleAddTag,
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      vueExports.createVNode("div", { class: "border-default border-t" }),
                      vueExports.createVNode("div", null, [
                        vueExports.createVNode("h3", { class: "text-highlighted mb-4 text-sm font-medium tracking-wider uppercase" }, " Global Settings "),
                        vueExports.createVNode("div", { class: "space-y-4" }, [
                          vueExports.createVNode(_component_UFormField, { label: "Contact Email" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_UInput, {
                                modelValue: vueExports.unref(contactEmail),
                                "onUpdate:modelValue": ($event) => vueExports.isRef(contactEmail) ? contactEmail.value = $event : null,
                                type: "email",
                                placeholder: "hello@example.com",
                                color: "neutral",
                                variant: "subtle",
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode("div", null, [
                            vueExports.createVNode("p", { class: "text-toned mb-2 text-xs font-medium tracking-wider uppercase" }, " Font Sizes (rem) "),
                            vueExports.createVNode("div", { class: "grid grid-cols-4 gap-2" }, [
                              vueExports.createVNode(_component_UFormField, { label: "Mobile" }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_UInputNumber, {
                                    modelValue: vueExports.unref(mobileFontSize),
                                    "onUpdate:modelValue": ($event) => vueExports.isRef(mobileFontSize) ? mobileFontSize.value = $event : null,
                                    step: 0.125,
                                    increment: false,
                                    decrement: false,
                                    color: "neutral",
                                    variant: "subtle"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              vueExports.createVNode(_component_UFormField, { label: "Tablet" }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_UInputNumber, {
                                    modelValue: vueExports.unref(tabletFontSize),
                                    "onUpdate:modelValue": ($event) => vueExports.isRef(tabletFontSize) ? tabletFontSize.value = $event : null,
                                    step: 0.125,
                                    increment: false,
                                    decrement: false,
                                    color: "neutral",
                                    variant: "subtle"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              vueExports.createVNode(_component_UFormField, { label: "Desktop" }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_UInputNumber, {
                                    modelValue: vueExports.unref(desktopFontSize),
                                    "onUpdate:modelValue": ($event) => vueExports.isRef(desktopFontSize) ? desktopFontSize.value = $event : null,
                                    step: 0.125,
                                    increment: false,
                                    decrement: false,
                                    color: "neutral",
                                    variant: "subtle"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              vueExports.createVNode(_component_UFormField, { label: "Large" }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_UInputNumber, {
                                    modelValue: vueExports.unref(largeDesktopFontSize),
                                    "onUpdate:modelValue": ($event) => vueExports.isRef(largeDesktopFontSize) ? largeDesktopFontSize.value = $event : null,
                                    step: 0.125,
                                    increment: false,
                                    decrement: false,
                                    color: "neutral",
                                    variant: "subtle"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          vueExports.createVNode(_component_UFormField, null, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_USwitch, {
                                modelValue: vueExports.unref(showTopProgressBar),
                                "onUpdate:modelValue": ($event) => vueExports.isRef(showTopProgressBar) ? showTopProgressBar.value = $event : null,
                                label: "Show Top Progress Bar"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              vueExports.createVNode("p", { class: "text-dimmed mt-1 text-xs" }, " Display progress bar at top of carousel ")
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    vueExports.createVNode("div", { class: "border-default flex flex-shrink-0 gap-3 border-t p-6" }, [
                      vueExports.createVNode(_component_UButton, {
                        type: "button",
                        variant: "outline",
                        class: "flex-1",
                        onClick: ($event) => open.value = false
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      vueExports.createVNode(_component_UButton, {
                        type: "submit",
                        variant: "outline",
                        color: "neutral",
                        loading: vueExports.unref(loading),
                        class: "flex-1"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Saving..." : "Save Changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UForm, {
                state: {},
                class: "flex h-full flex-col",
                onSubmit: handleSubmit
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex-1 space-y-8 overflow-y-auto p-6" }, [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("h3", { class: "text-highlighted mb-4 text-sm font-medium tracking-wider uppercase" }, " Hero Section "),
                      vueExports.createVNode(_component_UFormField, { label: "Hero Title" }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UInput, {
                            modelValue: vueExports.unref(heroTitle),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(heroTitle) ? heroTitle.value = $event : null,
                            placeholder: "Creative Strategy and Communication",
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    vueExports.createVNode("div", { class: "border-default border-t" }),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("h3", { class: "text-highlighted mb-4 text-sm font-medium tracking-wider uppercase" }, " About Section "),
                      vueExports.createVNode("div", { class: "space-y-4" }, [
                        vueExports.createVNode(_component_UFormField, { label: "About Description" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UTextarea, {
                              modelValue: vueExports.unref(aboutDescription),
                              "onUpdate:modelValue": ($event) => vueExports.isRef(aboutDescription) ? aboutDescription.value = $event : null,
                              rows: 4,
                              color: "neutral",
                              variant: "subtle",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_UFormField, { label: "Expertise Description" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UTextarea, {
                              modelValue: vueExports.unref(expertiseDescription),
                              "onUpdate:modelValue": ($event) => vueExports.isRef(expertiseDescription) ? expertiseDescription.value = $event : null,
                              rows: 3,
                              color: "neutral",
                              variant: "subtle",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_UFormField, {
                          label: "Client List",
                          help: "Press Enter to add a client"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UInputTags, {
                              modelValue: vueExports.unref(clientList),
                              "onUpdate:modelValue": ($event) => vueExports.isRef(clientList) ? clientList.value = $event : null,
                              placeholder: "e.g., NIKE",
                              color: "neutral",
                              variant: "subtle",
                              "display-value": uppercaseDisplay,
                              "convert-value": handleAddTag,
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    vueExports.createVNode("div", { class: "border-default border-t" }),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("h3", { class: "text-highlighted mb-4 text-sm font-medium tracking-wider uppercase" }, " Global Settings "),
                      vueExports.createVNode("div", { class: "space-y-4" }, [
                        vueExports.createVNode(_component_UFormField, { label: "Contact Email" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UInput, {
                              modelValue: vueExports.unref(contactEmail),
                              "onUpdate:modelValue": ($event) => vueExports.isRef(contactEmail) ? contactEmail.value = $event : null,
                              type: "email",
                              placeholder: "hello@example.com",
                              color: "neutral",
                              variant: "subtle",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode("div", null, [
                          vueExports.createVNode("p", { class: "text-toned mb-2 text-xs font-medium tracking-wider uppercase" }, " Font Sizes (rem) "),
                          vueExports.createVNode("div", { class: "grid grid-cols-4 gap-2" }, [
                            vueExports.createVNode(_component_UFormField, { label: "Mobile" }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_UInputNumber, {
                                  modelValue: vueExports.unref(mobileFontSize),
                                  "onUpdate:modelValue": ($event) => vueExports.isRef(mobileFontSize) ? mobileFontSize.value = $event : null,
                                  step: 0.125,
                                  increment: false,
                                  decrement: false,
                                  color: "neutral",
                                  variant: "subtle"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            vueExports.createVNode(_component_UFormField, { label: "Tablet" }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_UInputNumber, {
                                  modelValue: vueExports.unref(tabletFontSize),
                                  "onUpdate:modelValue": ($event) => vueExports.isRef(tabletFontSize) ? tabletFontSize.value = $event : null,
                                  step: 0.125,
                                  increment: false,
                                  decrement: false,
                                  color: "neutral",
                                  variant: "subtle"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            vueExports.createVNode(_component_UFormField, { label: "Desktop" }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_UInputNumber, {
                                  modelValue: vueExports.unref(desktopFontSize),
                                  "onUpdate:modelValue": ($event) => vueExports.isRef(desktopFontSize) ? desktopFontSize.value = $event : null,
                                  step: 0.125,
                                  increment: false,
                                  decrement: false,
                                  color: "neutral",
                                  variant: "subtle"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            vueExports.createVNode(_component_UFormField, { label: "Large" }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_UInputNumber, {
                                  modelValue: vueExports.unref(largeDesktopFontSize),
                                  "onUpdate:modelValue": ($event) => vueExports.isRef(largeDesktopFontSize) ? largeDesktopFontSize.value = $event : null,
                                  step: 0.125,
                                  increment: false,
                                  decrement: false,
                                  color: "neutral",
                                  variant: "subtle"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        vueExports.createVNode(_component_UFormField, null, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_USwitch, {
                              modelValue: vueExports.unref(showTopProgressBar),
                              "onUpdate:modelValue": ($event) => vueExports.isRef(showTopProgressBar) ? showTopProgressBar.value = $event : null,
                              label: "Show Top Progress Bar"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            vueExports.createVNode("p", { class: "text-dimmed mt-1 text-xs" }, " Display progress bar at top of carousel ")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  vueExports.createVNode("div", { class: "border-default flex flex-shrink-0 gap-3 border-t p-6" }, [
                    vueExports.createVNode(_component_UButton, {
                      type: "button",
                      variant: "outline",
                      class: "flex-1",
                      onClick: ($event) => open.value = false
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    vueExports.createVNode(_component_UButton, {
                      type: "submit",
                      variant: "outline",
                      color: "neutral",
                      loading: vueExports.unref(loading),
                      class: "flex-1"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Saving..." : "Save Changes"), 1)
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="pointer-events-none fixed top-1/2 left-[25%] z-[60] -translate-x-1/2 -translate-y-1/2">`);
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LazyAboutPopup, {
            "is-visible": __props.isOpen,
            "about-data": vueExports.unref(previewAboutData),
            onClose: () => {
            }
          }, null, _parent));
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/components/SettingsSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SettingsSidebar = Object.assign(_sfc_main, { __name: "SettingsSidebar" });

export { SettingsSidebar as default };
//# sourceMappingURL=SettingsSidebar-DB8pCgbn.mjs.map
