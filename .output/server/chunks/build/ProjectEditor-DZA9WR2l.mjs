import { _ as _sfc_main$3, a as _sfc_main$2$1, b as _sfc_main$1$2, c as _sfc_main$5 } from './InputTags-rlTKzWvK.mjs';
import { _ as _sfc_main$2, a as _sfc_main$1$1, b as _sfc_main$4 } from './Input-DiPoUQEC.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, _ as _sfc_main$9, n as navigateTo, b as _sfc_main$f } from './server.mjs';
import { g as useDropZone } from './index-CtsWe4-H.mjs';
import { useSortable } from '@vueuse/integrations/useSortable';
import { g as getImageUrl, p as pb } from './pocketbase-DJpo7-rk.mjs';
import { u as useDevice } from './useDevice-S3-EEo3A.mjs';
import './dashboard-Co8oTG6T.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ImageDropZone",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dropZoneRef = vueExports.useTemplateRef("dropZoneRef");
    const imageGridRef = vueExports.useTemplateRef("imageGridRef");
    const images = vueExports.computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    useSortable(imageGridRef, images, {
      animation: 150
    });
    const { isOverDropZone: isDraggingFile } = useDropZone(dropZoneRef, {});
    function handleDeleteImage(image) {
      emit("delete", image);
      images.value = images.value.filter((img) => img.id !== image.id);
      if (!image.isExisting) {
        URL.revokeObjectURL(image.url);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><span id="images-label" class="text-toned mb-3 block text-xs font-medium tracking-wider uppercase"> Images (Drag to reorder) </span><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
        vueExports.unref(isDraggingFile) ? "border-primary bg-primary/5" : "border-default bg-elevated/50",
        vueExports.unref(images).length === 0 ? "hover:border-accented hover:bg-elevated cursor-pointer" : ""
      ], "relative border-2 border-dashed transition-all"])}" role="button" tabindex="0"><input type="file" multiple accept="image/*" aria-labelledby="images-label" class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ pointerEvents: vueExports.unref(images).length > 0 ? "none" : "auto" })}">`);
      if (vueExports.unref(images).length === 0) {
        _push(`<div class="pointer-events-none block cursor-pointer px-6 py-12 text-center"><div class="flex flex-col items-center gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-ph-upload",
          class: ["size-12 transition-colors", [vueExports.unref(isDraggingFile) ? "text-primary" : "text-muted"]]
        }, null, _parent));
        _push(`<div><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([[vueExports.unref(isDraggingFile) ? "text-primary" : "text-toned"], "text-sm font-medium tracking-wide uppercase transition-colors"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isDraggingFile) ? "Drop images here" : "Drag & drop images")}</p><p class="text-dimmed mt-1 text-xs tracking-wide"> or click to browse </p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(images).length > 0) {
        _push(`<div class="p-4"><div class="grid grid-cols-2 gap-3 md:grid-cols-3"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(images), (image, index) => {
          _push(`<div class="image-item group border-default hover:border-accented relative cursor-move overflow-hidden border transition-all" role="button" tabindex="0"><div class="bg-elevated aspect-square"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", image.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", image.filename)} class="h-full w-full object-cover"></div><div class="bg-default/60 text-highlighted absolute top-2 left-2 px-2 py-1 text-xs font-medium backdrop-blur-sm">${serverRenderer_cjs_prodExports.ssrInterpolate(index + 1)}</div>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            type: "button",
            color: "primary",
            variant: "ghost",
            size: "xs",
            icon: "i-ph-x",
            class: "absolute top-2 right-2 opacity-0 transition-all group-hover:opacity-100",
            onClick: ($event) => handleDeleteImage(image)
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/components/ImageDropZone.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "ImageDropZone" });
const __nuxt_component_9_lazy = vueExports.defineAsyncComponent(() => import('./ProjectPopupPreview-DRtx-rds.mjs').then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectEditor",
  __ssrInlineRender: true,
  props: {
    project: {},
    isOpen: { type: Boolean }
  },
  emits: ["save", "cancel", "showToast"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { isMobile } = useDevice();
    const formState = vueExports.reactive({
      title: "",
      description: "",
      order: 0,
      responsibilities: []
    });
    const images = vueExports.ref([]);
    const imagesToDelete = vueExports.ref([]);
    const loading = vueExports.ref(false);
    vueExports.watch(() => props.project, (project) => {
      if (project) {
        images.value = project.Images?.map((filename, index) => ({
          id: `existing-${index}`,
          url: getImageUrl(project, filename),
          filename,
          isExisting: true
        })) ?? [];
        formState.title = project.Title ?? "";
        formState.description = project.Description ?? "";
        formState.order = project.Order ?? 0;
        formState.responsibilities = project.Responsibility_json ?? [];
      } else {
        images.value = [];
        imagesToDelete.value = [];
        formState.title = "";
        formState.description = "";
        formState.order = 0;
        formState.responsibilities = [];
      }
    }, { immediate: true });
    function handleImageDelete(image) {
      if (image.isExisting) {
        imagesToDelete.value.push(image.filename);
      }
    }
    function handleClose() {
      images.value.forEach((img) => {
        if (!img.isExisting) {
          URL.revokeObjectURL(img.url);
        }
      });
      emit("cancel");
    }
    async function handleSubmit(e) {
      e?.preventDefault();
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append("Title", formState.title);
        formData.append("Description", formState.description);
        formData.append("Order", formState.order.toString());
        formState.responsibilities.forEach((resp) => {
          formData.append("Responsibility_json", resp);
        });
        if (props.project && images.value.length > 0) {
          if (props.project.Images && props.project.Images.length > 0) {
            props.project.Images.forEach((filename) => {
              formData.append("Images-", filename);
            });
          }
          for (const img of images.value) {
            if (img.file) {
              formData.append("Images", img.file);
            } else if (img.isExisting) {
              try {
                const response = await fetch(img.url);
                if (!response.ok)
                  throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                const file = new File([blob], img.filename, { type: blob.type });
                formData.append("Images", file);
              } catch (error) {
                console.error("Error downloading existing image:", error);
                throw new Error(`Failed to download image: ${img.filename}`);
              }
            }
          }
        } else {
          images.value.forEach((img) => {
            if (img.file) {
              formData.append("Images", img.file);
            }
          });
        }
        if (props.project) {
          await pb.collection("Portfolio_Projects").update(props.project.id, formData);
        } else {
          await pb.collection("Portfolio_Projects").create(formData);
        }
        emit("save");
      } catch (err) {
        console.error("Error saving project:", err);
        const error = err;
        if (error?.status === 401 || error?.status === 403) {
          emit("showToast", "Your session has expired. Please login again.", "error");
          pb.authStore.clear();
          navigateTo("/admin");
          return;
        }
        emit("showToast", `Failed to save project: ${error?.data?.message || error?.message || "Unknown error"}`, "error");
      } finally {
        loading.value = false;
      }
    }
    const uppercaseDisplay = (value) => value.toUpperCase();
    function handleAddTag(value) {
      return value.toUpperCase();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDrawer = _sfc_main$3;
      const _component_UForm = _sfc_main$2;
      const _component_ImageDropZone = __nuxt_component_2;
      const _component_UFormField = _sfc_main$1$1;
      const _component_UInput = _sfc_main$4;
      const _component_UTextarea = _sfc_main$2$1;
      const _component_UInputNumber = _sfc_main$1$2;
      const _component_UInputTags = _sfc_main$5;
      const _component_UButton = _sfc_main$9;
      const _component_LazyProjectPopupPreview = __nuxt_component_9_lazy;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDrawer, {
        open: __props.isOpen,
        direction: "right",
        handle: false,
        ui: {
          content: "h-full w-3/4 md:w-2/3 lg:w-1/2 max-w-none",
          body: "p-0",
          header: "p-6 border-b border-default"
        },
        onClose: handleClose
      }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="text-highlighted text-xl font-medium tracking-tight"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project ? "Edit Project" : "New Project")}</h2><p class="text-muted mt-1 text-xs tracking-wide uppercase"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project ? "Update project details and images" : "Create a new portfolio project")}</p>`);
          } else {
            return [
              vueExports.createVNode("h2", { class: "text-highlighted text-xl font-medium tracking-tight" }, vueExports.toDisplayString(__props.project ? "Edit Project" : "New Project"), 1),
              vueExports.createVNode("p", { class: "text-muted mt-1 text-xs tracking-wide uppercase" }, vueExports.toDisplayString(__props.project ? "Update project details and images" : "Create a new portfolio project"), 1)
            ];
          }
        }),
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UForm, {
              state: vueExports.unref(formState),
              class: "flex h-full flex-col",
              onSubmit: handleSubmit
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex-1 space-y-6 overflow-y-auto p-6"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ImageDropZone, {
                    modelValue: vueExports.unref(images),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(images) ? images.value = $event : null,
                    onDelete: handleImageDelete
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="border-default border-t"${_scopeId2}></div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                    label: "Project Title",
                    required: ""
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                          modelValue: vueExports.unref(formState).title,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).title = $event,
                          placeholder: "e.g., Maria Bodil for Nike",
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInput, {
                            modelValue: vueExports.unref(formState).title,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).title = $event,
                            placeholder: "e.g., Maria Bodil for Nike",
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
                    label: "Description",
                    required: ""
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                          modelValue: vueExports.unref(formState).description,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                          rows: 6,
                          placeholder: "Project description...",
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UTextarea, {
                            modelValue: vueExports.unref(formState).description,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                            rows: 6,
                            placeholder: "Project description...",
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
                    label: "Position in Portfolio",
                    required: ""
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputNumber, {
                          modelValue: vueExports.unref(formState).order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).order = $event,
                          min: 0,
                          increment: false,
                          decrement: false,
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputNumber, {
                            modelValue: vueExports.unref(formState).order,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).order = $event,
                            min: 0,
                            increment: false,
                            decrement: false,
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
                    label: "Responsibilities",
                    help: "Press Enter to add a responsibility"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInputTags, {
                          modelValue: vueExports.unref(formState).responsibilities,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).responsibilities = $event,
                          placeholder: "e.g., CREATIVE PRODUCTION",
                          color: "neutral",
                          variant: "subtle",
                          "display-value": uppercaseDisplay,
                          "convert-value": handleAddTag,
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInputTags, {
                            modelValue: vueExports.unref(formState).responsibilities,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).responsibilities = $event,
                            placeholder: "e.g., CREATIVE PRODUCTION",
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
                  _push3(`</div><div class="border-default flex flex-shrink-0 gap-3 border-t p-6"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    type: "button",
                    variant: "outline",
                    color: "neutral",
                    class: "flex-1",
                    onClick: handleClose
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
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(loading) ? "Saving..." : __props.project ? "Update Project" : "Create Project")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Saving..." : __props.project ? "Update Project" : "Create Project"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex-1 space-y-6 overflow-y-auto p-6" }, [
                      vueExports.createVNode(_component_ImageDropZone, {
                        modelValue: vueExports.unref(images),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(images) ? images.value = $event : null,
                        onDelete: handleImageDelete
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode("div", { class: "border-default border-t" }),
                      vueExports.createVNode(_component_UFormField, {
                        label: "Project Title",
                        required: ""
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UInput, {
                            modelValue: vueExports.unref(formState).title,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).title = $event,
                            placeholder: "e.g., Maria Bodil for Nike",
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_UFormField, {
                        label: "Description",
                        required: ""
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UTextarea, {
                            modelValue: vueExports.unref(formState).description,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                            rows: 6,
                            placeholder: "Project description...",
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_UFormField, {
                        label: "Position in Portfolio",
                        required: ""
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UInputNumber, {
                            modelValue: vueExports.unref(formState).order,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).order = $event,
                            min: 0,
                            increment: false,
                            decrement: false,
                            color: "neutral",
                            variant: "subtle",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_UFormField, {
                        label: "Responsibilities",
                        help: "Press Enter to add a responsibility"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UInputTags, {
                            modelValue: vueExports.unref(formState).responsibilities,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).responsibilities = $event,
                            placeholder: "e.g., CREATIVE PRODUCTION",
                            color: "neutral",
                            variant: "subtle",
                            "display-value": uppercaseDisplay,
                            "convert-value": handleAddTag,
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    vueExports.createVNode("div", { class: "border-default flex flex-shrink-0 gap-3 border-t p-6" }, [
                      vueExports.createVNode(_component_UButton, {
                        type: "button",
                        variant: "outline",
                        color: "neutral",
                        class: "flex-1",
                        onClick: handleClose
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_UButton, {
                        type: "submit",
                        variant: "outline",
                        color: "neutral",
                        loading: vueExports.unref(loading),
                        class: "flex-1"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Saving..." : __props.project ? "Update Project" : "Create Project"), 1)
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
                state: vueExports.unref(formState),
                class: "flex h-full flex-col",
                onSubmit: handleSubmit
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex-1 space-y-6 overflow-y-auto p-6" }, [
                    vueExports.createVNode(_component_ImageDropZone, {
                      modelValue: vueExports.unref(images),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(images) ? images.value = $event : null,
                      onDelete: handleImageDelete
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("div", { class: "border-default border-t" }),
                    vueExports.createVNode(_component_UFormField, {
                      label: "Project Title",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).title,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).title = $event,
                          placeholder: "e.g., Maria Bodil for Nike",
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UFormField, {
                      label: "Description",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UTextarea, {
                          modelValue: vueExports.unref(formState).description,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                          rows: 6,
                          placeholder: "Project description...",
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UFormField, {
                      label: "Position in Portfolio",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInputNumber, {
                          modelValue: vueExports.unref(formState).order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).order = $event,
                          min: 0,
                          increment: false,
                          decrement: false,
                          color: "neutral",
                          variant: "subtle",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UFormField, {
                      label: "Responsibilities",
                      help: "Press Enter to add a responsibility"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInputTags, {
                          modelValue: vueExports.unref(formState).responsibilities,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).responsibilities = $event,
                          placeholder: "e.g., CREATIVE PRODUCTION",
                          color: "neutral",
                          variant: "subtle",
                          "display-value": uppercaseDisplay,
                          "convert-value": handleAddTag,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.createVNode("div", { class: "border-default flex flex-shrink-0 gap-3 border-t p-6" }, [
                    vueExports.createVNode(_component_UButton, {
                      type: "button",
                      variant: "outline",
                      color: "neutral",
                      class: "flex-1",
                      onClick: handleClose
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UButton, {
                      type: "submit",
                      variant: "outline",
                      color: "neutral",
                      loading: vueExports.unref(loading),
                      class: "flex-1"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(loading) ? "Saving..." : __props.project ? "Update Project" : "Create Project"), 1)
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                _: 1
              }, 8, ["state"])
            ];
          }
        }),
        _: 1
      }, _parent));
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen && __props.project && !vueExports.unref(isMobile)) {
          _push2(`<div class="pointer-events-auto fixed top-1/2 left-[25%] z-[60] -translate-x-1/2 -translate-y-1/2">`);
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LazyProjectPopupPreview, {
            "project-title": vueExports.unref(formState).title,
            "project-description": vueExports.unref(formState).description,
            "project-responsibility": vueExports.unref(formState).responsibilities
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/components/ProjectEditor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProjectEditor = Object.assign(_sfc_main, { __name: "ProjectEditor" });

export { ProjectEditor as default };
//# sourceMappingURL=ProjectEditor-DZA9WR2l.mjs.map
