import { v as vueExports, J as useAsyncData, n as navigateTo, s as serverRenderer_cjs_prodExports, _ as _sfc_main$9, W as useToast, F as useLocale, G as useAppConfig, H as tv, P as Primitive, I as _sfc_main$c, b as _sfc_main$f, S as useForwardPropsEmits, N as reactivePick, U as usePortal, V as VisuallyHidden_default, j as useVModel, B as useEmitAsProps, l as useForwardExpose, C as Presence_default, T as Teleport_default, M as useForwardProps, Q as useColorMode, R as __nuxt_component_0$2, k as createContext, h as vue, i as injectConfigProviderContext, K as useFieldGroup, L as useComponentIcons, O as useFormField, g as unrefElement, t as tryOnBeforeUnmount, q as getActiveElement, A as AUTOFOCUS_ON_MOUNT, r as focusFirst, w as getTabbableCandidates, x as focus, y as AUTOFOCUS_ON_UNMOUNT, o as onKeyStroke, m as isNullish, f as createSharedComposable$1, E as EVENT_OPTIONS, z as getTabbableEdges, D as usePrimitiveElement, p as createGlobalState } from './server.mjs';
import { p as pb, g as getImageUrl, L as Label_default } from './pocketbase-DJpo7-rk.mjs';
import { e as createReusableTemplate, f as usePointerSwipe } from './index-CtsWe4-H.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { T as upperFirst, A as defu } from '../nitro/nitro.mjs';
import { useSortable } from '@vueuse/integrations/useSortable';
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

const useBodyLockStackCount = createSharedComposable$1(() => {
  const map = vueExports.ref(/* @__PURE__ */ new Map());
  vueExports.ref();
  const locked = vueExports.computed(() => {
    for (const value of map.value.values()) if (value) return true;
    return false;
  });
  injectConfigProviderContext({ scrollBody: vueExports.ref(true) });
  vueExports.watch(locked, (val, oldVal) => {
    return;
  }, {
    immediate: true,
    flush: "sync"
  });
  return map;
});
function useBodyScrollLock(initialState) {
  const id = Math.random().toString(36).substring(2, 7);
  const map = useBodyLockStackCount();
  map.value.set(id, initialState);
  const locked = vueExports.computed({
    get: () => map.value.get(id) ?? false,
    set: (value) => map.value.set(id, value)
  });
  tryOnBeforeUnmount();
  return locked;
}
function useFormControl(el) {
  return vueExports.computed(() => vueExports.toValue(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}
var getDefaultParent = function(originalTarget) {
  {
    return null;
  }
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
  return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
  return targets.map(function(target) {
    if (parent.contains(target)) {
      return target;
    }
    var correctedTarget = unwrapHost(target);
    if (correctedTarget && parent.contains(correctedTarget)) {
      return correctedTarget;
    }
    console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
    return null;
  }).filter(function(x) {
    return Boolean(x);
  });
};
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
  var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
  if (!markerMap[markerName]) {
    markerMap[markerName] = /* @__PURE__ */ new WeakMap();
  }
  var markerCounter = markerMap[markerName];
  var hiddenNodes = [];
  var elementsToKeep = /* @__PURE__ */ new Set();
  var elementsToStop = new Set(targets);
  var keep = function(el) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }
    elementsToKeep.add(el);
    keep(el.parentNode);
  };
  targets.forEach(keep);
  var deep = function(parent) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }
    Array.prototype.forEach.call(parent.children, function(node) {
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        try {
          var attr = node.getAttribute(controlAttribute);
          var alreadyHidden = attr !== null && attr !== "false";
          var counterValue = (counterMap.get(node) || 0) + 1;
          var markerValue = (markerCounter.get(node) || 0) + 1;
          counterMap.set(node, counterValue);
          markerCounter.set(node, markerValue);
          hiddenNodes.push(node);
          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node, true);
          }
          if (markerValue === 1) {
            node.setAttribute(markerName, "true");
          }
          if (!alreadyHidden) {
            node.setAttribute(controlAttribute, "true");
          }
        } catch (e) {
          console.error("aria-hidden: cannot operate on ", node, e);
        }
      }
    });
  };
  deep(parentNode);
  elementsToKeep.clear();
  lockCount++;
  return function() {
    hiddenNodes.forEach(function(node) {
      var counterValue = counterMap.get(node) - 1;
      var markerValue = markerCounter.get(node) - 1;
      counterMap.set(node, counterValue);
      markerCounter.set(node, markerValue);
      if (!counterValue) {
        if (!uncontrolledNodes.has(node)) {
          node.removeAttribute(controlAttribute);
        }
        uncontrolledNodes.delete(node);
      }
      if (!markerValue) {
        node.removeAttribute(markerName);
      }
    });
    lockCount--;
    if (!lockCount) {
      counterMap = /* @__PURE__ */ new WeakMap();
      counterMap = /* @__PURE__ */ new WeakMap();
      uncontrolledNodes = /* @__PURE__ */ new WeakMap();
      markerMap = {};
    }
  };
};
var hideOthers = function(originalTarget, parentNode, markerName) {
  if (markerName === void 0) {
    markerName = "data-aria-hidden";
  }
  var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
  var activeParentNode = getDefaultParent();
  if (!activeParentNode) {
    return function() {
      return null;
    };
  }
  targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
  return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
function useHideOthers(target) {
  let undo;
  vueExports.watch(() => unrefElement(target), (el) => {
    if (el) undo = hideOthers(el);
    else if (undo) undo();
  });
}
let count$1 = 0;
function useId(deterministicId, prefix = "reka") {
  if ("useId" in vue) return `${prefix}-${vueExports.useId?.()}`;
  const configProviderContext = injectConfigProviderContext({ useId: void 0 });
  if (configProviderContext.useId) return `${prefix}-${configProviderContext.useId()}`;
  return `${prefix}-${++count$1}`;
}
const [injectDialogRootContext, provideDialogRootContext] = createContext("DialogRoot");
var DialogRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "DialogRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    modal: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = vueExports.ref();
    const contentElement = vueExports.ref();
    const { modal } = vueExports.toRefs(props);
    provideDialogRootContext({
      open,
      modal,
      openModal: () => {
        open.value = true;
      },
      onOpenChange: (value) => {
        open.value = value;
      },
      onOpenToggle: () => {
        open.value = !open.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement,
      contentElement
    });
    return (_ctx, _cache) => {
      return vueExports.renderSlot(_ctx.$slots, "default", {
        open: vueExports.unref(open),
        close: () => open.value = false
      });
    };
  }
});
var DialogRoot_default = DialogRoot_vue_vue_type_script_setup_true_lang_default;
var DialogClose_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogClose",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, {
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: _cache[0] || (_cache[0] = ($event) => vueExports.unref(rootContext).onOpenChange(false))
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["type"]);
    };
  }
});
var DialogClose_default = DialogClose_vue_vue_type_script_setup_true_lang_default;
function usePointerDownOutside(onPointerDownOutside, element, enabled = true) {
  element?.value?.ownerDocument ?? globalThis?.document;
  const isPointerInsideDOMTree = vueExports.ref(false);
  vueExports.ref(() => {
  });
  vueExports.watchEffect((cleanupFn) => {
    return;
  });
  return { onPointerDownCapture: () => {
    if (!vueExports.toValue(enabled)) return;
    isPointerInsideDOMTree.value = true;
  } };
}
function useFocusOutside(onFocusOutside, element, enabled = true) {
  element?.value?.ownerDocument ?? globalThis?.document;
  const isFocusInsideDOMTree = vueExports.ref(false);
  vueExports.watchEffect((cleanupFn) => {
    return;
  });
  return {
    onFocusCapture: () => {
      if (!vueExports.toValue(enabled)) return;
      isFocusInsideDOMTree.value = true;
    },
    onBlurCapture: () => {
      if (!vueExports.toValue(enabled)) return;
      isFocusInsideDOMTree.value = false;
    }
  };
}
const context = vueExports.reactive({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "dismiss"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement: layerElement } = useForwardExpose();
    const ownerDocument = vueExports.computed(() => layerElement.value?.ownerDocument ?? globalThis.document);
    const layers = vueExports.computed(() => context.layersRoot);
    const index = vueExports.computed(() => {
      return layerElement.value ? Array.from(layers.value).indexOf(layerElement.value) : -1;
    });
    const isBodyPointerEventsDisabled = vueExports.computed(() => {
      return context.layersWithOutsidePointerEventsDisabled.size > 0;
    });
    const isPointerEventsEnabled = vueExports.computed(() => {
      const localLayers = Array.from(layers.value);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = localLayers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex;
    });
    const pointerDownOutside = usePointerDownOutside(async (event) => {
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch?.contains(event.target));
      if (!isPointerEventsEnabled.value || isPointerDownOnBranch) return;
      emits("pointerDownOutside", event);
      emits("interactOutside", event);
      await vueExports.nextTick();
      if (!event.defaultPrevented) emits("dismiss");
    }, layerElement);
    const focusOutside = useFocusOutside((event) => {
      const isFocusInBranch = [...context.branches].some((branch) => branch?.contains(event.target));
      if (isFocusInBranch) return;
      emits("focusOutside", event);
      emits("interactOutside", event);
      if (!event.defaultPrevented) emits("dismiss");
    }, layerElement);
    onKeyStroke("Escape", (event) => {
      const isHighestLayer = index.value === layers.value.size - 1;
      if (!isHighestLayer) return;
      emits("escapeKeyDown", event);
      if (!event.defaultPrevented) emits("dismiss");
    });
    vueExports.watchEffect((cleanupFn) => {
      if (!layerElement.value) return;
      if (props.disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          context.originalBodyPointerEvents = ownerDocument.value.body.style.pointerEvents;
          ownerDocument.value.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(layerElement.value);
      }
      layers.value.add(layerElement.value);
      cleanupFn(() => {
        if (props.disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1 && !isNullish(context.originalBodyPointerEvents)) ownerDocument.value.body.style.pointerEvents = context.originalBodyPointerEvents;
      });
    });
    vueExports.watchEffect((cleanupFn) => {
      cleanupFn(() => {
        if (!layerElement.value) return;
        layers.value.delete(layerElement.value);
        context.layersWithOutsidePointerEventsDisabled.delete(layerElement.value);
      });
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        ref: vueExports.unref(forwardRef),
        "as-child": _ctx.asChild,
        as: _ctx.as,
        "data-dismissable-layer": "",
        style: vueExports.normalizeStyle({ pointerEvents: isBodyPointerEventsDisabled.value ? isPointerEventsEnabled.value ? "auto" : "none" : void 0 }),
        onFocusCapture: vueExports.unref(focusOutside).onFocusCapture,
        onBlurCapture: vueExports.unref(focusOutside).onBlurCapture,
        onPointerdownCapture: vueExports.unref(pointerDownOutside).onPointerDownCapture
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as-child",
        "as",
        "style",
        "onFocusCapture",
        "onBlurCapture",
        "onPointerdownCapture"
      ]);
    };
  }
});
var DismissableLayer_default = DismissableLayer_vue_vue_type_script_setup_true_lang_default;
const useFocusStackState = createGlobalState(() => {
  const stack = vueExports.ref([]);
  return stack;
});
function createFocusScopesStack() {
  const stack = useFocusStackState();
  return {
    add(focusScope) {
      const activeFocusScope = stack.value[0];
      if (focusScope !== activeFocusScope) activeFocusScope?.pause();
      stack.value = arrayRemove(stack.value, focusScope);
      stack.value.unshift(focusScope);
    },
    remove(focusScope) {
      stack.value = arrayRemove(stack.value, focusScope);
      stack.value[0]?.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) updatedArray.splice(index, 1);
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}
var FocusScope_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FocusScope",
  props: {
    loop: {
      type: Boolean,
      required: false,
      default: false
    },
    trapped: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: ["mountAutoFocus", "unmountAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { currentRef, currentElement } = useForwardExpose();
    vueExports.ref(null);
    const focusScopesStack = createFocusScopesStack();
    const focusScope = vueExports.reactive({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    });
    vueExports.watchEffect((cleanupFn) => {
      return;
    });
    vueExports.watchEffect(async (cleanupFn) => {
      const container = currentElement.value;
      await vueExports.nextTick();
      if (!container) return;
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = getActiveElement();
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, (ev) => emits("mountAutoFocus", ev));
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (getActiveElement() === previouslyFocusedElement) focus(container);
        }
      }
      cleanupFn(() => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, (ev) => emits("mountAutoFocus", ev));
        const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
        const unmountEventHandler = (ev) => {
          emits("unmountAutoFocus", ev);
        };
        container.addEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
        container.dispatchEvent(unmountEvent);
        setTimeout(() => {
          if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? (void 0).body, { select: true });
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
          focusScopesStack.remove(focusScope);
        }, 0);
      });
    });
    function handleKeyDown(event) {
      if (!props.loop && !props.trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = getActiveElement();
      if (isTabKey && focusedElement) {
        const container = event.currentTarget;
        const [first, last] = getTabbableEdges(container);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container) event.preventDefault();
        } else if (!event.shiftKey && focusedElement === last) {
          event.preventDefault();
          if (props.loop) focus(first, { select: true });
        } else if (event.shiftKey && focusedElement === first) {
          event.preventDefault();
          if (props.loop) focus(last, { select: true });
        }
      }
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        ref_key: "currentRef",
        ref: currentRef,
        tabindex: "-1",
        "as-child": _ctx.asChild,
        as: _ctx.as,
        onKeydown: handleKeyDown
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as-child", "as"]);
    };
  }
});
var FocusScope_default = FocusScope_vue_vue_type_script_setup_true_lang_default;
function getOpenState(open) {
  return open ? "open" : "closed";
}
var DialogContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContentImpl",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    rootContext.titleId ||= useId(void 0, "reka-dialog-title");
    rootContext.descriptionId ||= useId(void 0, "reka-dialog-description");
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(FocusScope_default), {
        "as-child": "",
        loop: "",
        trapped: props.trapFocus,
        onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
        onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(DismissableLayer_default), vueExports.mergeProps({
          id: vueExports.unref(rootContext).contentId,
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
          role: "dialog",
          "aria-describedby": vueExports.unref(rootContext).descriptionId,
          "aria-labelledby": vueExports.unref(rootContext).titleId,
          "data-state": vueExports.unref(getOpenState)(vueExports.unref(rootContext).open.value)
        }, _ctx.$attrs, {
          onDismiss: _cache[0] || (_cache[0] = ($event) => vueExports.unref(rootContext).onOpenChange(false)),
          onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
          onFocusOutside: _cache[2] || (_cache[2] = ($event) => emits("focusOutside", $event)),
          onInteractOutside: _cache[3] || (_cache[3] = ($event) => emits("interactOutside", $event)),
          onPointerDownOutside: _cache[4] || (_cache[4] = ($event) => emits("pointerDownOutside", $event))
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "as",
          "as-child",
          "disable-outside-pointer-events",
          "aria-describedby",
          "aria-labelledby",
          "data-state"
        ])]),
        _: 3
      }, 8, ["trapped"]);
    };
  }
});
var DialogContentImpl_default = DialogContentImpl_vue_vue_type_script_setup_true_lang_default;
var DialogContentModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContentModal",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const emitsAsProps = useEmitAsProps(emits);
    const { forwardRef, currentElement } = useForwardExpose();
    useHideOthers(currentElement);
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(DialogContentImpl_default, vueExports.mergeProps({
        ...props,
        ...vueExports.unref(emitsAsProps)
      }, {
        ref: vueExports.unref(forwardRef),
        "trap-focus": vueExports.unref(rootContext).open.value,
        "disable-outside-pointer-events": true,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          if (!event.defaultPrevented) {
            event.preventDefault();
            vueExports.unref(rootContext).triggerElement.value?.focus();
          }
        }),
        onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: _cache[2] || (_cache[2] = (event) => {
          event.preventDefault();
        })
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["trap-focus"]);
    };
  }
});
var DialogContentModal_default = DialogContentModal_vue_vue_type_script_setup_true_lang_default;
var DialogContentNonModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContentNonModal",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const emitsAsProps = useEmitAsProps(emits);
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    const hasInteractedOutsideRef = vueExports.ref(false);
    const hasPointerDownOutsideRef = vueExports.ref(false);
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(DialogContentImpl_default, vueExports.mergeProps({
        ...props,
        ...vueExports.unref(emitsAsProps)
      }, {
        "trap-focus": false,
        "disable-outside-pointer-events": false,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.value) vueExports.unref(rootContext).triggerElement.value?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.value = false;
          hasPointerDownOutsideRef.value = false;
        }),
        onInteractOutside: _cache[1] || (_cache[1] = (event) => {
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.value = true;
            if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
          }
          const target = event.target;
          const targetIsTrigger = vueExports.unref(rootContext).triggerElement.value?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
        })
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DialogContentNonModal_default = DialogContentNonModal_vue_vue_type_script_setup_true_lang_default;
var DialogContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const emitsAsProps = useEmitAsProps(emits);
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), { present: _ctx.forceMount || vueExports.unref(rootContext).open.value }, {
        default: vueExports.withCtx(() => [vueExports.unref(rootContext).modal.value ? (vueExports.openBlock(), vueExports.createBlock(DialogContentModal_default, vueExports.mergeProps({
          key: 0,
          ref: vueExports.unref(forwardRef)
        }, {
          ...props,
          ...vueExports.unref(emitsAsProps),
          ..._ctx.$attrs
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)) : (vueExports.openBlock(), vueExports.createBlock(DialogContentNonModal_default, vueExports.mergeProps({
          key: 1,
          ref: vueExports.unref(forwardRef)
        }, {
          ...props,
          ...vueExports.unref(emitsAsProps),
          ..._ctx.$attrs
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16))]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var DialogContent_default = DialogContent_vue_vue_type_script_setup_true_lang_default;
var DialogDescription_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogDescription",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "p"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(rootContext).descriptionId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var DialogDescription_default = DialogDescription_vue_vue_type_script_setup_true_lang_default;
var DialogOverlayImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogOverlayImpl",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const rootContext = injectDialogRootContext();
    useBodyScrollLock(true);
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-state": vueExports.unref(rootContext).open.value ? "open" : "closed",
        style: { "pointer-events": "auto" }
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-state"
      ]);
    };
  }
});
var DialogOverlayImpl_default = DialogOverlayImpl_vue_vue_type_script_setup_true_lang_default;
var DialogOverlay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogOverlay",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const rootContext = injectDialogRootContext();
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.unref(rootContext)?.modal.value ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), {
        key: 0,
        present: _ctx.forceMount || vueExports.unref(rootContext).open.value
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(DialogOverlayImpl_default, vueExports.mergeProps(_ctx.$attrs, {
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, ["as", "as-child"])]),
        _: 3
      }, 8, ["present"])) : vueExports.createCommentVNode("v-if", true);
    };
  }
});
var DialogOverlay_default = DialogOverlay_vue_vue_type_script_setup_true_lang_default;
var DialogPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Teleport_default), vueExports.normalizeProps(vueExports.guardReactiveProps(props)), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DialogPortal_default = DialogPortal_vue_vue_type_script_setup_true_lang_default;
var DialogTitle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogTitle",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "h2"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectDialogRootContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(rootContext).titleId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var DialogTitle_default = DialogTitle_vue_vue_type_script_setup_true_lang_default;
var DialogTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectDialogRootContext();
    const { forwardRef } = useForwardExpose();
    rootContext.contentId ||= useId(void 0, "reka-dialog-content");
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, {
        ref: vueExports.unref(forwardRef),
        type: _ctx.as === "button" ? "button" : void 0,
        "aria-haspopup": "dialog",
        "aria-expanded": vueExports.unref(rootContext).open.value || false,
        "aria-controls": vueExports.unref(rootContext).open.value ? vueExports.unref(rootContext).contentId : void 0,
        "data-state": vueExports.unref(rootContext).open.value ? "open" : "closed",
        onClick: vueExports.unref(rootContext).onOpenToggle
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "type",
        "aria-expanded",
        "aria-controls",
        "data-state",
        "onClick"
      ]);
    };
  }
});
var DialogTrigger_default = DialogTrigger_vue_vue_type_script_setup_true_lang_default;
var VisuallyHiddenInputBubble_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInputBubble",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    required: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    feature: {
      type: String,
      required: false,
      default: "fully-hidden"
    }
  },
  setup(__props) {
    const props = __props;
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const valueState = vueExports.computed(() => props.checked ?? props.value);
    vueExports.watch(valueState, (cur, prev) => {
      if (!currentElement.value) return;
      const input = currentElement.value;
      const inputProto = (void 0).HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (setValue && cur !== prev) {
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        setValue.call(input, cur);
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      }
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(VisuallyHidden_default, vueExports.mergeProps({
        ref_key: "primitiveElement",
        ref: primitiveElement
      }, {
        ...props,
        ..._ctx.$attrs
      }, { as: "input" }), null, 16);
    };
  }
});
var VisuallyHiddenInputBubble_default = VisuallyHiddenInputBubble_vue_vue_type_script_setup_true_lang_default;
var VisuallyHiddenInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInput",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    required: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    feature: {
      type: String,
      required: false,
      default: "fully-hidden"
    }
  },
  setup(__props) {
    const props = __props;
    const isFormArrayEmptyAndRequired = vueExports.computed(() => typeof props.value === "object" && Array.isArray(props.value) && props.value.length === 0 && props.required);
    const parsedValue = vueExports.computed(() => {
      if (typeof props.value === "string" || typeof props.value === "number" || typeof props.value === "boolean" || props.value === null || props.value === void 0) return [{
        name: props.name,
        value: props.value
      }];
      else if (typeof props.value === "object" && Array.isArray(props.value)) return props.value.flatMap((obj, index) => {
        if (typeof obj === "object") return Object.entries(obj).map(([key, value]) => ({
          name: `${props.name}[${index}][${key}]`,
          value
        }));
        else return {
          name: `${props.name}[${index}]`,
          value: obj
        };
      });
      else if (props.value !== null && typeof props.value === "object" && !Array.isArray(props.value)) return Object.entries(props.value).map(([key, value]) => ({
        name: `${props.name}[${key}]`,
        value
      }));
      return [];
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, null, [vueExports.createCommentVNode(" We render single input if it's required "), isFormArrayEmptyAndRequired.value ? (vueExports.openBlock(), vueExports.createBlock(VisuallyHiddenInputBubble_default, vueExports.mergeProps({ key: _ctx.name }, {
        ...props,
        ..._ctx.$attrs
      }, {
        name: _ctx.name,
        value: _ctx.value
      }), null, 16, ["name", "value"])) : (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(parsedValue.value, (parsed) => {
        return vueExports.openBlock(), vueExports.createBlock(VisuallyHiddenInputBubble_default, vueExports.mergeProps({ key: parsed.name }, { ref_for: true }, {
          ...props,
          ..._ctx.$attrs
        }, {
          name: parsed.name,
          value: parsed.value
        }), null, 16, ["name", "value"]);
      }), 128))], 2112);
    };
  }
});
var VisuallyHiddenInput_default = VisuallyHiddenInput_vue_vue_type_script_setup_true_lang_default;
function memo$1(getDeps, fn, opts) {
  let deps = opts.initialDeps ?? [];
  let result;
  let isInitial = true;
  function memoizedFunction() {
    var _a, _b, _c;
    let depTime;
    if (opts.key && ((_a = opts.debug) == null ? void 0 : _a.call(opts))) depTime = Date.now();
    const newDeps = getDeps();
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && ((_b = opts.debug) == null ? void 0 : _b.call(opts))) resultTime = Date.now();
    result = fn(...newDeps);
    if (opts.key && ((_c = opts.debug) == null ? void 0 : _c.call(opts))) {
      const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
      const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
      const resultFpsPercentage = resultEndTime / 16;
      const pad = (str, num) => {
        str = String(str);
        while (str.length < num) {
          str = " " + str;
        }
        return str;
      };
      console.info(
        `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * resultFpsPercentage, 120)
        )}deg 100% 31%);`,
        opts == null ? void 0 : opts.key
      );
    }
    if ((opts == null ? void 0 : opts.onChange) && !(isInitial && opts.skipInitialOnChange)) {
      opts.onChange(result);
    }
    isInitial = false;
    return result;
  }
  memoizedFunction.updateDeps = (newDeps) => {
    deps = newDeps;
  };
  return memoizedFunction;
}
function notUndefined(value, msg) {
  if (value === void 0) {
    throw new Error(`Unexpected undefined${""}`);
  } else {
    return value;
  }
}
const approxEqual = (a, b) => Math.abs(a - b) < 1.01;
const debounce = (targetWindow, fn, ms) => {
  let timeoutId;
  return function(...args) {
    targetWindow.clearTimeout(timeoutId);
    timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
  };
};
const getRect = (element) => {
  const { offsetWidth, offsetHeight } = element;
  return { width: offsetWidth, height: offsetHeight };
};
const defaultKeyExtractor = (index) => index;
const defaultRangeExtractor = (range) => {
  const start = Math.max(range.startIndex - range.overscan, 0);
  const end = Math.min(range.endIndex + range.overscan, range.count - 1);
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};
const observeElementRect = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  const handler = (rect) => {
    const { width, height } = rect;
    cb({ width: Math.round(width), height: Math.round(height) });
  };
  handler(getRect(element));
  if (!targetWindow.ResizeObserver) {
    return () => {
    };
  }
  const observer = new targetWindow.ResizeObserver((entries) => {
    const run = () => {
      const entry = entries[0];
      if (entry == null ? void 0 : entry.borderBoxSize) {
        const box = entry.borderBoxSize[0];
        if (box) {
          handler({ width: box.inlineSize, height: box.blockSize });
          return;
        }
      }
      handler(getRect(element));
    };
    instance.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
  });
  observer.observe(element, { box: "border-box" });
  return () => {
    observer.unobserve(element);
  };
};
const addEventListenerOptions = {
  passive: true
};
const supportsScrollend = true;
const observeElementOffset = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  let offset = 0;
  const fallback = instance.options.useScrollendEvent && supportsScrollend ? () => void 0 : debounce(
    targetWindow,
    () => {
      cb(offset, false);
    },
    instance.options.isScrollingResetDelay
  );
  const createHandler = (isScrolling) => () => {
    const { horizontal, isRtl } = instance.options;
    offset = horizontal ? element["scrollLeft"] * (isRtl && -1 || 1) : element["scrollTop"];
    fallback();
    cb(offset, isScrolling);
  };
  const handler = createHandler(true);
  const endHandler = createHandler(false);
  element.addEventListener("scroll", handler, addEventListenerOptions);
  const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend;
  if (registerScrollendEvent) {
    element.addEventListener("scrollend", endHandler, addEventListenerOptions);
  }
  return () => {
    element.removeEventListener("scroll", handler);
    if (registerScrollendEvent) {
      element.removeEventListener("scrollend", endHandler);
    }
  };
};
const measureElement = (element, entry, instance) => {
  if (entry == null ? void 0 : entry.borderBoxSize) {
    const box = entry.borderBoxSize[0];
    if (box) {
      const size = Math.round(
        box[instance.options.horizontal ? "inlineSize" : "blockSize"]
      );
      return size;
    }
  }
  return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
const elementScroll = (offset, {
  adjustments = 0,
  behavior
}, instance) => {
  var _a, _b;
  const toOffset = offset + adjustments;
  (_b = (_a = instance.scrollElement) == null ? void 0 : _a.scrollTo) == null ? void 0 : _b.call(_a, {
    [instance.options.horizontal ? "left" : "top"]: toOffset,
    behavior
  });
};
class Virtualizer {
  constructor(opts) {
    this.unsubs = [];
    this.scrollElement = null;
    this.targetWindow = null;
    this.isScrolling = false;
    this.currentScrollToIndex = null;
    this.measurementsCache = [];
    this.itemSizeCache = /* @__PURE__ */ new Map();
    this.laneAssignments = /* @__PURE__ */ new Map();
    this.pendingMeasuredCacheIndexes = [];
    this.prevLanes = void 0;
    this.lanesChangedFlag = false;
    this.lanesSettling = false;
    this.scrollRect = null;
    this.scrollOffset = null;
    this.scrollDirection = null;
    this.scrollAdjustments = 0;
    this.elementsCache = /* @__PURE__ */ new Map();
    this.observer = /* @__PURE__ */ (() => {
      let _ro = null;
      const get = () => {
        if (_ro) {
          return _ro;
        }
        if (!this.targetWindow || !this.targetWindow.ResizeObserver) {
          return null;
        }
        return _ro = new this.targetWindow.ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const run = () => {
              this._measureElement(entry.target, entry);
            };
            this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
          });
        });
      };
      return {
        disconnect: () => {
          var _a;
          (_a = get()) == null ? void 0 : _a.disconnect();
          _ro = null;
        },
        observe: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.observe(target, { box: "border-box" });
        },
        unobserve: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.unobserve(target);
        }
      };
    })();
    this.range = null;
    this.setOptions = (opts2) => {
      Object.entries(opts2).forEach(([key, value]) => {
        if (typeof value === "undefined") delete opts2[key];
      });
      this.options = {
        debug: false,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: false,
        getItemKey: defaultKeyExtractor,
        rangeExtractor: defaultRangeExtractor,
        onChange: () => {
        },
        measureElement,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: true,
        isRtl: false,
        useScrollendEvent: false,
        useAnimationFrameWithResizeObserver: false,
        ...opts2
      };
    };
    this.notify = (sync) => {
      var _a, _b;
      (_b = (_a = this.options).onChange) == null ? void 0 : _b.call(_a, this, sync);
    };
    this.maybeNotify = memo$1(
      () => {
        this.calculateRange();
        return [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ];
      },
      (isScrolling) => {
        this.notify(isScrolling);
      },
      {
        key: "production" !== "production",
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    );
    this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((d) => d());
      this.unsubs = [];
      this.observer.disconnect();
      this.scrollElement = null;
      this.targetWindow = null;
    };
    this._didMount = () => {
      return () => {
        this.cleanup();
      };
    };
    this._willUpdate = () => {
      var _a;
      const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== scrollElement) {
        this.cleanup();
        if (!scrollElement) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = scrollElement;
        if (this.scrollElement && "ownerDocument" in this.scrollElement) {
          this.targetWindow = this.scrollElement.ownerDocument.defaultView;
        } else {
          this.targetWindow = ((_a = this.scrollElement) == null ? void 0 : _a.window) ?? null;
        }
        this.elementsCache.forEach((cached) => {
          this.observer.observe(cached);
        });
        this.unsubs.push(
          this.options.observeElementRect(this, (rect) => {
            this.scrollRect = rect;
            this.maybeNotify();
          })
        );
        this.unsubs.push(
          this.options.observeElementOffset(this, (offset, isScrolling) => {
            this.scrollAdjustments = 0;
            this.scrollDirection = isScrolling ? this.getScrollOffset() < offset ? "forward" : "backward" : null;
            this.scrollOffset = offset;
            this.isScrolling = isScrolling;
            this.maybeNotify();
          })
        );
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    };
    this.getSize = () => {
      if (!this.options.enabled) {
        this.scrollRect = null;
        return 0;
      }
      this.scrollRect = this.scrollRect ?? this.options.initialRect;
      return this.scrollRect[this.options.horizontal ? "width" : "height"];
    };
    this.getScrollOffset = () => {
      if (!this.options.enabled) {
        this.scrollOffset = null;
        return 0;
      }
      this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset);
      return this.scrollOffset;
    };
    this.getFurthestMeasurement = (measurements, index) => {
      const furthestMeasurementsFound = /* @__PURE__ */ new Map();
      const furthestMeasurements = /* @__PURE__ */ new Map();
      for (let m = index - 1; m >= 0; m--) {
        const measurement = measurements[m];
        if (furthestMeasurementsFound.has(measurement.lane)) {
          continue;
        }
        const previousFurthestMeasurement = furthestMeasurements.get(
          measurement.lane
        );
        if (previousFurthestMeasurement == null || measurement.end > previousFurthestMeasurement.end) {
          furthestMeasurements.set(measurement.lane, measurement);
        } else if (measurement.end < previousFurthestMeasurement.end) {
          furthestMeasurementsFound.set(measurement.lane, true);
        }
        if (furthestMeasurementsFound.size === this.options.lanes) {
          break;
        }
      }
      return furthestMeasurements.size === this.options.lanes ? Array.from(furthestMeasurements.values()).sort((a, b) => {
        if (a.end === b.end) {
          return a.index - b.index;
        }
        return a.end - b.end;
      })[0] : void 0;
    };
    this.getMeasurementOptions = memo$1(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes
      ],
      (count2, paddingStart, scrollMargin, getItemKey, enabled, lanes) => {
        const lanesChanged = this.prevLanes !== void 0 && this.prevLanes !== lanes;
        if (lanesChanged) {
          this.lanesChangedFlag = true;
        }
        this.prevLanes = lanes;
        this.pendingMeasuredCacheIndexes = [];
        return {
          count: count2,
          paddingStart,
          scrollMargin,
          getItemKey,
          enabled,
          lanes
        };
      },
      {
        key: false
      }
    );
    this.getMeasurements = memo$1(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({ count: count2, paddingStart, scrollMargin, getItemKey, enabled, lanes }, itemSizeCache) => {
        if (!enabled) {
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          return [];
        }
        if (this.laneAssignments.size > count2) {
          for (const index of this.laneAssignments.keys()) {
            if (index >= count2) {
              this.laneAssignments.delete(index);
            }
          }
        }
        if (this.lanesChangedFlag) {
          this.lanesChangedFlag = false;
          this.lanesSettling = true;
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          this.pendingMeasuredCacheIndexes = [];
        }
        if (this.measurementsCache.length === 0 && !this.lanesSettling) {
          this.measurementsCache = this.options.initialMeasurementsCache;
          this.measurementsCache.forEach((item) => {
            this.itemSizeCache.set(item.key, item.size);
          });
        }
        const min2 = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        if (this.lanesSettling && this.measurementsCache.length === count2) {
          this.lanesSettling = false;
        }
        const measurements = this.measurementsCache.slice(0, min2);
        const laneLastIndex = new Array(lanes).fill(
          void 0
        );
        for (let m = 0; m < min2; m++) {
          const item = measurements[m];
          if (item) {
            laneLastIndex[item.lane] = m;
          }
        }
        for (let i = min2; i < count2; i++) {
          const key = getItemKey(i);
          const cachedLane = this.laneAssignments.get(i);
          let lane;
          let start;
          if (cachedLane !== void 0 && this.options.lanes > 1) {
            lane = cachedLane;
            const prevIndex = laneLastIndex[lane];
            const prevInLane = prevIndex !== void 0 ? measurements[prevIndex] : void 0;
            start = prevInLane ? prevInLane.end + this.options.gap : paddingStart + scrollMargin;
          } else {
            const furthestMeasurement = this.options.lanes === 1 ? measurements[i - 1] : this.getFurthestMeasurement(measurements, i);
            start = furthestMeasurement ? furthestMeasurement.end + this.options.gap : paddingStart + scrollMargin;
            lane = furthestMeasurement ? furthestMeasurement.lane : i % this.options.lanes;
            if (this.options.lanes > 1) {
              this.laneAssignments.set(i, lane);
            }
          }
          const measuredSize = itemSizeCache.get(key);
          const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
          const end = start + size;
          measurements[i] = {
            index: i,
            start,
            size,
            end,
            key,
            lane
          };
          laneLastIndex[lane] = i;
        }
        this.measurementsCache = measurements;
        return measurements;
      },
      {
        key: "production" !== "production",
        debug: () => this.options.debug
      }
    );
    this.calculateRange = memo$1(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (measurements, outerSize, scrollOffset, lanes) => {
        return this.range = measurements.length > 0 && outerSize > 0 ? calculateRange({
          measurements,
          outerSize,
          scrollOffset,
          lanes
        }) : null;
      },
      {
        key: "production" !== "production",
        debug: () => this.options.debug
      }
    );
    this.getVirtualIndexes = memo$1(
      () => {
        let startIndex = null;
        let endIndex = null;
        const range = this.calculateRange();
        if (range) {
          startIndex = range.startIndex;
          endIndex = range.endIndex;
        }
        this.maybeNotify.updateDeps([this.isScrolling, startIndex, endIndex]);
        return [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          startIndex,
          endIndex
        ];
      },
      (rangeExtractor, overscan, count2, startIndex, endIndex) => {
        return startIndex === null || endIndex === null ? [] : rangeExtractor({
          startIndex,
          endIndex,
          overscan,
          count: count2
        });
      },
      {
        key: "production" !== "production",
        debug: () => this.options.debug
      }
    );
    this.indexFromElement = (node) => {
      const attributeName = this.options.indexAttribute;
      const indexStr = node.getAttribute(attributeName);
      if (!indexStr) {
        console.warn(
          `Missing attribute name '${attributeName}={index}' on measured element.`
        );
        return -1;
      }
      return parseInt(indexStr, 10);
    };
    this._measureElement = (node, entry) => {
      const index = this.indexFromElement(node);
      const item = this.measurementsCache[index];
      if (!item) {
        return;
      }
      const key = item.key;
      const prevNode = this.elementsCache.get(key);
      if (prevNode !== node) {
        if (prevNode) {
          this.observer.unobserve(prevNode);
        }
        this.observer.observe(node);
        this.elementsCache.set(key, node);
      }
      if (node.isConnected) {
        this.resizeItem(index, this.options.measureElement(node, entry, this));
      }
    };
    this.resizeItem = (index, size) => {
      const item = this.measurementsCache[index];
      if (!item) {
        return;
      }
      const itemSize = this.itemSizeCache.get(item.key) ?? item.size;
      const delta = size - itemSize;
      if (delta !== 0) {
        if (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(item, delta, this) : item.start < this.getScrollOffset() + this.scrollAdjustments) {
          this._scrollToOffset(this.getScrollOffset(), {
            adjustments: this.scrollAdjustments += delta,
            behavior: void 0
          });
        }
        this.pendingMeasuredCacheIndexes.push(item.index);
        this.itemSizeCache = new Map(this.itemSizeCache.set(item.key, size));
        this.notify(false);
      }
    };
    this.measureElement = (node) => {
      if (!node) {
        this.elementsCache.forEach((cached, key) => {
          if (!cached.isConnected) {
            this.observer.unobserve(cached);
            this.elementsCache.delete(key);
          }
        });
        return;
      }
      this._measureElement(node, void 0);
    };
    this.getVirtualItems = memo$1(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (indexes, measurements) => {
        const virtualItems = [];
        for (let k = 0, len = indexes.length; k < len; k++) {
          const i = indexes[k];
          const measurement = measurements[i];
          virtualItems.push(measurement);
        }
        return virtualItems;
      },
      {
        key: "production" !== "production",
        debug: () => this.options.debug
      }
    );
    this.getVirtualItemForOffset = (offset) => {
      const measurements = this.getMeasurements();
      if (measurements.length === 0) {
        return void 0;
      }
      return notUndefined(
        measurements[findNearestBinarySearch(
          0,
          measurements.length - 1,
          (index) => notUndefined(measurements[index]).start,
          offset
        )]
      );
    };
    this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement) {
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      } else {
        const doc = this.scrollElement.document.documentElement;
        return this.options.horizontal ? doc.scrollWidth - this.scrollElement.innerWidth : doc.scrollHeight - this.scrollElement.innerHeight;
      }
    };
    this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
      if (!this.scrollElement) return 0;
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        align = toOffset >= scrollOffset + size ? "end" : "start";
      }
      if (align === "center") {
        toOffset += (itemSize - size) / 2;
      } else if (align === "end") {
        toOffset -= size;
      }
      const maxOffset = this.getMaxScrollOffset();
      return Math.max(Math.min(maxOffset, toOffset), 0);
    };
    this.getOffsetForIndex = (index, align = "auto") => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const item = this.measurementsCache[index];
      if (!item) {
        return void 0;
      }
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) {
          align = "end";
        } else if (item.start <= scrollOffset + this.options.scrollPaddingStart) {
          align = "start";
        } else {
          return [scrollOffset, align];
        }
      }
      if (align === "end" && index === this.options.count - 1) {
        return [this.getMaxScrollOffset(), align];
      }
      const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(toOffset, align, item.size),
        align
      ];
    };
    this.isDynamicMode = () => this.elementsCache.size > 0;
    this.scrollToOffset = (toOffset, { align = "start", behavior } = {}) => {
      if (behavior === "smooth" && this.isDynamicMode()) {
        console.warn(
          "The `smooth` scroll behavior is not fully supported with dynamic size."
        );
      }
      this._scrollToOffset(this.getOffsetForAlignment(toOffset, align), {
        adjustments: void 0,
        behavior
      });
    };
    this.scrollToIndex = (index, { align: initialAlign = "auto", behavior } = {}) => {
      if (behavior === "smooth" && this.isDynamicMode()) {
        console.warn(
          "The `smooth` scroll behavior is not fully supported with dynamic size."
        );
      }
      index = Math.max(0, Math.min(index, this.options.count - 1));
      this.currentScrollToIndex = index;
      let attempts = 0;
      const maxAttempts = 10;
      const tryScroll = (currentAlign) => {
        if (!this.targetWindow) return;
        const offsetInfo = this.getOffsetForIndex(index, currentAlign);
        if (!offsetInfo) {
          console.warn("Failed to get offset for index:", index);
          return;
        }
        const [offset, align] = offsetInfo;
        this._scrollToOffset(offset, { adjustments: void 0, behavior });
        this.targetWindow.requestAnimationFrame(() => {
          const verify = () => {
            if (this.currentScrollToIndex !== index) return;
            const currentOffset = this.getScrollOffset();
            const afterInfo = this.getOffsetForIndex(index, align);
            if (!afterInfo) {
              console.warn("Failed to get offset for index:", index);
              return;
            }
            if (!approxEqual(afterInfo[0], currentOffset)) {
              scheduleRetry(align);
            }
          };
          if (this.isDynamicMode()) {
            this.targetWindow.requestAnimationFrame(verify);
          } else {
            verify();
          }
        });
      };
      const scheduleRetry = (align) => {
        if (!this.targetWindow) return;
        if (this.currentScrollToIndex !== index) return;
        attempts++;
        if (attempts < maxAttempts) {
          this.targetWindow.requestAnimationFrame(() => tryScroll(align));
        } else {
          console.warn(
            `Failed to scroll to index ${index} after ${maxAttempts} attempts.`
          );
        }
      };
      tryScroll(initialAlign);
    };
    this.scrollBy = (delta, { behavior } = {}) => {
      if (behavior === "smooth" && this.isDynamicMode()) {
        console.warn(
          "The `smooth` scroll behavior is not fully supported with dynamic size."
        );
      }
      this._scrollToOffset(this.getScrollOffset() + delta, {
        adjustments: void 0,
        behavior
      });
    };
    this.getTotalSize = () => {
      var _a;
      const measurements = this.getMeasurements();
      let end;
      if (measurements.length === 0) {
        end = this.options.paddingStart;
      } else if (this.options.lanes === 1) {
        end = ((_a = measurements[measurements.length - 1]) == null ? void 0 : _a.end) ?? 0;
      } else {
        const endByLane = Array(this.options.lanes).fill(null);
        let endIndex = measurements.length - 1;
        while (endIndex >= 0 && endByLane.some((val) => val === null)) {
          const item = measurements[endIndex];
          if (endByLane[item.lane] === null) {
            endByLane[item.lane] = item.end;
          }
          endIndex--;
        }
        end = Math.max(...endByLane.filter((val) => val !== null));
      }
      return Math.max(
        end - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    };
    this._scrollToOffset = (offset, {
      adjustments,
      behavior
    }) => {
      this.options.scrollToFn(offset, { behavior, adjustments }, this);
    };
    this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map();
      this.laneAssignments = /* @__PURE__ */ new Map();
      this.notify(false);
    };
    this.setOptions(opts);
  }
}
const findNearestBinarySearch = (low, high, getCurrentValue, value) => {
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = getCurrentValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function calculateRange({
  measurements,
  outerSize,
  scrollOffset,
  lanes
}) {
  const lastIndex = measurements.length - 1;
  const getOffset = (index) => measurements[index].start;
  if (measurements.length <= lanes) {
    return {
      startIndex: 0,
      endIndex: lastIndex
    };
  }
  let startIndex = findNearestBinarySearch(
    0,
    lastIndex,
    getOffset,
    scrollOffset
  );
  let endIndex = startIndex;
  if (lanes === 1) {
    while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
      endIndex++;
    }
  } else if (lanes > 1) {
    const endPerLane = Array(lanes).fill(0);
    while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
      const item = measurements[endIndex];
      endPerLane[item.lane] = item.end;
      endIndex++;
    }
    const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
    while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
      const item = measurements[startIndex];
      startPerLane[item.lane] = item.start;
      startIndex--;
    }
    startIndex = Math.max(0, startIndex - startIndex % lanes);
    endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
  }
  return { startIndex, endIndex };
}
function useVirtualizerBase(options) {
  const virtualizer = new Virtualizer(vueExports.unref(options));
  const state = vueExports.shallowRef(virtualizer);
  const cleanup = virtualizer._didMount();
  vueExports.watch(
    () => vueExports.unref(options).getScrollElement(),
    (el) => {
      if (el) {
        virtualizer._willUpdate();
      }
    },
    {
      immediate: true
    }
  );
  vueExports.watch(
    () => vueExports.unref(options),
    (options2) => {
      virtualizer.setOptions({
        ...options2,
        onChange: (instance, sync) => {
          var _a;
          vueExports.triggerRef(state);
          (_a = options2.onChange) == null ? void 0 : _a.call(options2, instance, sync);
        }
      });
      virtualizer._willUpdate();
      vueExports.triggerRef(state);
    },
    {
      immediate: true
    }
  );
  vueExports.onScopeDispose(cleanup);
  return state;
}
function useVirtualizer(options) {
  return useVirtualizerBase(
    vueExports.computed(() => ({
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      ...vueExports.unref(options)
    }))
  );
}
const [injectSwitchRootContext, provideSwitchRootContext] = createContext("SwitchRoot");
var SwitchRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SwitchRoot",
  props: {
    defaultValue: {
      type: Boolean,
      required: false
    },
    modelValue: {
      type: [Boolean, null],
      required: false,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: false
    },
    id: {
      type: String,
      required: false
    },
    value: {
      type: String,
      required: false,
      default: "on"
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { disabled } = vueExports.toRefs(props);
    const modelValue = useVModel(props, "modelValue", emit, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === void 0
    });
    function toggleCheck() {
      if (disabled.value) return;
      modelValue.value = !modelValue.value;
    }
    const { forwardRef, currentElement } = useForwardExpose();
    const isFormControl = useFormControl(currentElement);
    const ariaLabel = vueExports.computed(() => props.id && currentElement.value ? (void 0).querySelector(`[for="${props.id}"]`)?.innerText : void 0);
    provideSwitchRootContext({
      modelValue,
      toggleCheck,
      disabled
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(_ctx.$attrs, {
        id: _ctx.id,
        ref: vueExports.unref(forwardRef),
        role: "switch",
        type: _ctx.as === "button" ? "button" : void 0,
        value: _ctx.value,
        "aria-label": _ctx.$attrs["aria-label"] || ariaLabel.value,
        "aria-checked": vueExports.unref(modelValue),
        "aria-required": _ctx.required,
        "data-state": vueExports.unref(modelValue) ? "checked" : "unchecked",
        "data-disabled": vueExports.unref(disabled) ? "" : void 0,
        "as-child": _ctx.asChild,
        as: _ctx.as,
        disabled: vueExports.unref(disabled),
        onClick: toggleCheck,
        onKeydown: vueExports.withKeys(vueExports.withModifiers(toggleCheck, ["prevent"]), ["enter"])
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { modelValue: vueExports.unref(modelValue) }), vueExports.unref(isFormControl) && _ctx.name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHiddenInput_default), {
          key: 0,
          type: "checkbox",
          name: _ctx.name,
          disabled: vueExports.unref(disabled),
          required: _ctx.required,
          value: _ctx.value,
          checked: !!vueExports.unref(modelValue)
        }, null, 8, [
          "name",
          "disabled",
          "required",
          "value",
          "checked"
        ])) : vueExports.createCommentVNode("v-if", true)]),
        _: 3
      }, 16, [
        "id",
        "type",
        "value",
        "aria-label",
        "aria-checked",
        "aria-required",
        "data-state",
        "data-disabled",
        "as-child",
        "as",
        "disabled",
        "onKeydown"
      ]);
    };
  }
});
var SwitchRoot_default = SwitchRoot_vue_vue_type_script_setup_true_lang_default;
var SwitchThumb_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SwitchThumb",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const rootContext = injectSwitchRootContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        "data-state": vueExports.unref(rootContext).modelValue?.value ? "checked" : "unchecked",
        "data-disabled": vueExports.unref(rootContext).disabled.value ? "" : void 0,
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "data-state",
        "data-disabled",
        "as-child",
        "as"
      ]);
    };
  }
});
var SwitchThumb_default = SwitchThumb_vue_vue_type_script_setup_true_lang_default;
const theme$4 = {
  "slots": {
    "root": "relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5",
    "wrapper": "min-w-0 flex-1 flex flex-col",
    "title": "text-sm font-medium",
    "description": "text-sm opacity-90",
    "icon": "shrink-0 size-5",
    "avatar": "shrink-0",
    "avatarSize": "2xl",
    "actions": "flex flex-wrap gap-1.5 shrink-0",
    "close": "p-0"
  },
  "variants": {
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "orientation": {
      "horizontal": {
        "root": "items-center",
        "actions": "items-center"
      },
      "vertical": {
        "root": "items-start",
        "actions": "items-start mt-2.5"
      }
    },
    "title": {
      "true": {
        "description": "mt-1"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": {
        "root": "bg-primary text-inverted"
      }
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": {
        "root": "bg-secondary text-inverted"
      }
    },
    {
      "color": "success",
      "variant": "solid",
      "class": {
        "root": "bg-success text-inverted"
      }
    },
    {
      "color": "info",
      "variant": "solid",
      "class": {
        "root": "bg-info text-inverted"
      }
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": {
        "root": "bg-warning text-inverted"
      }
    },
    {
      "color": "error",
      "variant": "solid",
      "class": {
        "root": "bg-error text-inverted"
      }
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": {
        "root": "text-primary ring ring-inset ring-primary/25"
      }
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": {
        "root": "text-secondary ring ring-inset ring-secondary/25"
      }
    },
    {
      "color": "success",
      "variant": "outline",
      "class": {
        "root": "text-success ring ring-inset ring-success/25"
      }
    },
    {
      "color": "info",
      "variant": "outline",
      "class": {
        "root": "text-info ring ring-inset ring-info/25"
      }
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": {
        "root": "text-warning ring ring-inset ring-warning/25"
      }
    },
    {
      "color": "error",
      "variant": "outline",
      "class": {
        "root": "text-error ring ring-inset ring-error/25"
      }
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": {
        "root": "bg-primary/10 text-primary"
      }
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": {
        "root": "bg-secondary/10 text-secondary"
      }
    },
    {
      "color": "success",
      "variant": "soft",
      "class": {
        "root": "bg-success/10 text-success"
      }
    },
    {
      "color": "info",
      "variant": "soft",
      "class": {
        "root": "bg-info/10 text-info"
      }
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": {
        "root": "bg-warning/10 text-warning"
      }
    },
    {
      "color": "error",
      "variant": "soft",
      "class": {
        "root": "bg-error/10 text-error"
      }
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": {
        "root": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
      }
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": {
        "root": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
      }
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": {
        "root": "bg-success/10 text-success ring ring-inset ring-success/25"
      }
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": {
        "root": "bg-info/10 text-info ring ring-inset ring-info/25"
      }
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": {
        "root": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
      }
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": {
        "root": "bg-error/10 text-error ring ring-inset ring-error/25"
      }
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": {
        "root": "text-inverted bg-inverted"
      }
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": {
        "root": "text-highlighted bg-default ring ring-inset ring-default"
      }
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": {
        "root": "text-highlighted bg-elevated/50"
      }
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": {
        "root": "text-highlighted bg-elevated/50 ring ring-inset ring-accented"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid"
  }
};
const _sfc_main$8 = {
  __name: "UAlert",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    orientation: { type: null, required: false, default: "vertical" },
    actions: { type: Array, required: false },
    close: { type: [Boolean, Object], required: false },
    closeIcon: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const ui = vueExports.computed(() => tv({ extend: tv(theme$4), ...appConfig.ui?.alert || {} })({
      color: props.color,
      variant: props.variant,
      orientation: props.orientation,
      title: !!props.title || !!slots.title
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        as: __props.as,
        "data-orientation": __props.orientation,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
              if (__props.avatar) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$c, vueExports.mergeProps({
                  size: props.ui?.avatarSize || ui.value.avatarSize()
                }, __props.avatar, {
                  "data-slot": "avatar",
                  class: ui.value.avatar({ class: props.ui?.avatar })
                }), null, _parent2, _scopeId));
              } else if (__props.icon) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                  name: __props.icon,
                  "data-slot": "icon",
                  class: ui.value.icon({ class: props.ui?.icon })
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            _push2(`<div data-slot="wrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
            if (__props.title || !!slots.title) {
              _push2(`<div data-slot="title" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.title({ class: props.ui?.title }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.description || !!slots.description) {
              _push2(`<div data-slot="description" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.description({ class: props.ui?.description }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.orientation === "vertical" && (__props.actions?.length || !!slots.actions)) {
              _push2(`<div data-slot="actions" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.actions({ class: props.ui?.actions }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                _push2(`<!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(__props.actions, (action, index) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$9, vueExports.mergeProps({
                    key: index,
                    size: "xs"
                  }, { ref_for: true }, action), null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) || __props.close) {
              _push2(`<div data-slot="actions" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.actions({ class: props.ui?.actions, orientation: "horizontal" }))}"${_scopeId}>`);
              if (__props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions)) {
                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                  _push2(`<!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(__props.actions, (action, index) => {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$9, vueExports.mergeProps({
                      key: index,
                      size: "xs"
                    }, { ref_for: true }, action), null, _parent2, _scopeId));
                  });
                  _push2(`<!--]-->`);
                }, _push2, _parent2, _scopeId);
              } else {
                _push2(`<!---->`);
              }
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                if (__props.close) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$9, vueExports.mergeProps({
                    icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                    color: "neutral",
                    variant: "link",
                    "aria-label": vueExports.unref(t)("alert.close")
                  }, typeof __props.close === "object" ? __props.close : {}, {
                    "data-slot": "close",
                    class: ui.value.close({ class: props.ui?.close }),
                    onClick: ($event) => emits("update:open", false)
                  }), null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                __props.avatar ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$c, vueExports.mergeProps({
                  key: 0,
                  size: props.ui?.avatarSize || ui.value.avatarSize()
                }, __props.avatar, {
                  "data-slot": "avatar",
                  class: ui.value.avatar({ class: props.ui?.avatar })
                }), null, 16, ["size", "class"])) : __props.icon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                  key: 1,
                  name: __props.icon,
                  "data-slot": "icon",
                  class: ui.value.icon({ class: props.ui?.icon })
                }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
              ]),
              vueExports.createVNode("div", {
                "data-slot": "wrapper",
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  "data-slot": "title",
                  class: ui.value.title({ class: props.ui?.title })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                  ])
                ], 2)) : vueExports.createCommentVNode("", true),
                __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  "data-slot": "description",
                  class: ui.value.description({ class: props.ui?.description })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                  ])
                ], 2)) : vueExports.createCommentVNode("", true),
                __props.orientation === "vertical" && (__props.actions?.length || !!slots.actions) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  "data-slot": "actions",
                  class: ui.value.actions({ class: props.ui?.actions })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "actions", {}, () => [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.actions, (action, index) => {
                      return vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                        key: index,
                        size: "xs"
                      }, { ref_for: true }, action), null, 16);
                    }), 128))
                  ])
                ], 2)) : vueExports.createCommentVNode("", true)
              ], 2),
              __props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) || __props.close ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                "data-slot": "actions",
                class: ui.value.actions({ class: props.ui?.actions, orientation: "horizontal" })
              }, [
                __props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) ? vueExports.renderSlot(_ctx.$slots, "actions", { key: 0 }, () => [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.actions, (action, index) => {
                    return vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                      key: index,
                      size: "xs"
                    }, { ref_for: true }, action), null, 16);
                  }), 128))
                ]) : vueExports.createCommentVNode("", true),
                vueExports.renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                  __props.close ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                    key: 0,
                    icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                    color: "neutral",
                    variant: "link",
                    "aria-label": vueExports.unref(t)("alert.close")
                  }, typeof __props.close === "object" ? __props.close : {}, {
                    "data-slot": "close",
                    class: ui.value.close({ class: props.ui?.close }),
                    onClick: ($event) => emits("update:open", false)
                  }), null, 16, ["icon", "aria-label", "class", "onClick"])) : vueExports.createCommentVNode("", true)
                ])
              ], 2)) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "HeroAdmin",
  __ssrInlineRender: true,
  emits: ["showToast"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const showMobilePreview = vueExports.ref(false);
    const isEditingTitle = vueExports.ref(false);
    const tempTitle = vueExports.ref("");
    const heroFileInput = vueExports.ref(null);
    const heroMobileFileInput = vueExports.ref(null);
    const heroContainerRef = vueExports.ref(null);
    const { data: homepageRaw, refresh: refreshHomepage, error: homepageError } = useAsyncData(
      "admin-homepage",
      () => pb.collection("Homepage").getFirstListItem("Is_Active = true", { requestKey: null })
    );
    const heroImage = vueExports.computed(() => homepageRaw.value?.Hero_Image ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image) : "");
    const heroImageMobile = vueExports.computed(() => homepageRaw.value?.Hero_Image_Mobile ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image_Mobile) : "");
    const homepageId = vueExports.computed(() => homepageRaw.value?.id || "");
    usePointerSwipe(heroContainerRef, {
      onSwipeEnd: (_e, direction) => {
        if (isEditingTitle.value)
          return;
        if (direction === "left" && heroImageMobile.value) {
          showMobilePreview.value = true;
        } else if (direction === "right") {
          showMobilePreview.value = false;
        }
      }
    });
    const heroTitle = vueExports.ref("");
    vueExports.watch(homepageRaw, (val) => {
      if (val)
        heroTitle.value = val.Hero_Title || "";
    }, { immediate: true });
    vueExports.watch(homepageError, (err) => {
      if (err) {
        const status = err?.status || err?.data?.status;
        if (status === 401 || status === 403) {
          pb.authStore.clear();
          navigateTo("/admin");
        }
      }
    });
    async function handleTitleSave() {
      if (!homepageId.value || tempTitle.value.trim() === heroTitle.value) {
        isEditingTitle.value = false;
        return;
      }
      try {
        await pb.collection("Homepage").update(homepageId.value, { Hero_Title: tempTitle.value.trim() });
        heroTitle.value = tempTitle.value.trim();
        isEditingTitle.value = false;
        emit("showToast", "Hero title updated successfully", "success");
      } catch (err) {
        const typedErr = err;
        if (typedErr?.status === 401 || typedErr?.status === 403) {
          emit("showToast", "Your session has expired. Please login again.", "error");
          pb.authStore.clear();
          navigateTo("/admin");
          return;
        }
        emit("showToast", `Failed to update hero title: ${typedErr?.data?.message || typedErr?.message || "Unknown error"}`, "error");
        isEditingTitle.value = false;
      }
    }
    function handleTitleCancel() {
      isEditingTitle.value = false;
      tempTitle.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      if (vueExports.unref(heroImage) || vueExports.unref(heroImageMobile)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
          ref_key: "heroContainerRef",
          ref: heroContainerRef,
          class: "mb-12"
        }, _attrs))} data-v-a6d79fcf><div class="flex gap-6" data-v-a6d79fcf><div style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: vueExports.unref(showMobilePreview) ? "66.67%" : "100%", transition: "width 0.3s ease-out", flexShrink: 0 })}" data-v-a6d79fcf><div class="preview-container bg-elevated border-default group relative w-full overflow-hidden border" data-v-a6d79fcf><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(heroImage))} alt="Hero Desktop" class="absolute inset-0 h-full w-full object-cover" data-v-a6d79fcf>`);
        if (vueExports.unref(heroTitle)) {
          _push(`<!--[--><div class="pointer-events-none absolute inset-0 flex items-center justify-center" data-v-a6d79fcf><div class="px-6 text-center" data-v-a6d79fcf><button${serverRenderer_cjs_prodExports.ssrRenderAttr("contenteditable", vueExports.unref(isEditingTitle))} class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
            vueExports.unref(isEditingTitle) ? "cursor-text" : "cursor-pointer transition-opacity hover:opacity-80"
          ], "admin-title pointer-events-auto inline-block text-4xl leading-none text-white uppercase outline-none"])}"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", !vueExports.unref(isEditingTitle) ? "Click to edit" : void 0)} data-v-a6d79fcf>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(heroTitle))}</button></div></div>`);
          if (vueExports.unref(isEditingTitle)) {
            _push(`<div class="pointer-events-none absolute right-6 bottom-6 z-10 flex gap-2" data-v-a6d79fcf>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              size: "sm",
              icon: "i-ph-x",
              class: "pointer-events-auto",
              title: "Cancel",
              onClick: handleTitleCancel
            }, null, _parent));
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              variant: "outline",
              color: "neutral",
              size: "sm",
              icon: "i-ph-check",
              class: "pointer-events-auto",
              title: "Save",
              onClick: handleTitleSave
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (!vueExports.unref(isEditingTitle)) {
          _push(`<div class="group/update pointer-events-auto absolute right-0 bottom-0 p-6" data-v-a6d79fcf>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            variant: "outline",
            color: "neutral",
            size: "sm",
            icon: "i-ph-image",
            class: "opacity-0 transition-all group-hover/update:opacity-100",
            title: "Update Desktop Hero",
            onClick: ($event) => vueExports.unref(heroFileInput)?.click()
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
          width: vueExports.unref(showMobilePreview) ? "calc(33.33% - 24px)" : "0%",
          opacity: vueExports.unref(showMobilePreview) ? 1 : 0,
          overflow: "hidden",
          transition: "width 0.3s ease-out, opacity 0.3s ease-out",
          flexShrink: 0
        })}" data-v-a6d79fcf><div class="preview-container bg-elevated border-default group relative w-full overflow-hidden border" data-v-a6d79fcf><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(heroImageMobile))} alt="Hero Mobile" class="absolute inset-0 h-full w-full object-cover" data-v-a6d79fcf>`);
        if (!vueExports.unref(isEditingTitle)) {
          _push(`<div class="group/update pointer-events-auto absolute right-0 bottom-0 p-6" data-v-a6d79fcf>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            variant: "outline",
            color: "neutral",
            size: "sm",
            icon: "i-ph-image",
            class: "opacity-0 transition-all group-hover/update:opacity-100",
            title: "Update Mobile Hero",
            onClick: ($event) => vueExports.unref(heroMobileFileInput)?.click()
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        if (vueExports.unref(heroImageMobile)) {
          _push(`<div class="mt-3 flex items-center gap-3" data-v-a6d79fcf>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            variant: "ghost",
            color: "neutral",
            size: "sm",
            class: "text-xs tracking-wide uppercase",
            onClick: ($event) => showMobilePreview.value = !vueExports.unref(showMobilePreview)
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(showMobilePreview) ? "Hide mobile preview" : "Show mobile preview")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(showMobilePreview) ? "Hide mobile preview" : "Show mobile preview"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="text-dimmed text-xs" data-v-a6d79fcf> (or swipe left/right) </span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<input id="heroFileInput" type="file" accept="image/*" class="hidden" aria-label="Update Desktop Hero Image" data-v-a6d79fcf><input id="heroMobileFileInput" type="file" accept="image/*" class="hidden" aria-label="Update Mobile Hero Image" data-v-a6d79fcf></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/components/HeroAdmin.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__scopeId", "data-v-a6d79fcf"]]), { __name: "HeroAdmin" });
const theme$3 = {
  "slots": {
    "base": "font-medium inline-flex items-center",
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "xs": {
        "base": "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "sm": {
        "base": "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "md": {
        "base": "text-xs px-2 py-1 gap-1 rounded-md",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "lg": {
        "base": "text-sm px-2 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "text-base px-2.5 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-6"
      }
    },
    "square": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "bg-primary text-inverted"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "bg-secondary text-inverted"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "bg-success text-inverted"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "bg-info text-inverted"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "bg-warning text-inverted"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "bg-error text-inverted"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "text-primary ring ring-inset ring-primary/50"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "text-secondary ring ring-inset ring-secondary/50"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "text-success ring ring-inset ring-success/50"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "text-info ring ring-inset ring-info/50"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "text-warning ring ring-inset ring-warning/50"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "text-error ring ring-inset ring-error/50"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "bg-primary/10 text-primary"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "bg-secondary/10 text-secondary"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "bg-success/10 text-success"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "bg-info/10 text-info"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "bg-warning/10 text-warning"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "bg-error/10 text-error"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "bg-success/10 text-success ring ring-inset ring-success/25"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "bg-info/10 text-info ring ring-inset ring-info/25"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "bg-error/10 text-error ring ring-inset ring-error/25"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated"
    },
    {
      "size": "xs",
      "square": true,
      "class": "p-0.5"
    },
    {
      "size": "sm",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "md",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "lg",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "xl",
      "square": true,
      "class": "p-1"
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid",
    "size": "md"
  }
};
const _sfc_main$6 = {
  __name: "UBadge",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "span" },
    label: { type: [String, Number], required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const ui = vueExports.computed(() => tv({ extend: tv(theme$3), ...appConfig.ui?.badge || {} })({
      color: props.color,
      variant: props.variant,
      size: fieldGroupSize.value || props.size,
      square: props.square || !slots.default && !props.label,
      fieldGroup: orientation.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        as: __props.as,
        "data-slot": "base",
        class: ui.value.base({ class: [props.ui?.base, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
              if (vueExports.unref(isLeading) && vueExports.unref(leadingIconName)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                  name: vueExports.unref(leadingIconName),
                  "data-slot": "leadingIcon",
                  class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                }, null, _parent2, _scopeId));
              } else if (!!__props.avatar) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$c, vueExports.mergeProps({
                  size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                }, __props.avatar, {
                  "data-slot": "leadingAvatar",
                  class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar })
                }), null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
              if (__props.label !== void 0 && __props.label !== null) {
                _push2(`<span data-slot="label" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.label({ class: props.ui?.label }))}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
              if (vueExports.unref(isTrailing) && vueExports.unref(trailingIconName)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                  name: vueExports.unref(trailingIconName),
                  "data-slot": "trailingIcon",
                  class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                vueExports.unref(isLeading) && vueExports.unref(leadingIconName) ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                  key: 0,
                  name: vueExports.unref(leadingIconName),
                  "data-slot": "leadingIcon",
                  class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                }, null, 8, ["name", "class"])) : !!__props.avatar ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$c, vueExports.mergeProps({
                  key: 1,
                  size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                }, __props.avatar, {
                  "data-slot": "leadingAvatar",
                  class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar })
                }), null, 16, ["size", "class"])) : vueExports.createCommentVNode("", true)
              ]),
              vueExports.renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [
                __props.label !== void 0 && __props.label !== null ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  "data-slot": "label",
                  class: ui.value.label({ class: props.ui?.label })
                }, vueExports.toDisplayString(__props.label), 3)) : vueExports.createCommentVNode("", true)
              ]),
              vueExports.renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [
                vueExports.unref(isTrailing) && vueExports.unref(trailingIconName) ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                  key: 0,
                  name: vueExports.unref(trailingIconName),
                  "data-slot": "trailingIcon",
                  class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function makeStateUpdater(key, instance) {
  return (updater) => {
    instance.setState((old) => {
      return {
        ...old,
        [key]: functionalUpdate(updater, old[key])
      };
    });
  };
}
function isFunction(d) {
  return d instanceof Function;
}
function isNumberArray(d) {
  return Array.isArray(d) && d.every((val) => typeof val === "number");
}
function flattenBy(arr, getChildren) {
  const flat = [];
  const recurse = (subArr) => {
    subArr.forEach((item) => {
      flat.push(item);
      const children = getChildren(item);
      if (children != null && children.length) {
        recurse(children);
      }
    });
  };
  recurse(arr);
  return flat;
}
function memo(getDeps, fn, opts) {
  let deps = [];
  let result;
  return (depArgs) => {
    let depTime;
    if (opts.key && opts.debug) depTime = Date.now();
    const newDeps = getDeps(depArgs);
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && opts.debug) resultTime = Date.now();
    result = fn(...newDeps);
    opts == null || opts.onChange == null || opts.onChange(result);
    if (opts.key && opts.debug) {
      if (opts != null && opts.debug()) {
        const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
        const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
        const resultFpsPercentage = resultEndTime / 16;
        const pad = (str, num) => {
          str = String(str);
          while (str.length < num) {
            str = " " + str;
          }
          return str;
        };
        console.info(`%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * resultFpsPercentage, 120))}deg 100% 31%);`, opts == null ? void 0 : opts.key);
      }
    }
    return result;
  };
}
function getMemoOptions(tableOptions, debugLevel, key, onChange) {
  return {
    debug: () => {
      var _tableOptions$debugAl;
      return (_tableOptions$debugAl = tableOptions == null ? void 0 : tableOptions.debugAll) != null ? _tableOptions$debugAl : tableOptions[debugLevel];
    },
    key: "production" === "development",
    onChange
  };
}
function createCell(table, row, column, columnId) {
  const getRenderValue = () => {
    var _cell$getValue;
    return (_cell$getValue = cell.getValue()) != null ? _cell$getValue : table.options.renderFallbackValue;
  };
  const cell = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: memo(() => [table, column, row, cell], (table2, column2, row2, cell2) => ({
      table: table2,
      column: column2,
      row: row2,
      cell: cell2,
      getValue: cell2.getValue,
      renderValue: cell2.renderValue
    }), getMemoOptions(table.options, "debugCells"))
  };
  table._features.forEach((feature) => {
    feature.createCell == null || feature.createCell(cell, column, row, table);
  }, {});
  return cell;
}
function createColumn(table, columnDef, depth, parent) {
  var _ref, _resolvedColumnDef$id;
  const defaultColumn = table._getDefaultColumnDef();
  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef
  };
  const accessorKey = resolvedColumnDef.accessorKey;
  let id = (_ref = (_resolvedColumnDef$id = resolvedColumnDef.id) != null ? _resolvedColumnDef$id : accessorKey ? typeof String.prototype.replaceAll === "function" ? accessorKey.replaceAll(".", "_") : accessorKey.replace(/\./g, "_") : void 0) != null ? _ref : typeof resolvedColumnDef.header === "string" ? resolvedColumnDef.header : void 0;
  let accessorFn;
  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn;
  } else if (accessorKey) {
    if (accessorKey.includes(".")) {
      accessorFn = (originalRow) => {
        let result = originalRow;
        for (const key of accessorKey.split(".")) {
          var _result;
          result = (_result = result) == null ? void 0 : _result[key];
        }
        return result;
      };
    } else {
      accessorFn = (originalRow) => originalRow[resolvedColumnDef.accessorKey];
    }
  }
  if (!id) {
    throw new Error();
  }
  let column = {
    id: `${String(id)}`,
    accessorFn,
    parent,
    depth,
    columnDef: resolvedColumnDef,
    columns: [],
    getFlatColumns: memo(() => [true], () => {
      var _column$columns;
      return [column, ...(_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap((d) => d.getFlatColumns())];
    }, getMemoOptions(table.options, "debugColumns")),
    getLeafColumns: memo(() => [table._getOrderColumnsFn()], (orderColumns2) => {
      var _column$columns2;
      if ((_column$columns2 = column.columns) != null && _column$columns2.length) {
        let leafColumns = column.columns.flatMap((column2) => column2.getLeafColumns());
        return orderColumns2(leafColumns);
      }
      return [column];
    }, getMemoOptions(table.options, "debugColumns"))
  };
  for (const feature of table._features) {
    feature.createColumn == null || feature.createColumn(column, table);
  }
  return column;
}
const debug = "debugHeaders";
function createHeader(table, column, options) {
  var _options$id;
  const id = (_options$id = options.id) != null ? _options$id : column.id;
  let header = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const leafHeaders = [];
      const recurseHeader = (h) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader);
        }
        leafHeaders.push(h);
      };
      recurseHeader(header);
      return leafHeaders;
    },
    getContext: () => ({
      table,
      header,
      column
    })
  };
  table._features.forEach((feature) => {
    feature.createHeader == null || feature.createHeader(header, table);
  });
  return header;
}
const Headers = {
  createTable: (table) => {
    table.getHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
      var _left$map$filter, _right$map$filter;
      const leftColumns = (_left$map$filter = left == null ? void 0 : left.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter : [];
      const rightColumns = (_right$map$filter = right == null ? void 0 : right.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter : [];
      const centerColumns = leafColumns.filter((column) => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
      const headerGroups = buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table);
      return headerGroups;
    }, getMemoOptions(table.options, debug));
    table.getCenterHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
      leafColumns = leafColumns.filter((column) => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
      return buildHeaderGroups(allColumns, leafColumns, table, "center");
    }, getMemoOptions(table.options, debug));
    table.getLeftHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left], (allColumns, leafColumns, left) => {
      var _left$map$filter2;
      const orderedLeafColumns = (_left$map$filter2 = left == null ? void 0 : left.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter2 : [];
      return buildHeaderGroups(allColumns, orderedLeafColumns, table, "left");
    }, getMemoOptions(table.options, debug));
    table.getRightHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.right], (allColumns, leafColumns, right) => {
      var _right$map$filter2;
      const orderedLeafColumns = (_right$map$filter2 = right == null ? void 0 : right.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter2 : [];
      return buildHeaderGroups(allColumns, orderedLeafColumns, table, "right");
    }, getMemoOptions(table.options, debug));
    table.getFooterGroups = memo(() => [table.getHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getLeftFooterGroups = memo(() => [table.getLeftHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getCenterFooterGroups = memo(() => [table.getCenterHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getRightFooterGroups = memo(() => [table.getRightHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getFlatHeaders = memo(() => [table.getHeaderGroups()], (headerGroups) => {
      return headerGroups.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getLeftFlatHeaders = memo(() => [table.getLeftHeaderGroups()], (left) => {
      return left.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getCenterFlatHeaders = memo(() => [table.getCenterHeaderGroups()], (left) => {
      return left.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getRightFlatHeaders = memo(() => [table.getRightHeaderGroups()], (left) => {
      return left.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getCenterLeafHeaders = memo(() => [table.getCenterFlatHeaders()], (flatHeaders) => {
      return flatHeaders.filter((header) => {
        var _header$subHeaders;
        return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
      });
    }, getMemoOptions(table.options, debug));
    table.getLeftLeafHeaders = memo(() => [table.getLeftFlatHeaders()], (flatHeaders) => {
      return flatHeaders.filter((header) => {
        var _header$subHeaders2;
        return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
      });
    }, getMemoOptions(table.options, debug));
    table.getRightLeafHeaders = memo(() => [table.getRightFlatHeaders()], (flatHeaders) => {
      return flatHeaders.filter((header) => {
        var _header$subHeaders3;
        return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
      });
    }, getMemoOptions(table.options, debug));
    table.getLeafHeaders = memo(() => [table.getLeftHeaderGroups(), table.getCenterHeaderGroups(), table.getRightHeaderGroups()], (left, center, right) => {
      var _left$0$headers, _left$, _center$0$headers, _center$, _right$0$headers, _right$;
      return [...(_left$0$headers = (_left$ = left[0]) == null ? void 0 : _left$.headers) != null ? _left$0$headers : [], ...(_center$0$headers = (_center$ = center[0]) == null ? void 0 : _center$.headers) != null ? _center$0$headers : [], ...(_right$0$headers = (_right$ = right[0]) == null ? void 0 : _right$.headers) != null ? _right$0$headers : []].map((header) => {
        return header.getLeafHeaders();
      }).flat();
    }, getMemoOptions(table.options, debug));
  }
};
function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
  var _headerGroups$0$heade, _headerGroups$;
  let maxDepth = 0;
  const findMaxDepth = function(columns, depth) {
    if (depth === void 0) {
      depth = 1;
    }
    maxDepth = Math.max(maxDepth, depth);
    columns.filter((column) => column.getIsVisible()).forEach((column) => {
      var _column$columns;
      if ((_column$columns = column.columns) != null && _column$columns.length) {
        findMaxDepth(column.columns, depth + 1);
      }
    }, 0);
  };
  findMaxDepth(allColumns);
  let headerGroups = [];
  const createHeaderGroup = (headersToGroup, depth) => {
    const headerGroup = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join("_"),
      headers: []
    };
    const pendingParentHeaders = [];
    headersToGroup.forEach((headerToGroup) => {
      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0];
      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
      let column;
      let isPlaceholder = false;
      if (isLeafHeader && headerToGroup.column.parent) {
        column = headerToGroup.column.parent;
      } else {
        column = headerToGroup.column;
        isPlaceholder = true;
      }
      if (latestPendingParentHeader && (latestPendingParentHeader == null ? void 0 : latestPendingParentHeader.column) === column) {
        latestPendingParentHeader.subHeaders.push(headerToGroup);
      } else {
        const header = createHeader(table, column, {
          id: [headerFamily, depth, column.id, headerToGroup == null ? void 0 : headerToGroup.id].filter(Boolean).join("_"),
          isPlaceholder,
          placeholderId: isPlaceholder ? `${pendingParentHeaders.filter((d) => d.column === column).length}` : void 0,
          depth,
          index: pendingParentHeaders.length
        });
        header.subHeaders.push(headerToGroup);
        pendingParentHeaders.push(header);
      }
      headerGroup.headers.push(headerToGroup);
      headerToGroup.headerGroup = headerGroup;
    });
    headerGroups.push(headerGroup);
    if (depth > 0) {
      createHeaderGroup(pendingParentHeaders, depth - 1);
    }
  };
  const bottomHeaders = columnsToGroup.map((column, index) => createHeader(table, column, {
    depth: maxDepth,
    index
  }));
  createHeaderGroup(bottomHeaders, maxDepth - 1);
  headerGroups.reverse();
  const recurseHeadersForSpans = (headers) => {
    const filteredHeaders = headers.filter((header) => header.column.getIsVisible());
    return filteredHeaders.map((header) => {
      let colSpan = 0;
      let rowSpan = 0;
      let childRowSpans = [0];
      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = [];
        recurseHeadersForSpans(header.subHeaders).forEach((_ref) => {
          let {
            colSpan: childColSpan,
            rowSpan: childRowSpan
          } = _ref;
          colSpan += childColSpan;
          childRowSpans.push(childRowSpan);
        });
      } else {
        colSpan = 1;
      }
      const minChildRowSpan = Math.min(...childRowSpans);
      rowSpan = rowSpan + minChildRowSpan;
      header.colSpan = colSpan;
      header.rowSpan = rowSpan;
      return {
        colSpan,
        rowSpan
      };
    });
  };
  recurseHeadersForSpans((_headerGroups$0$heade = (_headerGroups$ = headerGroups[0]) == null ? void 0 : _headerGroups$.headers) != null ? _headerGroups$0$heade : []);
  return headerGroups;
}
const createRow = (table, id, original, rowIndex, depth, subRows, parentId) => {
  let row = {
    id,
    index: rowIndex,
    original,
    depth,
    parentId,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (columnId) => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.accessorFn)) {
        return void 0;
      }
      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex);
      return row._valuesCache[columnId];
    },
    getUniqueValues: (columnId) => {
      if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
        return row._uniqueValuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.accessorFn)) {
        return void 0;
      }
      if (!column.columnDef.getUniqueValues) {
        row._uniqueValuesCache[columnId] = [row.getValue(columnId)];
        return row._uniqueValuesCache[columnId];
      }
      row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(row.original, rowIndex);
      return row._uniqueValuesCache[columnId];
    },
    renderValue: (columnId) => {
      var _row$getValue;
      return (_row$getValue = row.getValue(columnId)) != null ? _row$getValue : table.options.renderFallbackValue;
    },
    subRows: [],
    getLeafRows: () => flattenBy(row.subRows, (d) => d.subRows),
    getParentRow: () => row.parentId ? table.getRow(row.parentId, true) : void 0,
    getParentRows: () => {
      let parentRows = [];
      let currentRow = row;
      while (true) {
        const parentRow = currentRow.getParentRow();
        if (!parentRow) break;
        parentRows.push(parentRow);
        currentRow = parentRow;
      }
      return parentRows.reverse();
    },
    getAllCells: memo(() => [table.getAllLeafColumns()], (leafColumns) => {
      return leafColumns.map((column) => {
        return createCell(table, row, column, column.id);
      });
    }, getMemoOptions(table.options, "debugRows")),
    _getAllCellsByColumnId: memo(() => [row.getAllCells()], (allCells) => {
      return allCells.reduce((acc, cell) => {
        acc[cell.column.id] = cell;
        return acc;
      }, {});
    }, getMemoOptions(table.options, "debugRows"))
  };
  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i];
    feature == null || feature.createRow == null || feature.createRow(row, table);
  }
  return row;
};
const ColumnFaceting = {
  createColumn: (column, table) => {
    column._getFacetedRowModel = table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, column.id);
    column.getFacetedRowModel = () => {
      if (!column._getFacetedRowModel) {
        return table.getPreFilteredRowModel();
      }
      return column._getFacetedRowModel();
    };
    column._getFacetedUniqueValues = table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, column.id);
    column.getFacetedUniqueValues = () => {
      if (!column._getFacetedUniqueValues) {
        return /* @__PURE__ */ new Map();
      }
      return column._getFacetedUniqueValues();
    };
    column._getFacetedMinMaxValues = table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, column.id);
    column.getFacetedMinMaxValues = () => {
      if (!column._getFacetedMinMaxValues) {
        return void 0;
      }
      return column._getFacetedMinMaxValues();
    };
  }
};
const includesString = (row, columnId, filterValue) => {
  var _filterValue$toString, _row$getValue;
  const search = filterValue == null || (_filterValue$toString = filterValue.toString()) == null ? void 0 : _filterValue$toString.toLowerCase();
  return Boolean((_row$getValue = row.getValue(columnId)) == null || (_row$getValue = _row$getValue.toString()) == null || (_row$getValue = _row$getValue.toLowerCase()) == null ? void 0 : _row$getValue.includes(search));
};
includesString.autoRemove = (val) => testFalsey(val);
const includesStringSensitive = (row, columnId, filterValue) => {
  var _row$getValue2;
  return Boolean((_row$getValue2 = row.getValue(columnId)) == null || (_row$getValue2 = _row$getValue2.toString()) == null ? void 0 : _row$getValue2.includes(filterValue));
};
includesStringSensitive.autoRemove = (val) => testFalsey(val);
const equalsString = (row, columnId, filterValue) => {
  var _row$getValue3;
  return ((_row$getValue3 = row.getValue(columnId)) == null || (_row$getValue3 = _row$getValue3.toString()) == null ? void 0 : _row$getValue3.toLowerCase()) === (filterValue == null ? void 0 : filterValue.toLowerCase());
};
equalsString.autoRemove = (val) => testFalsey(val);
const arrIncludes = (row, columnId, filterValue) => {
  var _row$getValue4;
  return (_row$getValue4 = row.getValue(columnId)) == null ? void 0 : _row$getValue4.includes(filterValue);
};
arrIncludes.autoRemove = (val) => testFalsey(val);
const arrIncludesAll = (row, columnId, filterValue) => {
  return !filterValue.some((val) => {
    var _row$getValue5;
    return !((_row$getValue5 = row.getValue(columnId)) != null && _row$getValue5.includes(val));
  });
};
arrIncludesAll.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const arrIncludesSome = (row, columnId, filterValue) => {
  return filterValue.some((val) => {
    var _row$getValue6;
    return (_row$getValue6 = row.getValue(columnId)) == null ? void 0 : _row$getValue6.includes(val);
  });
};
arrIncludesSome.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const equals = (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
};
equals.autoRemove = (val) => testFalsey(val);
const weakEquals = (row, columnId, filterValue) => {
  return row.getValue(columnId) == filterValue;
};
weakEquals.autoRemove = (val) => testFalsey(val);
const inNumberRange = (row, columnId, filterValue) => {
  let [min2, max2] = filterValue;
  const rowValue = row.getValue(columnId);
  return rowValue >= min2 && rowValue <= max2;
};
inNumberRange.resolveFilterValue = (val) => {
  let [unsafeMin, unsafeMax] = val;
  let parsedMin = typeof unsafeMin !== "number" ? parseFloat(unsafeMin) : unsafeMin;
  let parsedMax = typeof unsafeMax !== "number" ? parseFloat(unsafeMax) : unsafeMax;
  let min2 = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  let max2 = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;
  if (min2 > max2) {
    const temp = min2;
    min2 = max2;
    max2 = temp;
  }
  return [min2, max2];
};
inNumberRange.autoRemove = (val) => testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]);
const filterFns = {
  includesString,
  includesStringSensitive,
  equalsString,
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  weakEquals,
  inNumberRange
};
function testFalsey(val) {
  return val === void 0 || val === null || val === "";
}
const ColumnFiltering = {
  getDefaultColumnDef: () => {
    return {
      filterFn: "auto"
    };
  },
  getInitialState: (state) => {
    return {
      columnFilters: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnFiltersChange: makeStateUpdater("columnFilters", table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100
    };
  },
  createColumn: (column, table) => {
    column.getAutoFilterFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0];
      const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
      if (typeof value === "string") {
        return filterFns.includesString;
      }
      if (typeof value === "number") {
        return filterFns.inNumberRange;
      }
      if (typeof value === "boolean") {
        return filterFns.equals;
      }
      if (value !== null && typeof value === "object") {
        return filterFns.equals;
      }
      if (Array.isArray(value)) {
        return filterFns.arrIncludes;
      }
      return filterFns.weakEquals;
    };
    column.getFilterFn = () => {
      var _table$options$filter, _table$options$filter2;
      return isFunction(column.columnDef.filterFn) ? column.columnDef.filterFn : column.columnDef.filterFn === "auto" ? column.getAutoFilterFn() : (
        // @ts-ignore
        (_table$options$filter = (_table$options$filter2 = table.options.filterFns) == null ? void 0 : _table$options$filter2[column.columnDef.filterFn]) != null ? _table$options$filter : filterFns[column.columnDef.filterFn]
      );
    };
    column.getCanFilter = () => {
      var _column$columnDef$ena, _table$options$enable, _table$options$enable2;
      return ((_column$columnDef$ena = column.columnDef.enableColumnFilter) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableColumnFilters) != null ? _table$options$enable : true) && ((_table$options$enable2 = table.options.enableFilters) != null ? _table$options$enable2 : true) && !!column.accessorFn;
    };
    column.getIsFiltered = () => column.getFilterIndex() > -1;
    column.getFilterValue = () => {
      var _table$getState$colum;
      return (_table$getState$colum = table.getState().columnFilters) == null || (_table$getState$colum = _table$getState$colum.find((d) => d.id === column.id)) == null ? void 0 : _table$getState$colum.value;
    };
    column.getFilterIndex = () => {
      var _table$getState$colum2, _table$getState$colum3;
      return (_table$getState$colum2 = (_table$getState$colum3 = table.getState().columnFilters) == null ? void 0 : _table$getState$colum3.findIndex((d) => d.id === column.id)) != null ? _table$getState$colum2 : -1;
    };
    column.setFilterValue = (value) => {
      table.setColumnFilters((old) => {
        const filterFn = column.getFilterFn();
        const previousFilter = old == null ? void 0 : old.find((d) => d.id === column.id);
        const newFilter = functionalUpdate(value, previousFilter ? previousFilter.value : void 0);
        if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
          var _old$filter;
          return (_old$filter = old == null ? void 0 : old.filter((d) => d.id !== column.id)) != null ? _old$filter : [];
        }
        const newFilterObj = {
          id: column.id,
          value: newFilter
        };
        if (previousFilter) {
          var _old$map;
          return (_old$map = old == null ? void 0 : old.map((d) => {
            if (d.id === column.id) {
              return newFilterObj;
            }
            return d;
          })) != null ? _old$map : [];
        }
        if (old != null && old.length) {
          return [...old, newFilterObj];
        }
        return [newFilterObj];
      });
    };
  },
  createRow: (row, _table) => {
    row.columnFilters = {};
    row.columnFiltersMeta = {};
  },
  createTable: (table) => {
    table.setColumnFilters = (updater) => {
      const leafColumns = table.getAllLeafColumns();
      const updateFn = (old) => {
        var _functionalUpdate;
        return (_functionalUpdate = functionalUpdate(updater, old)) == null ? void 0 : _functionalUpdate.filter((filter) => {
          const column = leafColumns.find((d) => d.id === filter.id);
          if (column) {
            const filterFn = column.getFilterFn();
            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
              return false;
            }
          }
          return true;
        });
      };
      table.options.onColumnFiltersChange == null || table.options.onColumnFiltersChange(updateFn);
    };
    table.resetColumnFilters = (defaultState) => {
      var _table$initialState$c, _table$initialState;
      table.setColumnFilters(defaultState ? [] : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnFilters) != null ? _table$initialState$c : []);
    };
    table.getPreFilteredRowModel = () => table.getCoreRowModel();
    table.getFilteredRowModel = () => {
      if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
        table._getFilteredRowModel = table.options.getFilteredRowModel(table);
      }
      if (table.options.manualFiltering || !table._getFilteredRowModel) {
        return table.getPreFilteredRowModel();
      }
      return table._getFilteredRowModel();
    };
  }
};
function shouldAutoRemoveFilter(filterFn, value, column) {
  return (filterFn && filterFn.autoRemove ? filterFn.autoRemove(value, column) : false) || typeof value === "undefined" || typeof value === "string" && !value;
}
const sum = (columnId, _leafRows, childRows) => {
  return childRows.reduce((sum2, next) => {
    const nextValue = next.getValue(columnId);
    return sum2 + (typeof nextValue === "number" ? nextValue : 0);
  }, 0);
};
const min = (columnId, _leafRows, childRows) => {
  let min2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null && (min2 > value || min2 === void 0 && value >= value)) {
      min2 = value;
    }
  });
  return min2;
};
const max = (columnId, _leafRows, childRows) => {
  let max2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null && (max2 < value || max2 === void 0 && value >= value)) {
      max2 = value;
    }
  });
  return max2;
};
const extent = (columnId, _leafRows, childRows) => {
  let min2;
  let max2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null) {
      if (min2 === void 0) {
        if (value >= value) min2 = max2 = value;
      } else {
        if (min2 > value) min2 = value;
        if (max2 < value) max2 = value;
      }
    }
  });
  return [min2, max2];
};
const mean = (columnId, leafRows) => {
  let count2 = 0;
  let sum2 = 0;
  leafRows.forEach((row) => {
    let value = row.getValue(columnId);
    if (value != null && (value = +value) >= value) {
      ++count2, sum2 += value;
    }
  });
  if (count2) return sum2 / count2;
  return;
};
const median = (columnId, leafRows) => {
  if (!leafRows.length) {
    return;
  }
  const values = leafRows.map((row) => row.getValue(columnId));
  if (!isNumberArray(values)) {
    return;
  }
  if (values.length === 1) {
    return values[0];
  }
  const mid = Math.floor(values.length / 2);
  const nums = values.sort((a, b) => a - b);
  return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
const unique = (columnId, leafRows) => {
  return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))).values());
};
const uniqueCount = (columnId, leafRows) => {
  return new Set(leafRows.map((d) => d.getValue(columnId))).size;
};
const count = (_columnId, leafRows) => {
  return leafRows.length;
};
const aggregationFns = {
  sum,
  min,
  max,
  extent,
  mean,
  median,
  unique,
  uniqueCount,
  count
};
const ColumnGrouping = {
  getDefaultColumnDef: () => {
    return {
      aggregatedCell: (props) => {
        var _toString, _props$getValue;
        return (_toString = (_props$getValue = props.getValue()) == null || _props$getValue.toString == null ? void 0 : _props$getValue.toString()) != null ? _toString : null;
      },
      aggregationFn: "auto"
    };
  },
  getInitialState: (state) => {
    return {
      grouping: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onGroupingChange: makeStateUpdater("grouping", table),
      groupedColumnMode: "reorder"
    };
  },
  createColumn: (column, table) => {
    column.toggleGrouping = () => {
      table.setGrouping((old) => {
        if (old != null && old.includes(column.id)) {
          return old.filter((d) => d !== column.id);
        }
        return [...old != null ? old : [], column.id];
      });
    };
    column.getCanGroup = () => {
      var _column$columnDef$ena, _table$options$enable;
      return ((_column$columnDef$ena = column.columnDef.enableGrouping) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableGrouping) != null ? _table$options$enable : true) && (!!column.accessorFn || !!column.columnDef.getGroupingValue);
    };
    column.getIsGrouped = () => {
      var _table$getState$group;
      return (_table$getState$group = table.getState().grouping) == null ? void 0 : _table$getState$group.includes(column.id);
    };
    column.getGroupedIndex = () => {
      var _table$getState$group2;
      return (_table$getState$group2 = table.getState().grouping) == null ? void 0 : _table$getState$group2.indexOf(column.id);
    };
    column.getToggleGroupingHandler = () => {
      const canGroup = column.getCanGroup();
      return () => {
        if (!canGroup) return;
        column.toggleGrouping();
      };
    };
    column.getAutoAggregationFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0];
      const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
      if (typeof value === "number") {
        return aggregationFns.sum;
      }
      if (Object.prototype.toString.call(value) === "[object Date]") {
        return aggregationFns.extent;
      }
    };
    column.getAggregationFn = () => {
      var _table$options$aggreg, _table$options$aggreg2;
      if (!column) {
        throw new Error();
      }
      return isFunction(column.columnDef.aggregationFn) ? column.columnDef.aggregationFn : column.columnDef.aggregationFn === "auto" ? column.getAutoAggregationFn() : (_table$options$aggreg = (_table$options$aggreg2 = table.options.aggregationFns) == null ? void 0 : _table$options$aggreg2[column.columnDef.aggregationFn]) != null ? _table$options$aggreg : aggregationFns[column.columnDef.aggregationFn];
    };
  },
  createTable: (table) => {
    table.setGrouping = (updater) => table.options.onGroupingChange == null ? void 0 : table.options.onGroupingChange(updater);
    table.resetGrouping = (defaultState) => {
      var _table$initialState$g, _table$initialState;
      table.setGrouping(defaultState ? [] : (_table$initialState$g = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.grouping) != null ? _table$initialState$g : []);
    };
    table.getPreGroupedRowModel = () => table.getFilteredRowModel();
    table.getGroupedRowModel = () => {
      if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
        table._getGroupedRowModel = table.options.getGroupedRowModel(table);
      }
      if (table.options.manualGrouping || !table._getGroupedRowModel) {
        return table.getPreGroupedRowModel();
      }
      return table._getGroupedRowModel();
    };
  },
  createRow: (row, table) => {
    row.getIsGrouped = () => !!row.groupingColumnId;
    row.getGroupingValue = (columnId) => {
      if (row._groupingValuesCache.hasOwnProperty(columnId)) {
        return row._groupingValuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.columnDef.getGroupingValue)) {
        return row.getValue(columnId);
      }
      row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(row.original);
      return row._groupingValuesCache[columnId];
    };
    row._groupingValuesCache = {};
  },
  createCell: (cell, column, row, table) => {
    cell.getIsGrouped = () => column.getIsGrouped() && column.id === row.groupingColumnId;
    cell.getIsPlaceholder = () => !cell.getIsGrouped() && column.getIsGrouped();
    cell.getIsAggregated = () => {
      var _row$subRows;
      return !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
    };
  }
};
function orderColumns(leafColumns, grouping, groupedColumnMode) {
  if (!(grouping != null && grouping.length) || !groupedColumnMode) {
    return leafColumns;
  }
  const nonGroupingColumns = leafColumns.filter((col) => !grouping.includes(col.id));
  if (groupedColumnMode === "remove") {
    return nonGroupingColumns;
  }
  const groupingColumns = grouping.map((g) => leafColumns.find((col) => col.id === g)).filter(Boolean);
  return [...groupingColumns, ...nonGroupingColumns];
}
const ColumnOrdering = {
  getInitialState: (state) => {
    return {
      columnOrder: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnOrderChange: makeStateUpdater("columnOrder", table)
    };
  },
  createColumn: (column, table) => {
    column.getIndex = memo((position) => [_getVisibleLeafColumns(table, position)], (columns) => columns.findIndex((d) => d.id === column.id), getMemoOptions(table.options, "debugColumns"));
    column.getIsFirstColumn = (position) => {
      var _columns$;
      const columns = _getVisibleLeafColumns(table, position);
      return ((_columns$ = columns[0]) == null ? void 0 : _columns$.id) === column.id;
    };
    column.getIsLastColumn = (position) => {
      var _columns;
      const columns = _getVisibleLeafColumns(table, position);
      return ((_columns = columns[columns.length - 1]) == null ? void 0 : _columns.id) === column.id;
    };
  },
  createTable: (table) => {
    table.setColumnOrder = (updater) => table.options.onColumnOrderChange == null ? void 0 : table.options.onColumnOrderChange(updater);
    table.resetColumnOrder = (defaultState) => {
      var _table$initialState$c;
      table.setColumnOrder(defaultState ? [] : (_table$initialState$c = table.initialState.columnOrder) != null ? _table$initialState$c : []);
    };
    table._getOrderColumnsFn = memo(() => [table.getState().columnOrder, table.getState().grouping, table.options.groupedColumnMode], (columnOrder, grouping, groupedColumnMode) => (columns) => {
      let orderedColumns = [];
      if (!(columnOrder != null && columnOrder.length)) {
        orderedColumns = columns;
      } else {
        const columnOrderCopy = [...columnOrder];
        const columnsCopy = [...columns];
        while (columnsCopy.length && columnOrderCopy.length) {
          const targetColumnId = columnOrderCopy.shift();
          const foundIndex = columnsCopy.findIndex((d) => d.id === targetColumnId);
          if (foundIndex > -1) {
            orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
          }
        }
        orderedColumns = [...orderedColumns, ...columnsCopy];
      }
      return orderColumns(orderedColumns, grouping, groupedColumnMode);
    }, getMemoOptions(table.options, "debugTable"));
  }
};
const getDefaultColumnPinningState = () => ({
  left: [],
  right: []
});
const ColumnPinning = {
  getInitialState: (state) => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnPinningChange: makeStateUpdater("columnPinning", table)
    };
  },
  createColumn: (column, table) => {
    column.pin = (position) => {
      const columnIds = column.getLeafColumns().map((d) => d.id).filter(Boolean);
      table.setColumnPinning((old) => {
        var _old$left3, _old$right3;
        if (position === "right") {
          var _old$left, _old$right;
          return {
            left: ((_old$left = old == null ? void 0 : old.left) != null ? _old$left : []).filter((d) => !(columnIds != null && columnIds.includes(d))),
            right: [...((_old$right = old == null ? void 0 : old.right) != null ? _old$right : []).filter((d) => !(columnIds != null && columnIds.includes(d))), ...columnIds]
          };
        }
        if (position === "left") {
          var _old$left2, _old$right2;
          return {
            left: [...((_old$left2 = old == null ? void 0 : old.left) != null ? _old$left2 : []).filter((d) => !(columnIds != null && columnIds.includes(d))), ...columnIds],
            right: ((_old$right2 = old == null ? void 0 : old.right) != null ? _old$right2 : []).filter((d) => !(columnIds != null && columnIds.includes(d)))
          };
        }
        return {
          left: ((_old$left3 = old == null ? void 0 : old.left) != null ? _old$left3 : []).filter((d) => !(columnIds != null && columnIds.includes(d))),
          right: ((_old$right3 = old == null ? void 0 : old.right) != null ? _old$right3 : []).filter((d) => !(columnIds != null && columnIds.includes(d)))
        };
      });
    };
    column.getCanPin = () => {
      const leafColumns = column.getLeafColumns();
      return leafColumns.some((d) => {
        var _d$columnDef$enablePi, _ref, _table$options$enable;
        return ((_d$columnDef$enablePi = d.columnDef.enablePinning) != null ? _d$columnDef$enablePi : true) && ((_ref = (_table$options$enable = table.options.enableColumnPinning) != null ? _table$options$enable : table.options.enablePinning) != null ? _ref : true);
      });
    };
    column.getIsPinned = () => {
      const leafColumnIds = column.getLeafColumns().map((d) => d.id);
      const {
        left,
        right
      } = table.getState().columnPinning;
      const isLeft = leafColumnIds.some((d) => left == null ? void 0 : left.includes(d));
      const isRight = leafColumnIds.some((d) => right == null ? void 0 : right.includes(d));
      return isLeft ? "left" : isRight ? "right" : false;
    };
    column.getPinnedIndex = () => {
      var _table$getState$colum, _table$getState$colum2;
      const position = column.getIsPinned();
      return position ? (_table$getState$colum = (_table$getState$colum2 = table.getState().columnPinning) == null || (_table$getState$colum2 = _table$getState$colum2[position]) == null ? void 0 : _table$getState$colum2.indexOf(column.id)) != null ? _table$getState$colum : -1 : 0;
    };
  },
  createRow: (row, table) => {
    row.getCenterVisibleCells = memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allCells, left, right) => {
      const leftAndRight = [...left != null ? left : [], ...right != null ? right : []];
      return allCells.filter((d) => !leftAndRight.includes(d.column.id));
    }, getMemoOptions(table.options, "debugRows"));
    row.getLeftVisibleCells = memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left], (allCells, left) => {
      const cells = (left != null ? left : []).map((columnId) => allCells.find((cell) => cell.column.id === columnId)).filter(Boolean).map((d) => ({
        ...d,
        position: "left"
      }));
      return cells;
    }, getMemoOptions(table.options, "debugRows"));
    row.getRightVisibleCells = memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.right], (allCells, right) => {
      const cells = (right != null ? right : []).map((columnId) => allCells.find((cell) => cell.column.id === columnId)).filter(Boolean).map((d) => ({
        ...d,
        position: "right"
      }));
      return cells;
    }, getMemoOptions(table.options, "debugRows"));
  },
  createTable: (table) => {
    table.setColumnPinning = (updater) => table.options.onColumnPinningChange == null ? void 0 : table.options.onColumnPinningChange(updater);
    table.resetColumnPinning = (defaultState) => {
      var _table$initialState$c, _table$initialState;
      return table.setColumnPinning(defaultState ? getDefaultColumnPinningState() : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnPinning) != null ? _table$initialState$c : getDefaultColumnPinningState());
    };
    table.getIsSomeColumnsPinned = (position) => {
      var _pinningState$positio;
      const pinningState = table.getState().columnPinning;
      if (!position) {
        var _pinningState$left, _pinningState$right;
        return Boolean(((_pinningState$left = pinningState.left) == null ? void 0 : _pinningState$left.length) || ((_pinningState$right = pinningState.right) == null ? void 0 : _pinningState$right.length));
      }
      return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
    };
    table.getLeftLeafColumns = memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left], (allColumns, left) => {
      return (left != null ? left : []).map((columnId) => allColumns.find((column) => column.id === columnId)).filter(Boolean);
    }, getMemoOptions(table.options, "debugColumns"));
    table.getRightLeafColumns = memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.right], (allColumns, right) => {
      return (right != null ? right : []).map((columnId) => allColumns.find((column) => column.id === columnId)).filter(Boolean);
    }, getMemoOptions(table.options, "debugColumns"));
    table.getCenterLeafColumns = memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, left, right) => {
      const leftAndRight = [...left != null ? left : [], ...right != null ? right : []];
      return allColumns.filter((d) => !leftAndRight.includes(d.id));
    }, getMemoOptions(table.options, "debugColumns"));
  }
};
function safelyAccessDocument(_document) {
  return _document || null;
}
const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
};
const getDefaultColumnSizingInfoState = () => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: []
});
const ColumnSizing = {
  getDefaultColumnDef: () => {
    return defaultColumnSizing;
  },
  getInitialState: (state) => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      columnResizeMode: "onEnd",
      columnResizeDirection: "ltr",
      onColumnSizingChange: makeStateUpdater("columnSizing", table),
      onColumnSizingInfoChange: makeStateUpdater("columnSizingInfo", table)
    };
  },
  createColumn: (column, table) => {
    column.getSize = () => {
      var _column$columnDef$min, _ref, _column$columnDef$max;
      const columnSize = table.getState().columnSizing[column.id];
      return Math.min(Math.max((_column$columnDef$min = column.columnDef.minSize) != null ? _column$columnDef$min : defaultColumnSizing.minSize, (_ref = columnSize != null ? columnSize : column.columnDef.size) != null ? _ref : defaultColumnSizing.size), (_column$columnDef$max = column.columnDef.maxSize) != null ? _column$columnDef$max : defaultColumnSizing.maxSize);
    };
    column.getStart = memo((position) => [position, _getVisibleLeafColumns(table, position), table.getState().columnSizing], (position, columns) => columns.slice(0, column.getIndex(position)).reduce((sum2, column2) => sum2 + column2.getSize(), 0), getMemoOptions(table.options, "debugColumns"));
    column.getAfter = memo((position) => [position, _getVisibleLeafColumns(table, position), table.getState().columnSizing], (position, columns) => columns.slice(column.getIndex(position) + 1).reduce((sum2, column2) => sum2 + column2.getSize(), 0), getMemoOptions(table.options, "debugColumns"));
    column.resetSize = () => {
      table.setColumnSizing((_ref2) => {
        let {
          [column.id]: _,
          ...rest
        } = _ref2;
        return rest;
      });
    };
    column.getCanResize = () => {
      var _column$columnDef$ena, _table$options$enable;
      return ((_column$columnDef$ena = column.columnDef.enableResizing) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableColumnResizing) != null ? _table$options$enable : true);
    };
    column.getIsResizing = () => {
      return table.getState().columnSizingInfo.isResizingColumn === column.id;
    };
  },
  createHeader: (header, table) => {
    header.getSize = () => {
      let sum2 = 0;
      const recurse = (header2) => {
        if (header2.subHeaders.length) {
          header2.subHeaders.forEach(recurse);
        } else {
          var _header$column$getSiz;
          sum2 += (_header$column$getSiz = header2.column.getSize()) != null ? _header$column$getSiz : 0;
        }
      };
      recurse(header);
      return sum2;
    };
    header.getStart = () => {
      if (header.index > 0) {
        const prevSiblingHeader = header.headerGroup.headers[header.index - 1];
        return prevSiblingHeader.getStart() + prevSiblingHeader.getSize();
      }
      return 0;
    };
    header.getResizeHandler = (_contextDocument) => {
      const column = table.getColumn(header.column.id);
      const canResize = column == null ? void 0 : column.getCanResize();
      return (e) => {
        if (!column || !canResize) {
          return;
        }
        e.persist == null || e.persist();
        if (isTouchStartEvent(e)) {
          if (e.touches && e.touches.length > 1) {
            return;
          }
        }
        const startSize = header.getSize();
        const columnSizingStart = header ? header.getLeafHeaders().map((d) => [d.column.id, d.column.getSize()]) : [[column.id, column.getSize()]];
        const clientX = isTouchStartEvent(e) ? Math.round(e.touches[0].clientX) : e.clientX;
        const newColumnSizing = {};
        const updateOffset = (eventType, clientXPos) => {
          if (typeof clientXPos !== "number") {
            return;
          }
          table.setColumnSizingInfo((old) => {
            var _old$startOffset, _old$startSize;
            const deltaDirection = table.options.columnResizeDirection === "rtl" ? -1 : 1;
            const deltaOffset = (clientXPos - ((_old$startOffset = old == null ? void 0 : old.startOffset) != null ? _old$startOffset : 0)) * deltaDirection;
            const deltaPercentage = Math.max(deltaOffset / ((_old$startSize = old == null ? void 0 : old.startSize) != null ? _old$startSize : 0), -0.999999);
            old.columnSizingStart.forEach((_ref3) => {
              let [columnId, headerSize] = _ref3;
              newColumnSizing[columnId] = Math.round(Math.max(headerSize + headerSize * deltaPercentage, 0) * 100) / 100;
            });
            return {
              ...old,
              deltaOffset,
              deltaPercentage
            };
          });
          if (table.options.columnResizeMode === "onChange" || eventType === "end") {
            table.setColumnSizing((old) => ({
              ...old,
              ...newColumnSizing
            }));
          }
        };
        const onMove = (clientXPos) => updateOffset("move", clientXPos);
        const onEnd = (clientXPos) => {
          updateOffset("end", clientXPos);
          table.setColumnSizingInfo((old) => ({
            ...old,
            isResizingColumn: false,
            startOffset: null,
            startSize: null,
            deltaOffset: null,
            deltaPercentage: null,
            columnSizingStart: []
          }));
        };
        const contextDocument = safelyAccessDocument(_contextDocument);
        const mouseEvents = {
          moveHandler: (e2) => onMove(e2.clientX),
          upHandler: (e2) => {
            contextDocument == null || contextDocument.removeEventListener("mousemove", mouseEvents.moveHandler);
            contextDocument == null || contextDocument.removeEventListener("mouseup", mouseEvents.upHandler);
            onEnd(e2.clientX);
          }
        };
        const touchEvents = {
          moveHandler: (e2) => {
            if (e2.cancelable) {
              e2.preventDefault();
              e2.stopPropagation();
            }
            onMove(e2.touches[0].clientX);
            return false;
          },
          upHandler: (e2) => {
            var _e$touches$;
            contextDocument == null || contextDocument.removeEventListener("touchmove", touchEvents.moveHandler);
            contextDocument == null || contextDocument.removeEventListener("touchend", touchEvents.upHandler);
            if (e2.cancelable) {
              e2.preventDefault();
              e2.stopPropagation();
            }
            onEnd((_e$touches$ = e2.touches[0]) == null ? void 0 : _e$touches$.clientX);
          }
        };
        const passiveIfSupported = passiveEventSupported() ? {
          passive: false
        } : false;
        if (isTouchStartEvent(e)) {
          contextDocument == null || contextDocument.addEventListener("touchmove", touchEvents.moveHandler, passiveIfSupported);
          contextDocument == null || contextDocument.addEventListener("touchend", touchEvents.upHandler, passiveIfSupported);
        } else {
          contextDocument == null || contextDocument.addEventListener("mousemove", mouseEvents.moveHandler, passiveIfSupported);
          contextDocument == null || contextDocument.addEventListener("mouseup", mouseEvents.upHandler, passiveIfSupported);
        }
        table.setColumnSizingInfo((old) => ({
          ...old,
          startOffset: clientX,
          startSize,
          deltaOffset: 0,
          deltaPercentage: 0,
          columnSizingStart,
          isResizingColumn: column.id
        }));
      };
    };
  },
  createTable: (table) => {
    table.setColumnSizing = (updater) => table.options.onColumnSizingChange == null ? void 0 : table.options.onColumnSizingChange(updater);
    table.setColumnSizingInfo = (updater) => table.options.onColumnSizingInfoChange == null ? void 0 : table.options.onColumnSizingInfoChange(updater);
    table.resetColumnSizing = (defaultState) => {
      var _table$initialState$c;
      table.setColumnSizing(defaultState ? {} : (_table$initialState$c = table.initialState.columnSizing) != null ? _table$initialState$c : {});
    };
    table.resetHeaderSizeInfo = (defaultState) => {
      var _table$initialState$c2;
      table.setColumnSizingInfo(defaultState ? getDefaultColumnSizingInfoState() : (_table$initialState$c2 = table.initialState.columnSizingInfo) != null ? _table$initialState$c2 : getDefaultColumnSizingInfoState());
    };
    table.getTotalSize = () => {
      var _table$getHeaderGroup, _table$getHeaderGroup2;
      return (_table$getHeaderGroup = (_table$getHeaderGroup2 = table.getHeaderGroups()[0]) == null ? void 0 : _table$getHeaderGroup2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getHeaderGroup : 0;
    };
    table.getLeftTotalSize = () => {
      var _table$getLeftHeaderG, _table$getLeftHeaderG2;
      return (_table$getLeftHeaderG = (_table$getLeftHeaderG2 = table.getLeftHeaderGroups()[0]) == null ? void 0 : _table$getLeftHeaderG2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getLeftHeaderG : 0;
    };
    table.getCenterTotalSize = () => {
      var _table$getCenterHeade, _table$getCenterHeade2;
      return (_table$getCenterHeade = (_table$getCenterHeade2 = table.getCenterHeaderGroups()[0]) == null ? void 0 : _table$getCenterHeade2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getCenterHeade : 0;
    };
    table.getRightTotalSize = () => {
      var _table$getRightHeader, _table$getRightHeader2;
      return (_table$getRightHeader = (_table$getRightHeader2 = table.getRightHeaderGroups()[0]) == null ? void 0 : _table$getRightHeader2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getRightHeader : 0;
    };
  }
};
let passiveSupported = null;
function passiveEventSupported() {
  if (typeof passiveSupported === "boolean") return passiveSupported;
  let supported = false;
  try {
    const options = {
      get passive() {
        supported = true;
        return false;
      }
    };
    const noop2 = () => {
    };
    (void 0).addEventListener("test", noop2, options);
    (void 0).removeEventListener("test", noop2);
  } catch (err) {
    supported = false;
  }
  passiveSupported = supported;
  return passiveSupported;
}
function isTouchStartEvent(e) {
  return e.type === "touchstart";
}
const ColumnVisibility = {
  getInitialState: (state) => {
    return {
      columnVisibility: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnVisibilityChange: makeStateUpdater("columnVisibility", table)
    };
  },
  createColumn: (column, table) => {
    column.toggleVisibility = (value) => {
      if (column.getCanHide()) {
        table.setColumnVisibility((old) => ({
          ...old,
          [column.id]: value != null ? value : !column.getIsVisible()
        }));
      }
    };
    column.getIsVisible = () => {
      var _ref, _table$getState$colum;
      const childColumns = column.columns;
      return (_ref = childColumns.length ? childColumns.some((c) => c.getIsVisible()) : (_table$getState$colum = table.getState().columnVisibility) == null ? void 0 : _table$getState$colum[column.id]) != null ? _ref : true;
    };
    column.getCanHide = () => {
      var _column$columnDef$ena, _table$options$enable;
      return ((_column$columnDef$ena = column.columnDef.enableHiding) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableHiding) != null ? _table$options$enable : true);
    };
    column.getToggleVisibilityHandler = () => {
      return (e) => {
        column.toggleVisibility == null || column.toggleVisibility(e.target.checked);
      };
    };
  },
  createRow: (row, table) => {
    row._getAllVisibleCells = memo(() => [row.getAllCells(), table.getState().columnVisibility], (cells) => {
      return cells.filter((cell) => cell.column.getIsVisible());
    }, getMemoOptions(table.options, "debugRows"));
    row.getVisibleCells = memo(() => [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()], (left, center, right) => [...left, ...center, ...right], getMemoOptions(table.options, "debugRows"));
  },
  createTable: (table) => {
    const makeVisibleColumnsMethod = (key, getColumns) => {
      return memo(() => [getColumns(), getColumns().filter((d) => d.getIsVisible()).map((d) => d.id).join("_")], (columns) => {
        return columns.filter((d) => d.getIsVisible == null ? void 0 : d.getIsVisible());
      }, getMemoOptions(table.options, "debugColumns"));
    };
    table.getVisibleFlatColumns = makeVisibleColumnsMethod("getVisibleFlatColumns", () => table.getAllFlatColumns());
    table.getVisibleLeafColumns = makeVisibleColumnsMethod("getVisibleLeafColumns", () => table.getAllLeafColumns());
    table.getLeftVisibleLeafColumns = makeVisibleColumnsMethod("getLeftVisibleLeafColumns", () => table.getLeftLeafColumns());
    table.getRightVisibleLeafColumns = makeVisibleColumnsMethod("getRightVisibleLeafColumns", () => table.getRightLeafColumns());
    table.getCenterVisibleLeafColumns = makeVisibleColumnsMethod("getCenterVisibleLeafColumns", () => table.getCenterLeafColumns());
    table.setColumnVisibility = (updater) => table.options.onColumnVisibilityChange == null ? void 0 : table.options.onColumnVisibilityChange(updater);
    table.resetColumnVisibility = (defaultState) => {
      var _table$initialState$c;
      table.setColumnVisibility(defaultState ? {} : (_table$initialState$c = table.initialState.columnVisibility) != null ? _table$initialState$c : {});
    };
    table.toggleAllColumnsVisible = (value) => {
      var _value;
      value = (_value = value) != null ? _value : !table.getIsAllColumnsVisible();
      table.setColumnVisibility(table.getAllLeafColumns().reduce((obj, column) => ({
        ...obj,
        [column.id]: !value ? !(column.getCanHide != null && column.getCanHide()) : value
      }), {}));
    };
    table.getIsAllColumnsVisible = () => !table.getAllLeafColumns().some((column) => !(column.getIsVisible != null && column.getIsVisible()));
    table.getIsSomeColumnsVisible = () => table.getAllLeafColumns().some((column) => column.getIsVisible == null ? void 0 : column.getIsVisible());
    table.getToggleAllColumnsVisibilityHandler = () => {
      return (e) => {
        var _target;
        table.toggleAllColumnsVisible((_target = e.target) == null ? void 0 : _target.checked);
      };
    };
  }
};
function _getVisibleLeafColumns(table, position) {
  return !position ? table.getVisibleLeafColumns() : position === "center" ? table.getCenterVisibleLeafColumns() : position === "left" ? table.getLeftVisibleLeafColumns() : table.getRightVisibleLeafColumns();
}
const GlobalFaceting = {
  createTable: (table) => {
    table._getGlobalFacetedRowModel = table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, "__global__");
    table.getGlobalFacetedRowModel = () => {
      if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
        return table.getPreFilteredRowModel();
      }
      return table._getGlobalFacetedRowModel();
    };
    table._getGlobalFacetedUniqueValues = table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, "__global__");
    table.getGlobalFacetedUniqueValues = () => {
      if (!table._getGlobalFacetedUniqueValues) {
        return /* @__PURE__ */ new Map();
      }
      return table._getGlobalFacetedUniqueValues();
    };
    table._getGlobalFacetedMinMaxValues = table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, "__global__");
    table.getGlobalFacetedMinMaxValues = () => {
      if (!table._getGlobalFacetedMinMaxValues) {
        return;
      }
      return table._getGlobalFacetedMinMaxValues();
    };
  }
};
const GlobalFiltering = {
  getInitialState: (state) => {
    return {
      globalFilter: void 0,
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onGlobalFilterChange: makeStateUpdater("globalFilter", table),
      globalFilterFn: "auto",
      getColumnCanGlobalFilter: (column) => {
        var _table$getCoreRowMode;
        const value = (_table$getCoreRowMode = table.getCoreRowModel().flatRows[0]) == null || (_table$getCoreRowMode = _table$getCoreRowMode._getAllCellsByColumnId()[column.id]) == null ? void 0 : _table$getCoreRowMode.getValue();
        return typeof value === "string" || typeof value === "number";
      }
    };
  },
  createColumn: (column, table) => {
    column.getCanGlobalFilter = () => {
      var _column$columnDef$ena, _table$options$enable, _table$options$enable2, _table$options$getCol;
      return ((_column$columnDef$ena = column.columnDef.enableGlobalFilter) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableGlobalFilter) != null ? _table$options$enable : true) && ((_table$options$enable2 = table.options.enableFilters) != null ? _table$options$enable2 : true) && ((_table$options$getCol = table.options.getColumnCanGlobalFilter == null ? void 0 : table.options.getColumnCanGlobalFilter(column)) != null ? _table$options$getCol : true) && !!column.accessorFn;
    };
  },
  createTable: (table) => {
    table.getGlobalAutoFilterFn = () => {
      return filterFns.includesString;
    };
    table.getGlobalFilterFn = () => {
      var _table$options$filter, _table$options$filter2;
      const {
        globalFilterFn
      } = table.options;
      return isFunction(globalFilterFn) ? globalFilterFn : globalFilterFn === "auto" ? table.getGlobalAutoFilterFn() : (_table$options$filter = (_table$options$filter2 = table.options.filterFns) == null ? void 0 : _table$options$filter2[globalFilterFn]) != null ? _table$options$filter : filterFns[globalFilterFn];
    };
    table.setGlobalFilter = (updater) => {
      table.options.onGlobalFilterChange == null || table.options.onGlobalFilterChange(updater);
    };
    table.resetGlobalFilter = (defaultState) => {
      table.setGlobalFilter(defaultState ? void 0 : table.initialState.globalFilter);
    };
  }
};
const RowExpanding = {
  getInitialState: (state) => {
    return {
      expanded: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onExpandedChange: makeStateUpdater("expanded", table),
      paginateExpandedRows: true
    };
  },
  createTable: (table) => {
    let registered = false;
    let queued = false;
    table._autoResetExpanded = () => {
      var _ref, _table$options$autoRe;
      if (!registered) {
        table._queue(() => {
          registered = true;
        });
        return;
      }
      if ((_ref = (_table$options$autoRe = table.options.autoResetAll) != null ? _table$options$autoRe : table.options.autoResetExpanded) != null ? _ref : !table.options.manualExpanding) {
        if (queued) return;
        queued = true;
        table._queue(() => {
          table.resetExpanded();
          queued = false;
        });
      }
    };
    table.setExpanded = (updater) => table.options.onExpandedChange == null ? void 0 : table.options.onExpandedChange(updater);
    table.toggleAllRowsExpanded = (expanded) => {
      if (expanded != null ? expanded : !table.getIsAllRowsExpanded()) {
        table.setExpanded(true);
      } else {
        table.setExpanded({});
      }
    };
    table.resetExpanded = (defaultState) => {
      var _table$initialState$e, _table$initialState;
      table.setExpanded(defaultState ? {} : (_table$initialState$e = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.expanded) != null ? _table$initialState$e : {});
    };
    table.getCanSomeRowsExpand = () => {
      return table.getPrePaginationRowModel().flatRows.some((row) => row.getCanExpand());
    };
    table.getToggleAllRowsExpandedHandler = () => {
      return (e) => {
        e.persist == null || e.persist();
        table.toggleAllRowsExpanded();
      };
    };
    table.getIsSomeRowsExpanded = () => {
      const expanded = table.getState().expanded;
      return expanded === true || Object.values(expanded).some(Boolean);
    };
    table.getIsAllRowsExpanded = () => {
      const expanded = table.getState().expanded;
      if (typeof expanded === "boolean") {
        return expanded === true;
      }
      if (!Object.keys(expanded).length) {
        return false;
      }
      if (table.getRowModel().flatRows.some((row) => !row.getIsExpanded())) {
        return false;
      }
      return true;
    };
    table.getExpandedDepth = () => {
      let maxDepth = 0;
      const rowIds = table.getState().expanded === true ? Object.keys(table.getRowModel().rowsById) : Object.keys(table.getState().expanded);
      rowIds.forEach((id) => {
        const splitId = id.split(".");
        maxDepth = Math.max(maxDepth, splitId.length);
      });
      return maxDepth;
    };
    table.getPreExpandedRowModel = () => table.getSortedRowModel();
    table.getExpandedRowModel = () => {
      if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
        table._getExpandedRowModel = table.options.getExpandedRowModel(table);
      }
      if (table.options.manualExpanding || !table._getExpandedRowModel) {
        return table.getPreExpandedRowModel();
      }
      return table._getExpandedRowModel();
    };
  },
  createRow: (row, table) => {
    row.toggleExpanded = (expanded) => {
      table.setExpanded((old) => {
        var _expanded;
        const exists = old === true ? true : !!(old != null && old[row.id]);
        let oldExpanded = {};
        if (old === true) {
          Object.keys(table.getRowModel().rowsById).forEach((rowId) => {
            oldExpanded[rowId] = true;
          });
        } else {
          oldExpanded = old;
        }
        expanded = (_expanded = expanded) != null ? _expanded : !exists;
        if (!exists && expanded) {
          return {
            ...oldExpanded,
            [row.id]: true
          };
        }
        if (exists && !expanded) {
          const {
            [row.id]: _,
            ...rest
          } = oldExpanded;
          return rest;
        }
        return old;
      });
    };
    row.getIsExpanded = () => {
      var _table$options$getIsR;
      const expanded = table.getState().expanded;
      return !!((_table$options$getIsR = table.options.getIsRowExpanded == null ? void 0 : table.options.getIsRowExpanded(row)) != null ? _table$options$getIsR : expanded === true || (expanded == null ? void 0 : expanded[row.id]));
    };
    row.getCanExpand = () => {
      var _table$options$getRow, _table$options$enable, _row$subRows;
      return (_table$options$getRow = table.options.getRowCanExpand == null ? void 0 : table.options.getRowCanExpand(row)) != null ? _table$options$getRow : ((_table$options$enable = table.options.enableExpanding) != null ? _table$options$enable : true) && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
    };
    row.getIsAllParentsExpanded = () => {
      let isFullyExpanded = true;
      let currentRow = row;
      while (isFullyExpanded && currentRow.parentId) {
        currentRow = table.getRow(currentRow.parentId, true);
        isFullyExpanded = currentRow.getIsExpanded();
      }
      return isFullyExpanded;
    };
    row.getToggleExpandedHandler = () => {
      const canExpand = row.getCanExpand();
      return () => {
        if (!canExpand) return;
        row.toggleExpanded();
      };
    };
  }
};
const defaultPageIndex = 0;
const defaultPageSize = 10;
const getDefaultPaginationState = () => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize
});
const RowPagination = {
  getInitialState: (state) => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state == null ? void 0 : state.pagination
      }
    };
  },
  getDefaultOptions: (table) => {
    return {
      onPaginationChange: makeStateUpdater("pagination", table)
    };
  },
  createTable: (table) => {
    let registered = false;
    let queued = false;
    table._autoResetPageIndex = () => {
      var _ref, _table$options$autoRe;
      if (!registered) {
        table._queue(() => {
          registered = true;
        });
        return;
      }
      if ((_ref = (_table$options$autoRe = table.options.autoResetAll) != null ? _table$options$autoRe : table.options.autoResetPageIndex) != null ? _ref : !table.options.manualPagination) {
        if (queued) return;
        queued = true;
        table._queue(() => {
          table.resetPageIndex();
          queued = false;
        });
      }
    };
    table.setPagination = (updater) => {
      const safeUpdater = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onPaginationChange == null ? void 0 : table.options.onPaginationChange(safeUpdater);
    };
    table.resetPagination = (defaultState) => {
      var _table$initialState$p;
      table.setPagination(defaultState ? getDefaultPaginationState() : (_table$initialState$p = table.initialState.pagination) != null ? _table$initialState$p : getDefaultPaginationState());
    };
    table.setPageIndex = (updater) => {
      table.setPagination((old) => {
        let pageIndex = functionalUpdate(updater, old.pageIndex);
        const maxPageIndex = typeof table.options.pageCount === "undefined" || table.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : table.options.pageCount - 1;
        pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex));
        return {
          ...old,
          pageIndex
        };
      });
    };
    table.resetPageIndex = (defaultState) => {
      var _table$initialState$p2, _table$initialState;
      table.setPageIndex(defaultState ? defaultPageIndex : (_table$initialState$p2 = (_table$initialState = table.initialState) == null || (_table$initialState = _table$initialState.pagination) == null ? void 0 : _table$initialState.pageIndex) != null ? _table$initialState$p2 : defaultPageIndex);
    };
    table.resetPageSize = (defaultState) => {
      var _table$initialState$p3, _table$initialState2;
      table.setPageSize(defaultState ? defaultPageSize : (_table$initialState$p3 = (_table$initialState2 = table.initialState) == null || (_table$initialState2 = _table$initialState2.pagination) == null ? void 0 : _table$initialState2.pageSize) != null ? _table$initialState$p3 : defaultPageSize);
    };
    table.setPageSize = (updater) => {
      table.setPagination((old) => {
        const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize));
        const topRowIndex = old.pageSize * old.pageIndex;
        const pageIndex = Math.floor(topRowIndex / pageSize);
        return {
          ...old,
          pageIndex,
          pageSize
        };
      });
    };
    table.setPageCount = (updater) => table.setPagination((old) => {
      var _table$options$pageCo;
      let newPageCount = functionalUpdate(updater, (_table$options$pageCo = table.options.pageCount) != null ? _table$options$pageCo : -1);
      if (typeof newPageCount === "number") {
        newPageCount = Math.max(-1, newPageCount);
      }
      return {
        ...old,
        pageCount: newPageCount
      };
    });
    table.getPageOptions = memo(() => [table.getPageCount()], (pageCount) => {
      let pageOptions = [];
      if (pageCount && pageCount > 0) {
        pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
      }
      return pageOptions;
    }, getMemoOptions(table.options, "debugTable"));
    table.getCanPreviousPage = () => table.getState().pagination.pageIndex > 0;
    table.getCanNextPage = () => {
      const {
        pageIndex
      } = table.getState().pagination;
      const pageCount = table.getPageCount();
      if (pageCount === -1) {
        return true;
      }
      if (pageCount === 0) {
        return false;
      }
      return pageIndex < pageCount - 1;
    };
    table.previousPage = () => {
      return table.setPageIndex((old) => old - 1);
    };
    table.nextPage = () => {
      return table.setPageIndex((old) => {
        return old + 1;
      });
    };
    table.firstPage = () => {
      return table.setPageIndex(0);
    };
    table.lastPage = () => {
      return table.setPageIndex(table.getPageCount() - 1);
    };
    table.getPrePaginationRowModel = () => table.getExpandedRowModel();
    table.getPaginationRowModel = () => {
      if (!table._getPaginationRowModel && table.options.getPaginationRowModel) {
        table._getPaginationRowModel = table.options.getPaginationRowModel(table);
      }
      if (table.options.manualPagination || !table._getPaginationRowModel) {
        return table.getPrePaginationRowModel();
      }
      return table._getPaginationRowModel();
    };
    table.getPageCount = () => {
      var _table$options$pageCo2;
      return (_table$options$pageCo2 = table.options.pageCount) != null ? _table$options$pageCo2 : Math.ceil(table.getRowCount() / table.getState().pagination.pageSize);
    };
    table.getRowCount = () => {
      var _table$options$rowCou;
      return (_table$options$rowCou = table.options.rowCount) != null ? _table$options$rowCou : table.getPrePaginationRowModel().rows.length;
    };
  }
};
const getDefaultRowPinningState = () => ({
  top: [],
  bottom: []
});
const RowPinning = {
  getInitialState: (state) => {
    return {
      rowPinning: getDefaultRowPinningState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onRowPinningChange: makeStateUpdater("rowPinning", table)
    };
  },
  createRow: (row, table) => {
    row.pin = (position, includeLeafRows, includeParentRows) => {
      const leafRowIds = includeLeafRows ? row.getLeafRows().map((_ref) => {
        let {
          id
        } = _ref;
        return id;
      }) : [];
      const parentRowIds = includeParentRows ? row.getParentRows().map((_ref2) => {
        let {
          id
        } = _ref2;
        return id;
      }) : [];
      const rowIds = /* @__PURE__ */ new Set([...parentRowIds, row.id, ...leafRowIds]);
      table.setRowPinning((old) => {
        var _old$top3, _old$bottom3;
        if (position === "bottom") {
          var _old$top, _old$bottom;
          return {
            top: ((_old$top = old == null ? void 0 : old.top) != null ? _old$top : []).filter((d) => !(rowIds != null && rowIds.has(d))),
            bottom: [...((_old$bottom = old == null ? void 0 : old.bottom) != null ? _old$bottom : []).filter((d) => !(rowIds != null && rowIds.has(d))), ...Array.from(rowIds)]
          };
        }
        if (position === "top") {
          var _old$top2, _old$bottom2;
          return {
            top: [...((_old$top2 = old == null ? void 0 : old.top) != null ? _old$top2 : []).filter((d) => !(rowIds != null && rowIds.has(d))), ...Array.from(rowIds)],
            bottom: ((_old$bottom2 = old == null ? void 0 : old.bottom) != null ? _old$bottom2 : []).filter((d) => !(rowIds != null && rowIds.has(d)))
          };
        }
        return {
          top: ((_old$top3 = old == null ? void 0 : old.top) != null ? _old$top3 : []).filter((d) => !(rowIds != null && rowIds.has(d))),
          bottom: ((_old$bottom3 = old == null ? void 0 : old.bottom) != null ? _old$bottom3 : []).filter((d) => !(rowIds != null && rowIds.has(d)))
        };
      });
    };
    row.getCanPin = () => {
      var _ref3;
      const {
        enableRowPinning,
        enablePinning
      } = table.options;
      if (typeof enableRowPinning === "function") {
        return enableRowPinning(row);
      }
      return (_ref3 = enableRowPinning != null ? enableRowPinning : enablePinning) != null ? _ref3 : true;
    };
    row.getIsPinned = () => {
      const rowIds = [row.id];
      const {
        top,
        bottom
      } = table.getState().rowPinning;
      const isTop = rowIds.some((d) => top == null ? void 0 : top.includes(d));
      const isBottom = rowIds.some((d) => bottom == null ? void 0 : bottom.includes(d));
      return isTop ? "top" : isBottom ? "bottom" : false;
    };
    row.getPinnedIndex = () => {
      var _ref4, _visiblePinnedRowIds$;
      const position = row.getIsPinned();
      if (!position) return -1;
      const visiblePinnedRowIds = (_ref4 = position === "top" ? table.getTopRows() : table.getBottomRows()) == null ? void 0 : _ref4.map((_ref5) => {
        let {
          id
        } = _ref5;
        return id;
      });
      return (_visiblePinnedRowIds$ = visiblePinnedRowIds == null ? void 0 : visiblePinnedRowIds.indexOf(row.id)) != null ? _visiblePinnedRowIds$ : -1;
    };
  },
  createTable: (table) => {
    table.setRowPinning = (updater) => table.options.onRowPinningChange == null ? void 0 : table.options.onRowPinningChange(updater);
    table.resetRowPinning = (defaultState) => {
      var _table$initialState$r, _table$initialState;
      return table.setRowPinning(defaultState ? getDefaultRowPinningState() : (_table$initialState$r = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.rowPinning) != null ? _table$initialState$r : getDefaultRowPinningState());
    };
    table.getIsSomeRowsPinned = (position) => {
      var _pinningState$positio;
      const pinningState = table.getState().rowPinning;
      if (!position) {
        var _pinningState$top, _pinningState$bottom;
        return Boolean(((_pinningState$top = pinningState.top) == null ? void 0 : _pinningState$top.length) || ((_pinningState$bottom = pinningState.bottom) == null ? void 0 : _pinningState$bottom.length));
      }
      return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
    };
    table._getPinnedRows = (visibleRows, pinnedRowIds, position) => {
      var _table$options$keepPi;
      const rows = ((_table$options$keepPi = table.options.keepPinnedRows) != null ? _table$options$keepPi : true) ? (
        //get all rows that are pinned even if they would not be otherwise visible
        //account for expanded parent rows, but not pagination or filtering
        (pinnedRowIds != null ? pinnedRowIds : []).map((rowId) => {
          const row = table.getRow(rowId, true);
          return row.getIsAllParentsExpanded() ? row : null;
        })
      ) : (
        //else get only visible rows that are pinned
        (pinnedRowIds != null ? pinnedRowIds : []).map((rowId) => visibleRows.find((row) => row.id === rowId))
      );
      return rows.filter(Boolean).map((d) => ({
        ...d,
        position
      }));
    };
    table.getTopRows = memo(() => [table.getRowModel().rows, table.getState().rowPinning.top], (allRows, topPinnedRowIds) => table._getPinnedRows(allRows, topPinnedRowIds, "top"), getMemoOptions(table.options, "debugRows"));
    table.getBottomRows = memo(() => [table.getRowModel().rows, table.getState().rowPinning.bottom], (allRows, bottomPinnedRowIds) => table._getPinnedRows(allRows, bottomPinnedRowIds, "bottom"), getMemoOptions(table.options, "debugRows"));
    table.getCenterRows = memo(() => [table.getRowModel().rows, table.getState().rowPinning.top, table.getState().rowPinning.bottom], (allRows, top, bottom) => {
      const topAndBottom = /* @__PURE__ */ new Set([...top != null ? top : [], ...bottom != null ? bottom : []]);
      return allRows.filter((d) => !topAndBottom.has(d.id));
    }, getMemoOptions(table.options, "debugRows"));
  }
};
const RowSelection = {
  getInitialState: (state) => {
    return {
      rowSelection: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onRowSelectionChange: makeStateUpdater("rowSelection", table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    };
  },
  createTable: (table) => {
    table.setRowSelection = (updater) => table.options.onRowSelectionChange == null ? void 0 : table.options.onRowSelectionChange(updater);
    table.resetRowSelection = (defaultState) => {
      var _table$initialState$r;
      return table.setRowSelection(defaultState ? {} : (_table$initialState$r = table.initialState.rowSelection) != null ? _table$initialState$r : {});
    };
    table.toggleAllRowsSelected = (value) => {
      table.setRowSelection((old) => {
        value = typeof value !== "undefined" ? value : !table.getIsAllRowsSelected();
        const rowSelection = {
          ...old
        };
        const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows;
        if (value) {
          preGroupedFlatRows.forEach((row) => {
            if (!row.getCanSelect()) {
              return;
            }
            rowSelection[row.id] = true;
          });
        } else {
          preGroupedFlatRows.forEach((row) => {
            delete rowSelection[row.id];
          });
        }
        return rowSelection;
      });
    };
    table.toggleAllPageRowsSelected = (value) => table.setRowSelection((old) => {
      const resolvedValue = typeof value !== "undefined" ? value : !table.getIsAllPageRowsSelected();
      const rowSelection = {
        ...old
      };
      table.getRowModel().rows.forEach((row) => {
        mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table);
      });
      return rowSelection;
    });
    table.getPreSelectedRowModel = () => table.getCoreRowModel();
    table.getSelectedRowModel = memo(() => [table.getState().rowSelection, table.getCoreRowModel()], (rowSelection, rowModel) => {
      if (!Object.keys(rowSelection).length) {
        return {
          rows: [],
          flatRows: [],
          rowsById: {}
        };
      }
      return selectRowsFn(table, rowModel);
    }, getMemoOptions(table.options, "debugTable"));
    table.getFilteredSelectedRowModel = memo(() => [table.getState().rowSelection, table.getFilteredRowModel()], (rowSelection, rowModel) => {
      if (!Object.keys(rowSelection).length) {
        return {
          rows: [],
          flatRows: [],
          rowsById: {}
        };
      }
      return selectRowsFn(table, rowModel);
    }, getMemoOptions(table.options, "debugTable"));
    table.getGroupedSelectedRowModel = memo(() => [table.getState().rowSelection, table.getSortedRowModel()], (rowSelection, rowModel) => {
      if (!Object.keys(rowSelection).length) {
        return {
          rows: [],
          flatRows: [],
          rowsById: {}
        };
      }
      return selectRowsFn(table, rowModel);
    }, getMemoOptions(table.options, "debugTable"));
    table.getIsAllRowsSelected = () => {
      const preGroupedFlatRows = table.getFilteredRowModel().flatRows;
      const {
        rowSelection
      } = table.getState();
      let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);
      if (isAllRowsSelected) {
        if (preGroupedFlatRows.some((row) => row.getCanSelect() && !rowSelection[row.id])) {
          isAllRowsSelected = false;
        }
      }
      return isAllRowsSelected;
    };
    table.getIsAllPageRowsSelected = () => {
      const paginationFlatRows = table.getPaginationRowModel().flatRows.filter((row) => row.getCanSelect());
      const {
        rowSelection
      } = table.getState();
      let isAllPageRowsSelected = !!paginationFlatRows.length;
      if (isAllPageRowsSelected && paginationFlatRows.some((row) => !rowSelection[row.id])) {
        isAllPageRowsSelected = false;
      }
      return isAllPageRowsSelected;
    };
    table.getIsSomeRowsSelected = () => {
      var _table$getState$rowSe;
      const totalSelected = Object.keys((_table$getState$rowSe = table.getState().rowSelection) != null ? _table$getState$rowSe : {}).length;
      return totalSelected > 0 && totalSelected < table.getFilteredRowModel().flatRows.length;
    };
    table.getIsSomePageRowsSelected = () => {
      const paginationFlatRows = table.getPaginationRowModel().flatRows;
      return table.getIsAllPageRowsSelected() ? false : paginationFlatRows.filter((row) => row.getCanSelect()).some((d) => d.getIsSelected() || d.getIsSomeSelected());
    };
    table.getToggleAllRowsSelectedHandler = () => {
      return (e) => {
        table.toggleAllRowsSelected(e.target.checked);
      };
    };
    table.getToggleAllPageRowsSelectedHandler = () => {
      return (e) => {
        table.toggleAllPageRowsSelected(e.target.checked);
      };
    };
  },
  createRow: (row, table) => {
    row.toggleSelected = (value, opts) => {
      const isSelected = row.getIsSelected();
      table.setRowSelection((old) => {
        var _opts$selectChildren;
        value = typeof value !== "undefined" ? value : !isSelected;
        if (row.getCanSelect() && isSelected === value) {
          return old;
        }
        const selectedRowIds = {
          ...old
        };
        mutateRowIsSelected(selectedRowIds, row.id, value, (_opts$selectChildren = opts == null ? void 0 : opts.selectChildren) != null ? _opts$selectChildren : true, table);
        return selectedRowIds;
      });
    };
    row.getIsSelected = () => {
      const {
        rowSelection
      } = table.getState();
      return isRowSelected(row, rowSelection);
    };
    row.getIsSomeSelected = () => {
      const {
        rowSelection
      } = table.getState();
      return isSubRowSelected(row, rowSelection) === "some";
    };
    row.getIsAllSubRowsSelected = () => {
      const {
        rowSelection
      } = table.getState();
      return isSubRowSelected(row, rowSelection) === "all";
    };
    row.getCanSelect = () => {
      var _table$options$enable;
      if (typeof table.options.enableRowSelection === "function") {
        return table.options.enableRowSelection(row);
      }
      return (_table$options$enable = table.options.enableRowSelection) != null ? _table$options$enable : true;
    };
    row.getCanSelectSubRows = () => {
      var _table$options$enable2;
      if (typeof table.options.enableSubRowSelection === "function") {
        return table.options.enableSubRowSelection(row);
      }
      return (_table$options$enable2 = table.options.enableSubRowSelection) != null ? _table$options$enable2 : true;
    };
    row.getCanMultiSelect = () => {
      var _table$options$enable3;
      if (typeof table.options.enableMultiRowSelection === "function") {
        return table.options.enableMultiRowSelection(row);
      }
      return (_table$options$enable3 = table.options.enableMultiRowSelection) != null ? _table$options$enable3 : true;
    };
    row.getToggleSelectedHandler = () => {
      const canSelect = row.getCanSelect();
      return (e) => {
        var _target;
        if (!canSelect) return;
        row.toggleSelected((_target = e.target) == null ? void 0 : _target.checked);
      };
    };
  }
};
const mutateRowIsSelected = (selectedRowIds, id, value, includeChildren, table) => {
  var _row$subRows;
  const row = table.getRow(id, true);
  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key]);
    }
    if (row.getCanSelect()) {
      selectedRowIds[id] = true;
    }
  } else {
    delete selectedRowIds[id];
  }
  if (includeChildren && (_row$subRows = row.subRows) != null && _row$subRows.length && row.getCanSelectSubRows()) {
    row.subRows.forEach((row2) => mutateRowIsSelected(selectedRowIds, row2.id, value, includeChildren, table));
  }
};
function selectRowsFn(table, rowModel) {
  const rowSelection = table.getState().rowSelection;
  const newSelectedFlatRows = [];
  const newSelectedRowsById = {};
  const recurseRows = function(rows, depth) {
    return rows.map((row) => {
      var _row$subRows2;
      const isSelected = isRowSelected(row, rowSelection);
      if (isSelected) {
        newSelectedFlatRows.push(row);
        newSelectedRowsById[row.id] = row;
      }
      if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length) {
        row = {
          ...row,
          subRows: recurseRows(row.subRows)
        };
      }
      if (isSelected) {
        return row;
      }
    }).filter(Boolean);
  };
  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById
  };
}
function isRowSelected(row, selection) {
  var _selection$row$id;
  return (_selection$row$id = selection[row.id]) != null ? _selection$row$id : false;
}
function isSubRowSelected(row, selection, table) {
  var _row$subRows3;
  if (!((_row$subRows3 = row.subRows) != null && _row$subRows3.length)) return false;
  let allChildrenSelected = true;
  let someSelected = false;
  row.subRows.forEach((subRow) => {
    if (someSelected && !allChildrenSelected) {
      return;
    }
    if (subRow.getCanSelect()) {
      if (isRowSelected(subRow, selection)) {
        someSelected = true;
      } else {
        allChildrenSelected = false;
      }
    }
    if (subRow.subRows && subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow, selection);
      if (subRowChildrenSelected === "all") {
        someSelected = true;
      } else if (subRowChildrenSelected === "some") {
        someSelected = true;
        allChildrenSelected = false;
      } else {
        allChildrenSelected = false;
      }
    }
  });
  return allChildrenSelected ? "all" : someSelected ? "some" : false;
}
const reSplitAlphaNumeric = /([0-9]+)/gm;
const alphanumeric = (rowA, rowB, columnId) => {
  return compareAlphanumeric(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
};
const alphanumericCaseSensitive = (rowA, rowB, columnId) => {
  return compareAlphanumeric(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
};
const text = (rowA, rowB, columnId) => {
  return compareBasic(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
};
const textCaseSensitive = (rowA, rowB, columnId) => {
  return compareBasic(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
};
const datetime = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);
  return a > b ? 1 : a < b ? -1 : 0;
};
const basic = (rowA, rowB, columnId) => {
  return compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
};
function compareBasic(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function toString(a) {
  if (typeof a === "number") {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return "";
    }
    return String(a);
  }
  if (typeof a === "string") {
    return a;
  }
  return "";
}
function compareAlphanumeric(aStr, bStr) {
  const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
  const b = bStr.split(reSplitAlphaNumeric).filter(Boolean);
  while (a.length && b.length) {
    const aa = a.shift();
    const bb = b.shift();
    const an = parseInt(aa, 10);
    const bn = parseInt(bb, 10);
    const combo = [an, bn].sort();
    if (isNaN(combo[0])) {
      if (aa > bb) {
        return 1;
      }
      if (bb > aa) {
        return -1;
      }
      continue;
    }
    if (isNaN(combo[1])) {
      return isNaN(an) ? -1 : 1;
    }
    if (an > bn) {
      return 1;
    }
    if (bn > an) {
      return -1;
    }
  }
  return a.length - b.length;
}
const sortingFns = {
  alphanumeric,
  alphanumericCaseSensitive,
  text,
  textCaseSensitive,
  datetime,
  basic
};
const RowSorting = {
  getInitialState: (state) => {
    return {
      sorting: [],
      ...state
    };
  },
  getDefaultColumnDef: () => {
    return {
      sortingFn: "auto",
      sortUndefined: 1
    };
  },
  getDefaultOptions: (table) => {
    return {
      onSortingChange: makeStateUpdater("sorting", table),
      isMultiSortEvent: (e) => {
        return e.shiftKey;
      }
    };
  },
  createColumn: (column, table) => {
    column.getAutoSortingFn = () => {
      const firstRows = table.getFilteredRowModel().flatRows.slice(10);
      let isString = false;
      for (const row of firstRows) {
        const value = row == null ? void 0 : row.getValue(column.id);
        if (Object.prototype.toString.call(value) === "[object Date]") {
          return sortingFns.datetime;
        }
        if (typeof value === "string") {
          isString = true;
          if (value.split(reSplitAlphaNumeric).length > 1) {
            return sortingFns.alphanumeric;
          }
        }
      }
      if (isString) {
        return sortingFns.text;
      }
      return sortingFns.basic;
    };
    column.getAutoSortDir = () => {
      const firstRow = table.getFilteredRowModel().flatRows[0];
      const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
      if (typeof value === "string") {
        return "asc";
      }
      return "desc";
    };
    column.getSortingFn = () => {
      var _table$options$sortin, _table$options$sortin2;
      if (!column) {
        throw new Error();
      }
      return isFunction(column.columnDef.sortingFn) ? column.columnDef.sortingFn : column.columnDef.sortingFn === "auto" ? column.getAutoSortingFn() : (_table$options$sortin = (_table$options$sortin2 = table.options.sortingFns) == null ? void 0 : _table$options$sortin2[column.columnDef.sortingFn]) != null ? _table$options$sortin : sortingFns[column.columnDef.sortingFn];
    };
    column.toggleSorting = (desc, multi) => {
      const nextSortingOrder = column.getNextSortingOrder();
      const hasManualValue = typeof desc !== "undefined" && desc !== null;
      table.setSorting((old) => {
        const existingSorting = old == null ? void 0 : old.find((d) => d.id === column.id);
        const existingIndex = old == null ? void 0 : old.findIndex((d) => d.id === column.id);
        let newSorting = [];
        let sortAction;
        let nextDesc = hasManualValue ? desc : nextSortingOrder === "desc";
        if (old != null && old.length && column.getCanMultiSort() && multi) {
          if (existingSorting) {
            sortAction = "toggle";
          } else {
            sortAction = "add";
          }
        } else {
          if (old != null && old.length && existingIndex !== old.length - 1) {
            sortAction = "replace";
          } else if (existingSorting) {
            sortAction = "toggle";
          } else {
            sortAction = "replace";
          }
        }
        if (sortAction === "toggle") {
          if (!hasManualValue) {
            if (!nextSortingOrder) {
              sortAction = "remove";
            }
          }
        }
        if (sortAction === "add") {
          var _table$options$maxMul;
          newSorting = [...old, {
            id: column.id,
            desc: nextDesc
          }];
          newSorting.splice(0, newSorting.length - ((_table$options$maxMul = table.options.maxMultiSortColCount) != null ? _table$options$maxMul : Number.MAX_SAFE_INTEGER));
        } else if (sortAction === "toggle") {
          newSorting = old.map((d) => {
            if (d.id === column.id) {
              return {
                ...d,
                desc: nextDesc
              };
            }
            return d;
          });
        } else if (sortAction === "remove") {
          newSorting = old.filter((d) => d.id !== column.id);
        } else {
          newSorting = [{
            id: column.id,
            desc: nextDesc
          }];
        }
        return newSorting;
      });
    };
    column.getFirstSortDir = () => {
      var _ref, _column$columnDef$sor;
      const sortDescFirst = (_ref = (_column$columnDef$sor = column.columnDef.sortDescFirst) != null ? _column$columnDef$sor : table.options.sortDescFirst) != null ? _ref : column.getAutoSortDir() === "desc";
      return sortDescFirst ? "desc" : "asc";
    };
    column.getNextSortingOrder = (multi) => {
      var _table$options$enable, _table$options$enable2;
      const firstSortDirection = column.getFirstSortDir();
      const isSorted = column.getIsSorted();
      if (!isSorted) {
        return firstSortDirection;
      }
      if (isSorted !== firstSortDirection && ((_table$options$enable = table.options.enableSortingRemoval) != null ? _table$options$enable : true) && // If enableSortRemove, enable in general
      (multi ? (_table$options$enable2 = table.options.enableMultiRemove) != null ? _table$options$enable2 : true : true)) {
        return false;
      }
      return isSorted === "desc" ? "asc" : "desc";
    };
    column.getCanSort = () => {
      var _column$columnDef$ena, _table$options$enable3;
      return ((_column$columnDef$ena = column.columnDef.enableSorting) != null ? _column$columnDef$ena : true) && ((_table$options$enable3 = table.options.enableSorting) != null ? _table$options$enable3 : true) && !!column.accessorFn;
    };
    column.getCanMultiSort = () => {
      var _ref2, _column$columnDef$ena2;
      return (_ref2 = (_column$columnDef$ena2 = column.columnDef.enableMultiSort) != null ? _column$columnDef$ena2 : table.options.enableMultiSort) != null ? _ref2 : !!column.accessorFn;
    };
    column.getIsSorted = () => {
      var _table$getState$sorti;
      const columnSort = (_table$getState$sorti = table.getState().sorting) == null ? void 0 : _table$getState$sorti.find((d) => d.id === column.id);
      return !columnSort ? false : columnSort.desc ? "desc" : "asc";
    };
    column.getSortIndex = () => {
      var _table$getState$sorti2, _table$getState$sorti3;
      return (_table$getState$sorti2 = (_table$getState$sorti3 = table.getState().sorting) == null ? void 0 : _table$getState$sorti3.findIndex((d) => d.id === column.id)) != null ? _table$getState$sorti2 : -1;
    };
    column.clearSorting = () => {
      table.setSorting((old) => old != null && old.length ? old.filter((d) => d.id !== column.id) : []);
    };
    column.getToggleSortingHandler = () => {
      const canSort = column.getCanSort();
      return (e) => {
        if (!canSort) return;
        e.persist == null || e.persist();
        column.toggleSorting == null || column.toggleSorting(void 0, column.getCanMultiSort() ? table.options.isMultiSortEvent == null ? void 0 : table.options.isMultiSortEvent(e) : false);
      };
    };
  },
  createTable: (table) => {
    table.setSorting = (updater) => table.options.onSortingChange == null ? void 0 : table.options.onSortingChange(updater);
    table.resetSorting = (defaultState) => {
      var _table$initialState$s, _table$initialState;
      table.setSorting(defaultState ? [] : (_table$initialState$s = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.sorting) != null ? _table$initialState$s : []);
    };
    table.getPreSortedRowModel = () => table.getGroupedRowModel();
    table.getSortedRowModel = () => {
      if (!table._getSortedRowModel && table.options.getSortedRowModel) {
        table._getSortedRowModel = table.options.getSortedRowModel(table);
      }
      if (table.options.manualSorting || !table._getSortedRowModel) {
        return table.getPreSortedRowModel();
      }
      return table._getSortedRowModel();
    };
  }
};
const builtInFeatures = [
  Headers,
  ColumnVisibility,
  ColumnOrdering,
  ColumnPinning,
  ColumnFaceting,
  ColumnFiltering,
  GlobalFaceting,
  //depends on ColumnFaceting
  GlobalFiltering,
  //depends on ColumnFiltering
  RowSorting,
  ColumnGrouping,
  //depends on RowSorting
  RowExpanding,
  RowPagination,
  RowPinning,
  RowSelection,
  ColumnSizing
];
function createTable(options) {
  var _options$_features, _options$initialState;
  const _features = [...builtInFeatures, ...(_options$_features = options._features) != null ? _options$_features : []];
  let table = {
    _features
  };
  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions == null ? void 0 : feature.getDefaultOptions(table));
  }, {});
  const mergeOptions = (options2) => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options2);
    }
    return {
      ...defaultOptions,
      ...options2
    };
  };
  const coreInitialState = {};
  let initialState = {
    ...coreInitialState,
    ...(_options$initialState = options.initialState) != null ? _options$initialState : {}
  };
  table._features.forEach((feature) => {
    var _feature$getInitialSt;
    initialState = (_feature$getInitialSt = feature.getInitialState == null ? void 0 : feature.getInitialState(initialState)) != null ? _feature$getInitialSt : initialState;
  });
  const queued = [];
  let queuedTimeout = false;
  const coreInstance = {
    _features,
    options: {
      ...defaultOptions,
      ...options
    },
    initialState,
    _queue: (cb) => {
      queued.push(cb);
      if (!queuedTimeout) {
        queuedTimeout = true;
        Promise.resolve().then(() => {
          while (queued.length) {
            queued.shift()();
          }
          queuedTimeout = false;
        }).catch((error) => setTimeout(() => {
          throw error;
        }));
      }
    },
    reset: () => {
      table.setState(table.initialState);
    },
    setOptions: (updater) => {
      const newOptions = functionalUpdate(updater, table.options);
      table.options = mergeOptions(newOptions);
    },
    getState: () => {
      return table.options.state;
    },
    setState: (updater) => {
      table.options.onStateChange == null || table.options.onStateChange(updater);
    },
    _getRowId: (row, index, parent) => {
      var _table$options$getRow;
      return (_table$options$getRow = table.options.getRowId == null ? void 0 : table.options.getRowId(row, index, parent)) != null ? _table$options$getRow : `${parent ? [parent.id, index].join(".") : index}`;
    },
    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options.getCoreRowModel(table);
      }
      return table._getCoreRowModel();
    },
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => {
      return table.getPaginationRowModel();
    },
    //in next version, we should just pass in the row model as the optional 2nd arg
    getRow: (id, searchAll) => {
      let row = (searchAll ? table.getPrePaginationRowModel() : table.getRowModel()).rowsById[id];
      if (!row) {
        row = table.getCoreRowModel().rowsById[id];
        if (!row) {
          throw new Error();
        }
      }
      return row;
    },
    _getDefaultColumnDef: memo(() => [table.options.defaultColumn], (defaultColumn) => {
      var _defaultColumn;
      defaultColumn = (_defaultColumn = defaultColumn) != null ? _defaultColumn : {};
      return {
        header: (props) => {
          const resolvedColumnDef = props.header.column.columnDef;
          if (resolvedColumnDef.accessorKey) {
            return resolvedColumnDef.accessorKey;
          }
          if (resolvedColumnDef.accessorFn) {
            return resolvedColumnDef.id;
          }
          return null;
        },
        // footer: props => props.header.column.id,
        cell: (props) => {
          var _props$renderValue$to, _props$renderValue;
          return (_props$renderValue$to = (_props$renderValue = props.renderValue()) == null || _props$renderValue.toString == null ? void 0 : _props$renderValue.toString()) != null ? _props$renderValue$to : null;
        },
        ...table._features.reduce((obj, feature) => {
          return Object.assign(obj, feature.getDefaultColumnDef == null ? void 0 : feature.getDefaultColumnDef());
        }, {}),
        ...defaultColumn
      };
    }, getMemoOptions(options, "debugColumns")),
    _getColumnDefs: () => table.options.columns,
    getAllColumns: memo(() => [table._getColumnDefs()], (columnDefs) => {
      const recurseColumns = function(columnDefs2, parent, depth) {
        if (depth === void 0) {
          depth = 0;
        }
        return columnDefs2.map((columnDef) => {
          const column = createColumn(table, columnDef, depth, parent);
          const groupingColumnDef = columnDef;
          column.columns = groupingColumnDef.columns ? recurseColumns(groupingColumnDef.columns, column, depth + 1) : [];
          return column;
        });
      };
      return recurseColumns(columnDefs);
    }, getMemoOptions(options, "debugColumns")),
    getAllFlatColumns: memo(() => [table.getAllColumns()], (allColumns) => {
      return allColumns.flatMap((column) => {
        return column.getFlatColumns();
      });
    }, getMemoOptions(options, "debugColumns")),
    _getAllFlatColumnsById: memo(() => [table.getAllFlatColumns()], (flatColumns) => {
      return flatColumns.reduce((acc, column) => {
        acc[column.id] = column;
        return acc;
      }, {});
    }, getMemoOptions(options, "debugColumns")),
    getAllLeafColumns: memo(() => [table.getAllColumns(), table._getOrderColumnsFn()], (allColumns, orderColumns2) => {
      let leafColumns = allColumns.flatMap((column) => column.getLeafColumns());
      return orderColumns2(leafColumns);
    }, getMemoOptions(options, "debugColumns")),
    getColumn: (columnId) => {
      const column = table._getAllFlatColumnsById()[columnId];
      return column;
    }
  };
  Object.assign(table, coreInstance);
  for (let index = 0; index < table._features.length; index++) {
    const feature = table._features[index];
    feature == null || feature.createTable == null || feature.createTable(table);
  }
  return table;
}
function getCoreRowModel() {
  return (table) => memo(() => [table.options.data], (data) => {
    const rowModel = {
      rows: [],
      flatRows: [],
      rowsById: {}
    };
    const accessRows = function(originalRows, depth, parentRow) {
      if (depth === void 0) {
        depth = 0;
      }
      const rows = [];
      for (let i = 0; i < originalRows.length; i++) {
        const row = createRow(table, table._getRowId(originalRows[i], i, parentRow), originalRows[i], i, depth, void 0, parentRow == null ? void 0 : parentRow.id);
        rowModel.flatRows.push(row);
        rowModel.rowsById[row.id] = row;
        rows.push(row);
        if (table.options.getSubRows) {
          var _row$originalSubRows;
          row.originalSubRows = table.options.getSubRows(originalRows[i], i);
          if ((_row$originalSubRows = row.originalSubRows) != null && _row$originalSubRows.length) {
            row.subRows = accessRows(row.originalSubRows, depth + 1, row);
          }
        }
      }
      return rows;
    };
    rowModel.rows = accessRows(data);
    return rowModel;
  }, getMemoOptions(table.options, "debugTable", "getRowModel", () => table._autoResetPageIndex()));
}
function getExpandedRowModel() {
  return (table) => memo(() => [table.getState().expanded, table.getPreExpandedRowModel(), table.options.paginateExpandedRows], (expanded, rowModel, paginateExpandedRows) => {
    if (!rowModel.rows.length || expanded !== true && !Object.keys(expanded != null ? expanded : {}).length) {
      return rowModel;
    }
    if (!paginateExpandedRows) {
      return rowModel;
    }
    return expandRows(rowModel);
  }, getMemoOptions(table.options, "debugTable"));
}
function expandRows(rowModel) {
  const expandedRows = [];
  const handleRow = (row) => {
    var _row$subRows;
    expandedRows.push(row);
    if ((_row$subRows = row.subRows) != null && _row$subRows.length && row.getIsExpanded()) {
      row.subRows.forEach(handleRow);
    }
  };
  rowModel.rows.forEach(handleRow);
  return {
    rows: expandedRows,
    flatRows: rowModel.flatRows,
    rowsById: rowModel.rowsById
  };
}
function filterRows(rows, filterRowImpl, table) {
  if (table.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, table);
  }
  return filterRowModelFromRoot(rows, filterRowImpl, table);
}
function filterRowModelFromLeafs(rowsToFilter, filterRow, table) {
  var _table$options$maxLea;
  const newFilteredFlatRows = [];
  const newFilteredRowsById = {};
  const maxDepth = (_table$options$maxLea = table.options.maxLeafRowFilterDepth) != null ? _table$options$maxLea : 100;
  const recurseFilterRows = function(rowsToFilter2, depth) {
    if (depth === void 0) {
      depth = 0;
    }
    const rows = [];
    for (let i = 0; i < rowsToFilter2.length; i++) {
      var _row$subRows;
      let row = rowsToFilter2[i];
      const newRow = createRow(table, row.id, row.original, row.index, row.depth, void 0, row.parentId);
      newRow.columnFilters = row.columnFilters;
      if ((_row$subRows = row.subRows) != null && _row$subRows.length && depth < maxDepth) {
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
        row = newRow;
        if (filterRow(row) && !newRow.subRows.length) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
          continue;
        }
        if (filterRow(row) || newRow.subRows.length) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
          continue;
        }
      } else {
        row = newRow;
        if (filterRow(row)) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
        }
      }
    }
    return rows;
  };
  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
}
function filterRowModelFromRoot(rowsToFilter, filterRow, table) {
  var _table$options$maxLea2;
  const newFilteredFlatRows = [];
  const newFilteredRowsById = {};
  const maxDepth = (_table$options$maxLea2 = table.options.maxLeafRowFilterDepth) != null ? _table$options$maxLea2 : 100;
  const recurseFilterRows = function(rowsToFilter2, depth) {
    if (depth === void 0) {
      depth = 0;
    }
    const rows = [];
    for (let i = 0; i < rowsToFilter2.length; i++) {
      let row = rowsToFilter2[i];
      const pass = filterRow(row);
      if (pass) {
        var _row$subRows2;
        if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length && depth < maxDepth) {
          const newRow = createRow(table, row.id, row.original, row.index, row.depth, void 0, row.parentId);
          newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
          row = newRow;
        }
        rows.push(row);
        newFilteredFlatRows.push(row);
        newFilteredRowsById[row.id] = row;
      }
    }
    return rows;
  };
  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
}
function getFilteredRowModel() {
  return (table) => memo(() => [table.getPreFilteredRowModel(), table.getState().columnFilters, table.getState().globalFilter], (rowModel, columnFilters, globalFilter) => {
    if (!rowModel.rows.length || !(columnFilters != null && columnFilters.length) && !globalFilter) {
      for (let i = 0; i < rowModel.flatRows.length; i++) {
        rowModel.flatRows[i].columnFilters = {};
        rowModel.flatRows[i].columnFiltersMeta = {};
      }
      return rowModel;
    }
    const resolvedColumnFilters = [];
    const resolvedGlobalFilters = [];
    (columnFilters != null ? columnFilters : []).forEach((d) => {
      var _filterFn$resolveFilt;
      const column = table.getColumn(d.id);
      if (!column) {
        return;
      }
      const filterFn = column.getFilterFn();
      if (!filterFn) {
        return;
      }
      resolvedColumnFilters.push({
        id: d.id,
        filterFn,
        resolvedValue: (_filterFn$resolveFilt = filterFn.resolveFilterValue == null ? void 0 : filterFn.resolveFilterValue(d.value)) != null ? _filterFn$resolveFilt : d.value
      });
    });
    const filterableIds = (columnFilters != null ? columnFilters : []).map((d) => d.id);
    const globalFilterFn = table.getGlobalFilterFn();
    const globallyFilterableColumns = table.getAllLeafColumns().filter((column) => column.getCanGlobalFilter());
    if (globalFilter && globalFilterFn && globallyFilterableColumns.length) {
      filterableIds.push("__global__");
      globallyFilterableColumns.forEach((column) => {
        var _globalFilterFn$resol;
        resolvedGlobalFilters.push({
          id: column.id,
          filterFn: globalFilterFn,
          resolvedValue: (_globalFilterFn$resol = globalFilterFn.resolveFilterValue == null ? void 0 : globalFilterFn.resolveFilterValue(globalFilter)) != null ? _globalFilterFn$resol : globalFilter
        });
      });
    }
    let currentColumnFilter;
    let currentGlobalFilter;
    for (let j = 0; j < rowModel.flatRows.length; j++) {
      const row = rowModel.flatRows[j];
      row.columnFilters = {};
      if (resolvedColumnFilters.length) {
        for (let i = 0; i < resolvedColumnFilters.length; i++) {
          currentColumnFilter = resolvedColumnFilters[i];
          const id = currentColumnFilter.id;
          row.columnFilters[id] = currentColumnFilter.filterFn(row, id, currentColumnFilter.resolvedValue, (filterMeta) => {
            row.columnFiltersMeta[id] = filterMeta;
          });
        }
      }
      if (resolvedGlobalFilters.length) {
        for (let i = 0; i < resolvedGlobalFilters.length; i++) {
          currentGlobalFilter = resolvedGlobalFilters[i];
          const id = currentGlobalFilter.id;
          if (currentGlobalFilter.filterFn(row, id, currentGlobalFilter.resolvedValue, (filterMeta) => {
            row.columnFiltersMeta[id] = filterMeta;
          })) {
            row.columnFilters.__global__ = true;
            break;
          }
        }
        if (row.columnFilters.__global__ !== true) {
          row.columnFilters.__global__ = false;
        }
      }
    }
    const filterRowsImpl = (row) => {
      for (let i = 0; i < filterableIds.length; i++) {
        if (row.columnFilters[filterableIds[i]] === false) {
          return false;
        }
      }
      return true;
    };
    return filterRows(rowModel.rows, filterRowsImpl, table);
  }, getMemoOptions(table.options, "debugTable", "getFilteredRowModel", () => table._autoResetPageIndex()));
}
function getSortedRowModel() {
  return (table) => memo(() => [table.getState().sorting, table.getPreSortedRowModel()], (sorting, rowModel) => {
    if (!rowModel.rows.length || !(sorting != null && sorting.length)) {
      return rowModel;
    }
    const sortingState = table.getState().sorting;
    const sortedFlatRows = [];
    const availableSorting = sortingState.filter((sort) => {
      var _table$getColumn;
      return (_table$getColumn = table.getColumn(sort.id)) == null ? void 0 : _table$getColumn.getCanSort();
    });
    const columnInfoById = {};
    availableSorting.forEach((sortEntry) => {
      const column = table.getColumn(sortEntry.id);
      if (!column) return;
      columnInfoById[sortEntry.id] = {
        sortUndefined: column.columnDef.sortUndefined,
        invertSorting: column.columnDef.invertSorting,
        sortingFn: column.getSortingFn()
      };
    });
    const sortData = (rows) => {
      const sortedData = rows.map((row) => ({
        ...row
      }));
      sortedData.sort((rowA, rowB) => {
        for (let i = 0; i < availableSorting.length; i += 1) {
          var _sortEntry$desc;
          const sortEntry = availableSorting[i];
          const columnInfo = columnInfoById[sortEntry.id];
          const sortUndefined = columnInfo.sortUndefined;
          const isDesc = (_sortEntry$desc = sortEntry == null ? void 0 : sortEntry.desc) != null ? _sortEntry$desc : false;
          let sortInt = 0;
          if (sortUndefined) {
            const aValue = rowA.getValue(sortEntry.id);
            const bValue = rowB.getValue(sortEntry.id);
            const aUndefined = aValue === void 0;
            const bUndefined = bValue === void 0;
            if (aUndefined || bUndefined) {
              if (sortUndefined === "first") return aUndefined ? -1 : 1;
              if (sortUndefined === "last") return aUndefined ? 1 : -1;
              sortInt = aUndefined && bUndefined ? 0 : aUndefined ? sortUndefined : -sortUndefined;
            }
          }
          if (sortInt === 0) {
            sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id);
          }
          if (sortInt !== 0) {
            if (isDesc) {
              sortInt *= -1;
            }
            if (columnInfo.invertSorting) {
              sortInt *= -1;
            }
            return sortInt;
          }
        }
        return rowA.index - rowB.index;
      });
      sortedData.forEach((row) => {
        var _row$subRows;
        sortedFlatRows.push(row);
        if ((_row$subRows = row.subRows) != null && _row$subRows.length) {
          row.subRows = sortData(row.subRows);
        }
      });
      return sortedData;
    };
    return {
      rows: sortData(rowModel.rows),
      flatRows: sortedFlatRows,
      rowsById: rowModel.rowsById
    };
  }, getMemoOptions(table.options, "debugTable", "getSortedRowModel", () => table._autoResetPageIndex()));
}
function trueFn() {
  return true;
}
const $PROXY = /* @__PURE__ */ Symbol("merge-proxy");
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return "value" in s ? s.value : s;
}
function mergeProxy() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }
  return new Proxy({
    get(property) {
      for (let i = sources.length - 1; i >= 0; i--) {
        const v = resolveSource(sources[i])[property];
        if (v !== void 0) return v;
      }
    },
    has(property) {
      for (let i = sources.length - 1; i >= 0; i--) {
        if (property in resolveSource(sources[i])) return true;
      }
      return false;
    },
    keys() {
      const keys = [];
      for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
      return [...Array.from(new Set(keys))];
    }
  }, propTraps);
}
const FlexRender = vueExports.defineComponent({
  props: ["render", "props"],
  setup: (props) => {
    return () => {
      if (typeof props.render === "function" || typeof props.render === "object") {
        return vueExports.h(props.render, props.props);
      }
      return props.render;
    };
  }
});
function getOptionsWithReactiveData(options) {
  return mergeProxy(options, {
    data: vueExports.unref(options.data)
  });
}
function useVueTable(initialOptions) {
  const IS_REACTIVE = vueExports.isRef(initialOptions.data);
  const resolvedOptions = mergeProxy({
    state: {},
    // Dummy state
    onStateChange: () => {
    },
    // noop
    renderFallbackValue: null,
    mergeOptions(defaultOptions, options) {
      return IS_REACTIVE ? {
        ...defaultOptions,
        ...options
      } : mergeProxy(defaultOptions, options);
    }
  }, IS_REACTIVE ? getOptionsWithReactiveData(initialOptions) : initialOptions);
  const table = createTable(resolvedOptions);
  if (IS_REACTIVE) {
    const dataRef = vueExports.shallowRef(initialOptions.data);
    vueExports.watch(dataRef, () => {
      table.setState((prev) => ({
        ...prev,
        data: dataRef.value
      }));
    }, {
      immediate: true
    });
  }
  const state = vueExports.ref(table.initialState);
  vueExports.watchEffect(() => {
    table.setOptions((prev) => {
      var _initialOptions$state;
      const stateProxy = new Proxy({}, {
        get: (_, prop) => state.value[prop]
      });
      return mergeProxy(prev, IS_REACTIVE ? getOptionsWithReactiveData(initialOptions) : initialOptions, {
        // merge the initialState and `options.state`
        // create a new proxy on each `setOptions` call
        // and get the value from state on each property access
        state: mergeProxy(stateProxy, (_initialOptions$state = initialOptions.state) != null ? _initialOptions$state : {}),
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: (updater) => {
          if (updater instanceof Function) {
            state.value = updater(state.value);
          } else {
            state.value = updater;
          }
          initialOptions.onStateChange == null || initialOptions.onStateChange(updater);
        }
      });
    });
  });
  return table;
}
const theme$2 = {
  "slots": {
    "root": "relative overflow-auto",
    "base": "min-w-full",
    "caption": "sr-only",
    "thead": "relative",
    "tbody": "isolate [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary",
    "tfoot": "relative",
    "tr": "data-[selected=true]:bg-elevated/50",
    "th": "px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0",
    "td": "p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0",
    "separator": "absolute z-1 left-0 w-full h-px bg-(--ui-border-accented)",
    "empty": "py-6 text-center text-sm text-muted",
    "loading": "py-6 text-center"
  },
  "variants": {
    "virtualize": {
      "false": {
        "base": "overflow-clip",
        "tbody": "divide-y divide-default"
      }
    },
    "pinned": {
      "true": {
        "th": "sticky bg-default/75 z-1",
        "td": "sticky bg-default/75 z-1"
      }
    },
    "sticky": {
      "true": {
        "thead": "sticky top-0 inset-x-0 bg-default/75 backdrop-blur z-1",
        "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      },
      "header": {
        "thead": "sticky top-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      },
      "footer": {
        "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      }
    },
    "loading": {
      "true": {
        "thead": "after:absolute after:z-1 after:h-px"
      }
    },
    "loadingAnimation": {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    "loadingColor": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    }
  },
  "compoundVariants": [
    {
      "loading": true,
      "loadingColor": "primary",
      "class": {
        "thead": "after:bg-primary"
      }
    },
    {
      "loading": true,
      "loadingColor": "secondary",
      "class": {
        "thead": "after:bg-secondary"
      }
    },
    {
      "loading": true,
      "loadingColor": "success",
      "class": {
        "thead": "after:bg-success"
      }
    },
    {
      "loading": true,
      "loadingColor": "info",
      "class": {
        "thead": "after:bg-info"
      }
    },
    {
      "loading": true,
      "loadingColor": "warning",
      "class": {
        "thead": "after:bg-warning"
      }
    },
    {
      "loading": true,
      "loadingColor": "error",
      "class": {
        "thead": "after:bg-error"
      }
    },
    {
      "loading": true,
      "loadingColor": "neutral",
      "class": {
        "thead": "after:bg-inverted"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "carousel",
      "class": {
        "thead": "after:animate-[carousel_2s_ease-in-out_infinite] rtl:after:animate-[carousel-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "carousel-inverse",
      "class": {
        "thead": "after:animate-[carousel-inverse_2s_ease-in-out_infinite] rtl:after:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "swing",
      "class": {
        "thead": "after:animate-[swing_2s_ease-in-out_infinite]"
      }
    },
    {
      "loading": true,
      "loadingAnimation": "elastic",
      "class": {
        "thead": "after:animate-[elastic_2s_ease-in-out_infinite]"
      }
    }
  ],
  "defaultVariants": {
    "loadingColor": "primary",
    "loadingAnimation": "carousel"
  }
};
const _sfc_main$5 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UTable",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    as: { type: null, required: false },
    data: { type: Array, required: false },
    columns: { type: Array, required: false },
    caption: { type: String, required: false },
    meta: { type: Object, required: false },
    virtualize: { type: [Boolean, Object], required: false, default: false },
    empty: { type: String, required: false },
    sticky: { type: [Boolean, String], required: false },
    loading: { type: Boolean, required: false },
    loadingColor: { type: null, required: false },
    loadingAnimation: { type: null, required: false },
    watchOptions: { type: Object, required: false, default: () => ({
      deep: true
    }) },
    globalFilterOptions: { type: Object, required: false },
    columnFiltersOptions: { type: Object, required: false },
    columnPinningOptions: { type: Object, required: false },
    columnSizingOptions: { type: Object, required: false },
    visibilityOptions: { type: Object, required: false },
    sortingOptions: { type: Object, required: false },
    groupingOptions: { type: Object, required: false },
    expandedOptions: { type: Object, required: false },
    rowSelectionOptions: { type: Object, required: false },
    rowPinningOptions: { type: Object, required: false },
    paginationOptions: { type: Object, required: false },
    facetedOptions: { type: Object, required: false },
    onSelect: { type: Function, required: false },
    onHover: { type: Function, required: false },
    onContextmenu: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    state: { type: Object, required: false },
    onStateChange: { type: Function, required: false },
    renderFallbackValue: { type: null, required: false },
    _features: { type: Array, required: false },
    autoResetAll: { type: Boolean, required: false },
    debugAll: { type: Boolean, required: false },
    debugCells: { type: Boolean, required: false },
    debugColumns: { type: Boolean, required: false },
    debugHeaders: { type: Boolean, required: false },
    debugRows: { type: Boolean, required: false },
    debugTable: { type: Boolean, required: false },
    defaultColumn: { type: Object, required: false },
    getRowId: { type: Function, required: false },
    getSubRows: { type: Function, required: false },
    initialState: { type: Object, required: false },
    mergeOptions: { type: Function, required: false }
  }, {
    "globalFilter": { type: String },
    "globalFilterModifiers": {},
    "columnFilters": { type: Array },
    "columnFiltersModifiers": {},
    "columnOrder": { type: Array },
    "columnOrderModifiers": {},
    "columnVisibility": { type: Object },
    "columnVisibilityModifiers": {},
    "columnPinning": { type: Object },
    "columnPinningModifiers": {},
    "columnSizing": { type: Object },
    "columnSizingModifiers": {},
    "columnSizingInfo": { type: Object },
    "columnSizingInfoModifiers": {},
    "rowSelection": { type: Object },
    "rowSelectionModifiers": {},
    "rowPinning": { type: Object },
    "rowPinningModifiers": {},
    "sorting": { type: Array },
    "sortingModifiers": {},
    "grouping": { type: Array },
    "groupingModifiers": {},
    "expanded": { type: [Boolean, Object] },
    "expandedModifiers": {},
    "pagination": { type: Object },
    "paginationModifiers": {}
  }),
  emits: ["update:globalFilter", "update:columnFilters", "update:columnOrder", "update:columnVisibility", "update:columnPinning", "update:columnSizing", "update:columnSizingInfo", "update:rowSelection", "update:rowPinning", "update:sorting", "update:grouping", "update:expanded", "update:pagination"],
  setup(__props, { expose: __expose }) {
    const props = __props;
    const slots = vueExports.useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const data = vueExports.ref(props.data ?? []);
    const meta = vueExports.computed(() => props.meta ?? {});
    const columns = vueExports.computed(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey) => ({ accessorKey, header: upperFirst(accessorKey) }))));
    function processColumns(columns2) {
      return columns2.map((column) => {
        const col = { ...column };
        if ("columns" in col && col.columns) {
          col.columns = processColumns(col.columns);
        }
        if (!col.cell) {
          col.cell = ({ getValue }) => {
            const value = getValue();
            if (value === "" || value === null || value === void 0) {
              return " ";
            }
            return String(value);
          };
        }
        return col;
      });
    }
    const ui = vueExports.computed(() => tv({ extend: tv(theme$2), ...appConfig.ui?.table || {} })({
      sticky: props.virtualize ? false : props.sticky,
      loading: props.loading,
      loadingColor: props.loadingColor,
      loadingAnimation: props.loadingAnimation,
      virtualize: !!props.virtualize
    }));
    const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate();
    const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate({
      props: {
        row: {
          type: Object,
          required: true
        },
        style: {
          type: Object,
          required: false
        }
      }
    });
    const hasFooter = vueExports.computed(() => {
      function hasFooterRecursive(columns2) {
        for (const column of columns2) {
          if ("footer" in column) {
            return true;
          }
          if ("columns" in column && hasFooterRecursive(column.columns)) {
            return true;
          }
        }
        return false;
      }
      return hasFooterRecursive(columns.value);
    });
    const globalFilterState = vueExports.useModel(__props, "globalFilter");
    const columnFiltersState = vueExports.useModel(__props, "columnFilters");
    const columnOrderState = vueExports.useModel(__props, "columnOrder");
    const columnVisibilityState = vueExports.useModel(__props, "columnVisibility");
    const columnPinningState = vueExports.useModel(__props, "columnPinning");
    const columnSizingState = vueExports.useModel(__props, "columnSizing");
    const columnSizingInfoState = vueExports.useModel(__props, "columnSizingInfo");
    const rowSelectionState = vueExports.useModel(__props, "rowSelection");
    const rowPinningState = vueExports.useModel(__props, "rowPinning");
    const sortingState = vueExports.useModel(__props, "sorting");
    const groupingState = vueExports.useModel(__props, "grouping");
    const expandedState = vueExports.useModel(__props, "expanded");
    const paginationState = vueExports.useModel(__props, "pagination");
    const rootRef = vueExports.useTemplateRef("rootRef");
    const tableRef = vueExports.useTemplateRef("tableRef");
    const tableProps = useForwardProps(reactivePick(props, "_features", "autoResetAll", "debugAll", "debugCells", "debugColumns", "debugHeaders", "debugRows", "debugTable", "defaultColumn", "getRowId", "getSubRows", "initialState", "mergeOptions", "renderFallbackValue"));
    const tableApi = useVueTable({
      ...tableProps.value,
      get data() {
        return data.value;
      },
      get columns() {
        return columns.value;
      },
      meta: meta.value,
      getCoreRowModel: getCoreRowModel(),
      ...props.globalFilterOptions || {},
      ...globalFilterState.value !== void 0 && { onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilterState) },
      ...props.columnFiltersOptions || {},
      getFilteredRowModel: getFilteredRowModel(),
      ...columnFiltersState.value !== void 0 && { onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFiltersState) },
      ...columnOrderState.value !== void 0 && { onColumnOrderChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnOrderState) },
      ...props.visibilityOptions || {},
      ...columnVisibilityState.value !== void 0 && { onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibilityState) },
      ...props.columnPinningOptions || {},
      ...columnPinningState.value !== void 0 && { onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnPinningState) },
      ...props.columnSizingOptions || {},
      ...columnSizingState.value !== void 0 && { onColumnSizingChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingState) },
      ...columnSizingInfoState.value !== void 0 && { onColumnSizingInfoChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingInfoState) },
      ...props.rowSelectionOptions || {},
      ...rowSelectionState.value !== void 0 && { onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelectionState) },
      ...props.rowPinningOptions || {},
      ...rowPinningState.value !== void 0 && { onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinningState) },
      ...props.sortingOptions || {},
      getSortedRowModel: getSortedRowModel(),
      ...sortingState.value !== void 0 && { onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sortingState) },
      ...props.groupingOptions || {},
      ...groupingState.value !== void 0 && { onGroupingChange: (updaterOrValue) => valueUpdater(updaterOrValue, groupingState) },
      ...props.expandedOptions || {},
      getExpandedRowModel: getExpandedRowModel(),
      ...expandedState.value !== void 0 && { onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expandedState) },
      ...props.paginationOptions || {},
      ...paginationState.value !== void 0 && { onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, paginationState) },
      ...props.facetedOptions || {},
      state: {
        get globalFilter() {
          return globalFilterState.value;
        },
        get columnFilters() {
          return columnFiltersState.value;
        },
        get columnOrder() {
          return columnOrderState.value;
        },
        get columnVisibility() {
          return columnVisibilityState.value;
        },
        get columnPinning() {
          return columnPinningState.value;
        },
        get expanded() {
          return expandedState.value;
        },
        get rowSelection() {
          return rowSelectionState.value;
        },
        get sorting() {
          return sortingState.value;
        },
        get grouping() {
          return groupingState.value;
        },
        get rowPinning() {
          return rowPinningState.value;
        },
        get columnSizing() {
          return columnSizingState.value;
        },
        get columnSizingInfo() {
          return columnSizingInfoState.value;
        },
        get pagination() {
          return paginationState.value;
        }
      }
    });
    const rows = vueExports.computed(() => tableApi.getRowModel().rows);
    const virtualizerProps = vueExports.toRef(() => defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
      estimateSize: 65,
      overscan: 12
    }));
    const virtualizer = !!props.virtualize && useVirtualizer({
      ...virtualizerProps.value,
      get count() {
        return rows.value.length;
      },
      getScrollElement: () => rootRef.value?.$el,
      estimateSize: (index) => {
        const estimate = virtualizerProps.value.estimateSize;
        return typeof estimate === "function" ? estimate(index) : estimate;
      }
    });
    const renderedSize = vueExports.computed(() => {
      if (!virtualizer) {
        return 0;
      }
      const virtualItems = virtualizer.value.getVirtualItems();
      if (!virtualItems?.length) {
        return 0;
      }
      return virtualItems.reduce((sum2, item) => sum2 + item.size, 0);
    });
    function valueUpdater(updaterOrValue, ref2) {
      ref2.value = typeof updaterOrValue === "function" ? updaterOrValue(ref2.value) : updaterOrValue;
    }
    function onRowSelect(e, row) {
      if (!props.onSelect) {
        return;
      }
      const target = e.target;
      const isInteractive = target.closest("button") || target.closest("a");
      if (isInteractive) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      props.onSelect(e, row);
    }
    function onRowHover(e, row) {
      if (!props.onHover) {
        return;
      }
      props.onHover(e, row);
    }
    function onRowContextmenu(e, row) {
      if (!props.onContextmenu) {
        return;
      }
      if (Array.isArray(props.onContextmenu)) {
        props.onContextmenu.forEach((fn) => fn(e, row));
      } else {
        props.onContextmenu(e, row);
      }
    }
    function resolveValue(prop, arg) {
      if (typeof prop === "function") {
        return prop(arg);
      }
      return prop;
    }
    function getColumnStyles(column) {
      const styles = {};
      const pinned = column.getIsPinned();
      if (pinned === "left") {
        styles.left = `${column.getStart("left")}px`;
      } else if (pinned === "right") {
        styles.right = `${column.getAfter("right")}px`;
      }
      return styles;
    }
    vueExports.watch(() => props.data, () => {
      data.value = props.data ? [...props.data] : [];
    }, props.watchOptions);
    __expose({
      get $el() {
        return rootRef.value?.$el;
      },
      tableRef,
      tableApi
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DefineRowTemplate), null, {
        default: vueExports.withCtx(({ row, style }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<tr${serverRenderer_cjs_prodExports.ssrRenderAttr("data-selected", row.getIsSelected())}${serverRenderer_cjs_prodExports.ssrRenderAttr("data-selectable", !!props.onSelect || !!props.onHover || !!props.onContextmenu)}${serverRenderer_cjs_prodExports.ssrRenderAttr("data-expanded", row.getIsExpanded())}${serverRenderer_cjs_prodExports.ssrRenderAttr("role", props.onSelect ? "button" : void 0)}${serverRenderer_cjs_prodExports.ssrRenderAttr("tabindex", props.onSelect ? 0 : void 0)} data-slot="tr" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.tr({
              class: [
                props.ui?.tr,
                resolveValue(vueExports.unref(tableApi).options.meta?.class?.tr, row)
              ]
            }))}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle([resolveValue(vueExports.unref(tableApi).options.meta?.style?.tr, row), style])}"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(row.getVisibleCells(), (cell) => {
              _push2(`<td${serverRenderer_cjs_prodExports.ssrRenderAttr("data-pinned", cell.column.getIsPinned())}${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", resolveValue(cell.column.columnDef.meta?.colspan?.td, cell))}${serverRenderer_cjs_prodExports.ssrRenderAttr("rowspan", resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell))} data-slot="td" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.td({
                class: [
                  props.ui?.td,
                  resolveValue(cell.column.columnDef.meta?.class?.td, cell)
                ],
                pinned: !!cell.column.getIsPinned()
              }))}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle([
                getColumnStyles(cell.column),
                resolveValue(cell.column.columnDef.meta?.style?.td, cell)
              ])}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, `${cell.column.id}-cell`, vueExports.mergeProps({ ref_for: true }, cell.getContext()), () => {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(FlexRender), {
                  render: cell.column.columnDef.cell,
                  props: cell.getContext()
                }, null, _parent2, _scopeId));
              }, _push2, _parent2, _scopeId);
              _push2(`</td>`);
            });
            _push2(`<!--]--></tr>`);
            if (row.getIsExpanded()) {
              _push2(`<tr data-slot="tr" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.tr({ class: [props.ui?.tr] }))}"${_scopeId}><td${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", row.getAllCells().length)} data-slot="td" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.td({ class: [props.ui?.td] }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "expanded", { row }, null, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode("tr", {
                "data-selected": row.getIsSelected(),
                "data-selectable": !!props.onSelect || !!props.onHover || !!props.onContextmenu,
                "data-expanded": row.getIsExpanded(),
                role: props.onSelect ? "button" : void 0,
                tabindex: props.onSelect ? 0 : void 0,
                "data-slot": "tr",
                class: ui.value.tr({
                  class: [
                    props.ui?.tr,
                    resolveValue(vueExports.unref(tableApi).options.meta?.class?.tr, row)
                  ]
                }),
                style: [resolveValue(vueExports.unref(tableApi).options.meta?.style?.tr, row), style],
                onClick: ($event) => onRowSelect($event, row),
                onPointerenter: ($event) => onRowHover($event, row),
                onPointerleave: ($event) => onRowHover($event, null),
                onContextmenu: ($event) => onRowContextmenu($event, row)
              }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.getVisibleCells(), (cell) => {
                  return vueExports.openBlock(), vueExports.createBlock("td", {
                    key: cell.id,
                    "data-pinned": cell.column.getIsPinned(),
                    colspan: resolveValue(cell.column.columnDef.meta?.colspan?.td, cell),
                    rowspan: resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell),
                    "data-slot": "td",
                    class: ui.value.td({
                      class: [
                        props.ui?.td,
                        resolveValue(cell.column.columnDef.meta?.class?.td, cell)
                      ],
                      pinned: !!cell.column.getIsPinned()
                    }),
                    style: [
                      getColumnStyles(cell.column),
                      resolveValue(cell.column.columnDef.meta?.style?.td, cell)
                    ]
                  }, [
                    vueExports.renderSlot(_ctx.$slots, `${cell.column.id}-cell`, vueExports.mergeProps({ ref_for: true }, cell.getContext()), () => [
                      vueExports.createVNode(vueExports.unref(FlexRender), {
                        render: cell.column.columnDef.cell,
                        props: cell.getContext()
                      }, null, 8, ["render", "props"])
                    ])
                  ], 14, ["data-pinned", "colspan", "rowspan"]);
                }), 128))
              ], 46, ["data-selected", "data-selectable", "data-expanded", "role", "tabindex", "onClick", "onPointerenter", "onPointerleave", "onContextmenu"]),
              row.getIsExpanded() ? (vueExports.openBlock(), vueExports.createBlock("tr", {
                key: 0,
                "data-slot": "tr",
                class: ui.value.tr({ class: [props.ui?.tr] })
              }, [
                vueExports.createVNode("td", {
                  colspan: row.getAllCells().length,
                  "data-slot": "td",
                  class: ui.value.td({ class: [props.ui?.td] })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "expanded", { row })
                ], 10, ["colspan"])
              ], 2)) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DefineTableTemplate), null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<table data-slot="base" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.base({ class: [props.ui?.base] }))}"${_scopeId}>`);
            if (__props.caption || !!slots.caption) {
              _push2(`<caption data-slot="caption" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.caption({ class: [props.ui?.caption] }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "caption", {}, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.caption)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</caption>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<thead data-slot="thead" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.thead({ class: [props.ui?.thead] }))}"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(tableApi).getHeaderGroups(), (headerGroup) => {
              _push2(`<tr data-slot="tr" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.tr({ class: [props.ui?.tr] }))}"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(headerGroup.headers, (header) => {
                _push2(`<th${serverRenderer_cjs_prodExports.ssrRenderAttr("data-pinned", header.column.getIsPinned())}${serverRenderer_cjs_prodExports.ssrRenderAttr("scope", header.colSpan > 1 ? "colgroup" : "col")}${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${serverRenderer_cjs_prodExports.ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} data-slot="th" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.th({
                  class: [
                    props.ui?.th,
                    resolveValue(header.column.columnDef.meta?.class?.th, header)
                  ],
                  pinned: !!header.column.getIsPinned()
                }))}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle([
                  getColumnStyles(header.column),
                  resolveValue(header.column.columnDef.meta?.style?.th, header)
                ])}"${_scopeId}>`);
                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, `${header.id}-header`, vueExports.mergeProps({ ref_for: true }, header.getContext()), () => {
                  if (!header.isPlaceholder) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(FlexRender), {
                      render: header.column.columnDef.header,
                      props: header.getContext()
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                }, _push2, _parent2, _scopeId);
                _push2(`</th>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]--><tr data-slot="separator" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.separator({ class: [props.ui?.separator] }))}"${_scopeId}></tr></thead><tbody data-slot="tbody" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.tbody({ class: [props.ui?.tbody] }))}"${_scopeId}>`);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "body-top", {}, null, _push2, _parent2, _scopeId);
            if (rows.value.length) {
              _push2(`<!--[-->`);
              if (vueExports.unref(virtualizer)) {
                _push2(`<!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(virtualizer).getVirtualItems(), (virtualRow, index) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ReuseRowTemplate), {
                    row: rows.value[virtualRow.index],
                    style: {
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                    }
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              } else {
                _push2(`<!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(rows.value, (row) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ReuseRowTemplate), {
                    key: row.id,
                    row
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              }
              _push2(`<!--]-->`);
            } else if (__props.loading && !!slots["loading"]) {
              _push2(`<tr${_scopeId}><td${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", vueExports.unref(tableApi).getAllLeafColumns().length)} data-slot="loading" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.loading({ class: props.ui?.loading }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "loading", {}, null, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            } else {
              _push2(`<tr${_scopeId}><td${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", vueExports.unref(tableApi).getAllLeafColumns().length)} data-slot="empty" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.empty({ class: props.ui?.empty }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.empty || vueExports.unref(t)("table.noData"))}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</td></tr>`);
            }
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "body-bottom", {}, null, _push2, _parent2, _scopeId);
            _push2(`</tbody>`);
            if (hasFooter.value) {
              _push2(`<tfoot data-slot="tfoot" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.tfoot({ class: [props.ui?.tfoot] }))}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(virtualizer) ? {
                transform: `translateY(${vueExports.unref(virtualizer).getTotalSize() - renderedSize.value}px)`
              } : void 0)}"${_scopeId}><tr data-slot="separator" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.separator({ class: [props.ui?.separator] }))}"${_scopeId}></tr><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(tableApi).getFooterGroups(), (footerGroup) => {
                _push2(`<tr data-slot="tr" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.tr({ class: [props.ui?.tr] }))}"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(footerGroup.headers, (header) => {
                  _push2(`<th${serverRenderer_cjs_prodExports.ssrRenderAttr("data-pinned", header.column.getIsPinned())}${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${serverRenderer_cjs_prodExports.ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} data-slot="th" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.th({
                    class: [
                      props.ui?.th,
                      resolveValue(header.column.columnDef.meta?.class?.th, header)
                    ],
                    pinned: !!header.column.getIsPinned()
                  }))}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle([
                    getColumnStyles(header.column),
                    resolveValue(header.column.columnDef.meta?.style?.th, header)
                  ])}"${_scopeId}>`);
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, `${header.id}-footer`, vueExports.mergeProps({ ref_for: true }, header.getContext()), () => {
                    if (!header.isPlaceholder) {
                      _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(FlexRender), {
                        render: header.column.columnDef.footer,
                        props: header.getContext()
                      }, null, _parent2, _scopeId));
                    } else {
                      _push2(`<!---->`);
                    }
                  }, _push2, _parent2, _scopeId);
                  _push2(`</th>`);
                });
                _push2(`<!--]--></tr>`);
              });
              _push2(`<!--]--></tfoot>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</table>`);
          } else {
            return [
              vueExports.createVNode("table", {
                ref_key: "tableRef",
                ref: tableRef,
                "data-slot": "base",
                class: ui.value.base({ class: [props.ui?.base] })
              }, [
                __props.caption || !!slots.caption ? (vueExports.openBlock(), vueExports.createBlock("caption", {
                  key: 0,
                  "data-slot": "caption",
                  class: ui.value.caption({ class: [props.ui?.caption] })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "caption", {}, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.caption), 1)
                  ])
                ], 2)) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("thead", {
                  "data-slot": "thead",
                  class: ui.value.thead({ class: [props.ui?.thead] })
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(tableApi).getHeaderGroups(), (headerGroup) => {
                    return vueExports.openBlock(), vueExports.createBlock("tr", {
                      key: headerGroup.id,
                      "data-slot": "tr",
                      class: ui.value.tr({ class: [props.ui?.tr] })
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(headerGroup.headers, (header) => {
                        return vueExports.openBlock(), vueExports.createBlock("th", {
                          key: header.id,
                          "data-pinned": header.column.getIsPinned(),
                          scope: header.colSpan > 1 ? "colgroup" : "col",
                          colspan: header.colSpan > 1 ? header.colSpan : void 0,
                          rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
                          "data-slot": "th",
                          class: ui.value.th({
                            class: [
                              props.ui?.th,
                              resolveValue(header.column.columnDef.meta?.class?.th, header)
                            ],
                            pinned: !!header.column.getIsPinned()
                          }),
                          style: [
                            getColumnStyles(header.column),
                            resolveValue(header.column.columnDef.meta?.style?.th, header)
                          ]
                        }, [
                          vueExports.renderSlot(_ctx.$slots, `${header.id}-header`, vueExports.mergeProps({ ref_for: true }, header.getContext()), () => [
                            !header.isPlaceholder ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(FlexRender), {
                              key: 0,
                              render: header.column.columnDef.header,
                              props: header.getContext()
                            }, null, 8, ["render", "props"])) : vueExports.createCommentVNode("", true)
                          ])
                        ], 14, ["data-pinned", "scope", "colspan", "rowspan"]);
                      }), 128))
                    ], 2);
                  }), 128)),
                  vueExports.createVNode("tr", {
                    "data-slot": "separator",
                    class: ui.value.separator({ class: [props.ui?.separator] })
                  }, null, 2)
                ], 2),
                vueExports.createVNode("tbody", {
                  "data-slot": "tbody",
                  class: ui.value.tbody({ class: [props.ui?.tbody] })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "body-top"),
                  rows.value.length ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                    vueExports.unref(virtualizer) ? (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, { key: 0 }, vueExports.renderList(vueExports.unref(virtualizer).getVirtualItems(), (virtualRow, index) => {
                      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(ReuseRowTemplate), {
                        key: rows.value[virtualRow.index]?.id,
                        row: rows.value[virtualRow.index],
                        style: {
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                        }
                      }, null, 8, ["row", "style"]);
                    }), 128)) : (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(rows.value, (row) => {
                      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(ReuseRowTemplate), {
                        key: row.id,
                        row
                      }, null, 8, ["row"]);
                    }), 128))
                  ], 64)) : __props.loading && !!slots["loading"] ? (vueExports.openBlock(), vueExports.createBlock("tr", { key: 1 }, [
                    vueExports.createVNode("td", {
                      colspan: vueExports.unref(tableApi).getAllLeafColumns().length,
                      "data-slot": "loading",
                      class: ui.value.loading({ class: props.ui?.loading })
                    }, [
                      vueExports.renderSlot(_ctx.$slots, "loading")
                    ], 10, ["colspan"])
                  ])) : (vueExports.openBlock(), vueExports.createBlock("tr", { key: 2 }, [
                    vueExports.createVNode("td", {
                      colspan: vueExports.unref(tableApi).getAllLeafColumns().length,
                      "data-slot": "empty",
                      class: ui.value.empty({ class: props.ui?.empty })
                    }, [
                      vueExports.renderSlot(_ctx.$slots, "empty", {}, () => [
                        vueExports.createTextVNode(vueExports.toDisplayString(__props.empty || vueExports.unref(t)("table.noData")), 1)
                      ])
                    ], 10, ["colspan"])
                  ])),
                  vueExports.renderSlot(_ctx.$slots, "body-bottom")
                ], 2),
                hasFooter.value ? (vueExports.openBlock(), vueExports.createBlock("tfoot", {
                  key: 1,
                  "data-slot": "tfoot",
                  class: ui.value.tfoot({ class: [props.ui?.tfoot] }),
                  style: vueExports.unref(virtualizer) ? {
                    transform: `translateY(${vueExports.unref(virtualizer).getTotalSize() - renderedSize.value}px)`
                  } : void 0
                }, [
                  vueExports.createVNode("tr", {
                    "data-slot": "separator",
                    class: ui.value.separator({ class: [props.ui?.separator] })
                  }, null, 2),
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(tableApi).getFooterGroups(), (footerGroup) => {
                    return vueExports.openBlock(), vueExports.createBlock("tr", {
                      key: footerGroup.id,
                      "data-slot": "tr",
                      class: ui.value.tr({ class: [props.ui?.tr] })
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(footerGroup.headers, (header) => {
                        return vueExports.openBlock(), vueExports.createBlock("th", {
                          key: header.id,
                          "data-pinned": header.column.getIsPinned(),
                          colspan: header.colSpan > 1 ? header.colSpan : void 0,
                          rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
                          "data-slot": "th",
                          class: ui.value.th({
                            class: [
                              props.ui?.th,
                              resolveValue(header.column.columnDef.meta?.class?.th, header)
                            ],
                            pinned: !!header.column.getIsPinned()
                          }),
                          style: [
                            getColumnStyles(header.column),
                            resolveValue(header.column.columnDef.meta?.style?.th, header)
                          ]
                        }, [
                          vueExports.renderSlot(_ctx.$slots, `${header.id}-footer`, vueExports.mergeProps({ ref_for: true }, header.getContext()), () => [
                            !header.isPlaceholder ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(FlexRender), {
                              key: 0,
                              render: header.column.columnDef.footer,
                              props: header.getContext()
                            }, null, 8, ["render", "props"])) : vueExports.createCommentVNode("", true)
                          ])
                        ], 14, ["data-pinned", "colspan", "rowspan"]);
                      }), 128))
                    ], 2);
                  }), 128))
                ], 6)) : vueExports.createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        ref_key: "rootRef",
        ref: rootRef,
        as: __props.as
      }, _ctx.$attrs, {
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(virtualizer)) {
              _push2(`<div style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
                height: `${vueExports.unref(virtualizer).getTotalSize()}px`
              })}"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ReuseTableTemplate), null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ReuseTableTemplate), null, null, _parent2, _scopeId));
            }
          } else {
            return [
              vueExports.unref(virtualizer) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                style: {
                  height: `${vueExports.unref(virtualizer).getTotalSize()}px`
                }
              }, [
                vueExports.createVNode(vueExports.unref(ReuseTableTemplate))
              ], 4)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(ReuseTableTemplate), { key: 1 }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Table.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const theme$1 = {
  "slots": {
    "root": "relative flex items-start",
    "base": [
      "inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-accented",
      "transition-[background] duration-200"
    ],
    "container": "flex items-center",
    "thumb": "group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center",
    "icon": [
      "absolute shrink-0 group-data-[state=unchecked]:text-dimmed opacity-0 size-10/12",
      "transition-[color,opacity] duration-200"
    ],
    "wrapper": "ms-2",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "data-[state=checked]:bg-primary focus-visible:outline-primary",
        "icon": "group-data-[state=checked]:text-primary"
      },
      "secondary": {
        "base": "data-[state=checked]:bg-secondary focus-visible:outline-secondary",
        "icon": "group-data-[state=checked]:text-secondary"
      },
      "success": {
        "base": "data-[state=checked]:bg-success focus-visible:outline-success",
        "icon": "group-data-[state=checked]:text-success"
      },
      "info": {
        "base": "data-[state=checked]:bg-info focus-visible:outline-info",
        "icon": "group-data-[state=checked]:text-info"
      },
      "warning": {
        "base": "data-[state=checked]:bg-warning focus-visible:outline-warning",
        "icon": "group-data-[state=checked]:text-warning"
      },
      "error": {
        "base": "data-[state=checked]:bg-error focus-visible:outline-error",
        "icon": "group-data-[state=checked]:text-error"
      },
      "neutral": {
        "base": "data-[state=checked]:bg-inverted focus-visible:outline-inverted",
        "icon": "group-data-[state=checked]:text-highlighted"
      }
    },
    "size": {
      "xs": {
        "base": "w-7",
        "container": "h-4",
        "thumb": "size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3",
        "wrapper": "text-xs"
      },
      "sm": {
        "base": "w-8",
        "container": "h-4",
        "thumb": "size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5",
        "wrapper": "text-xs"
      },
      "md": {
        "base": "w-9",
        "container": "h-5",
        "thumb": "size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4",
        "wrapper": "text-sm"
      },
      "lg": {
        "base": "w-10",
        "container": "h-5",
        "thumb": "size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5",
        "wrapper": "text-sm"
      },
      "xl": {
        "base": "w-11",
        "container": "h-6",
        "thumb": "size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5",
        "wrapper": "text-base"
      }
    },
    "checked": {
      "true": {
        "icon": "group-data-[state=checked]:opacity-100"
      }
    },
    "unchecked": {
      "true": {
        "icon": "group-data-[state=unchecked]:opacity-100"
      }
    },
    "loading": {
      "true": {
        "icon": "animate-spin"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    "disabled": {
      "true": {
        "root": "opacity-75",
        "base": "cursor-not-allowed",
        "label": "cursor-not-allowed",
        "description": "cursor-not-allowed"
      }
    }
  },
  "defaultVariants": {
    "color": "primary",
    "size": "md"
  }
};
const _sfc_main$4 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USwitch",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    as: { type: null, required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    checkedIcon: { type: null, required: false },
    uncheckedIcon: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    value: { type: String, required: false },
    defaultValue: { type: Boolean, required: false }
  }, {
    "modelValue": { type: Boolean, ...{ default: void 0 } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ vueExports.mergeModels(["change"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const slots = vueExports.useSlots();
    const emits = __emit;
    const modelValue = vueExports.useModel(__props, "modelValue", { type: Boolean, ...{ default: void 0 } });
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "required", "value", "defaultValue"));
    const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
    const id = _id.value ?? vueExports.useId();
    const ui = vueExports.computed(() => tv({ extend: tv(theme$1), ...appConfig.ui?.switch || {} })({
      size: size.value,
      color: color.value,
      required: props.required,
      loading: props.loading,
      disabled: disabled.value || props.loading
    }));
    function onUpdate(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        as: __props.as,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="container" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.container({ class: props.ui?.container }))}"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(SwitchRoot_default), vueExports.mergeProps({ id: vueExports.unref(id) }, { ...vueExports.unref(rootProps), ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
              modelValue: modelValue.value,
              "onUpdate:modelValue": [($event) => modelValue.value = $event, onUpdate],
              name: vueExports.unref(name),
              disabled: vueExports.unref(disabled) || __props.loading,
              "data-slot": "base",
              class: ui.value.base({ class: props.ui?.base })
            }), {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(SwitchThumb_default), {
                    "data-slot": "thumb",
                    class: ui.value.thumb({ class: props.ui?.thumb })
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.loading) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                            name: __props.loadingIcon || vueExports.unref(appConfig).ui.icons.loading,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!--[-->`);
                          if (__props.checkedIcon) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                              name: __props.checkedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: props.ui?.icon, checked: true })
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          if (__props.uncheckedIcon) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                              name: __props.uncheckedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<!--]-->`);
                        }
                      } else {
                        return [
                          __props.loading ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                            key: 0,
                            name: __props.loadingIcon || vueExports.unref(appConfig).ui.icons.loading,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                          }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            __props.checkedIcon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                              key: 0,
                              name: __props.checkedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: props.ui?.icon, checked: true })
                            }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true),
                            __props.uncheckedIcon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                              key: 1,
                              name: __props.uncheckedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                            }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(SwitchThumb_default), {
                      "data-slot": "thumb",
                      class: ui.value.thumb({ class: props.ui?.thumb })
                    }, {
                      default: vueExports.withCtx(() => [
                        __props.loading ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                          key: 0,
                          name: __props.loadingIcon || vueExports.unref(appConfig).ui.icons.loading,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                        }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                          __props.checkedIcon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                            key: 0,
                            name: __props.checkedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: props.ui?.icon, checked: true })
                          }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true),
                          __props.uncheckedIcon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                            key: 1,
                            name: __props.uncheckedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                          }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.label || !!slots.label || (__props.description || !!slots.description)) {
              _push2(`<div data-slot="wrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
              if (__props.label || !!slots.label) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Label_default), {
                  for: vueExports.unref(id),
                  "data-slot": "label",
                  class: ui.value.label({ class: props.ui?.label })
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "label", { label: __props.label }, () => {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        vueExports.renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                          vueExports.createTextVNode(vueExports.toDisplayString(__props.label), 1)
                        ])
                      ];
                    }
                  }),
                  _: 3
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (__props.description || !!slots.description) {
                _push2(`<p data-slot="description" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.description({ class: props.ui?.description }))}"${_scopeId}>`);
                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", { description: __props.description }, () => {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode("div", {
                "data-slot": "container",
                class: ui.value.container({ class: props.ui?.container })
              }, [
                vueExports.createVNode(vueExports.unref(SwitchRoot_default), vueExports.mergeProps({ id: vueExports.unref(id) }, { ...vueExports.unref(rootProps), ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
                  modelValue: modelValue.value,
                  "onUpdate:modelValue": [($event) => modelValue.value = $event, onUpdate],
                  name: vueExports.unref(name),
                  disabled: vueExports.unref(disabled) || __props.loading,
                  "data-slot": "base",
                  class: ui.value.base({ class: props.ui?.base })
                }), {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(vueExports.unref(SwitchThumb_default), {
                      "data-slot": "thumb",
                      class: ui.value.thumb({ class: props.ui?.thumb })
                    }, {
                      default: vueExports.withCtx(() => [
                        __props.loading ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                          key: 0,
                          name: __props.loadingIcon || vueExports.unref(appConfig).ui.icons.loading,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: props.ui?.icon, checked: true, unchecked: true })
                        }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                          __props.checkedIcon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                            key: 0,
                            name: __props.checkedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: props.ui?.icon, checked: true })
                          }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true),
                          __props.uncheckedIcon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                            key: 1,
                            name: __props.uncheckedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: props.ui?.icon, unchecked: true })
                          }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ]),
                  _: 1
                }, 16, ["id", "modelValue", "onUpdate:modelValue", "name", "disabled", "class"])
              ], 2),
              __props.label || !!slots.label || (__props.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                "data-slot": "wrapper",
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.label || !!slots.label ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Label_default), {
                  key: 0,
                  for: vueExports.unref(id),
                  "data-slot": "label",
                  class: ui.value.label({ class: props.ui?.label })
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.label), 1)
                    ])
                  ]),
                  _: 3
                }, 8, ["for", "class"])) : vueExports.createCommentVNode("", true),
                __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  "data-slot": "description",
                  class: ui.value.description({ class: props.ui?.description })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "description", { description: __props.description }, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                  ])
                ], 2)) : vueExports.createCommentVNode("", true)
              ], 2)) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Switch.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UColorModeSwitch",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    value: { type: String, required: false },
    defaultValue: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const { t } = useLocale();
    const colorMode = useColorMode();
    const appConfig = useAppConfig();
    const switchProps = useForwardProps(props);
    const isDark = vueExports.computed({
      get() {
        return colorMode.value === "dark";
      },
      set(_isDark) {
        colorMode.preference = _isDark ? "dark" : "light";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$2;
      if (!vueExports.unref(colorMode)?.forced) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, _attrs, {
          fallback: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$4, vueExports.mergeProps({
                "checked-icon": vueExports.unref(appConfig).ui.icons.dark,
                "unchecked-icon": vueExports.unref(appConfig).ui.icons.light
              }, {
                ...vueExports.unref(switchProps),
                "aria-label": isDark.value ? vueExports.unref(t)("colorMode.switchToLight") : vueExports.unref(t)("colorMode.switchToDark"),
                ..._ctx.$attrs
              }, { disabled: "" }), null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_sfc_main$4, vueExports.mergeProps({
                  "checked-icon": vueExports.unref(appConfig).ui.icons.dark,
                  "unchecked-icon": vueExports.unref(appConfig).ui.icons.light
                }, {
                  ...vueExports.unref(switchProps),
                  "aria-label": isDark.value ? vueExports.unref(t)("colorMode.switchToLight") : vueExports.unref(t)("colorMode.switchToDark"),
                  ..._ctx.$attrs
                }, { disabled: "" }), null, 16, ["checked-icon", "unchecked-icon"])
              ];
            }
          })
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/color-mode/ColorModeSwitch.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectTable",
  __ssrInlineRender: true,
  props: {
    projects: {}
  },
  emits: ["edit", "delete", "reorder", "openSettings"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const UButton = _sfc_main$9;
    const localProjects = vueExports.ref([]);
    vueExports.watch(() => props.projects, (val) => {
      localProjects.value = [...val];
    }, { immediate: true });
    useSortable(".project-table-tbody", localProjects, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: () => {
        emit("reorder", [...localProjects.value]);
      }
    });
    const columns = [
      {
        id: "drag",
        enableSorting: false,
        enableHiding: false,
        meta: {
          class: {
            th: "w-10",
            td: "w-10"
          }
        },
        cell: () => vueExports.h("div", {
          class: "drag-handle text-muted hover:text-toned flex cursor-grab items-center justify-center py-2 transition-colors active:cursor-grabbing"
        }, [
          vueExports.h(_sfc_main$f, {
            name: "i-ph-dots-six-vertical",
            class: "size-5"
          })
        ])
      },
      {
        id: "thumbnail",
        header: "Image",
        enableSorting: false,
        meta: {
          class: {
            th: "w-20",
            td: "w-20"
          }
        },
        cell: ({ row }) => {
          if (row.original.Images && row.original.Images.length > 0) {
            return vueExports.h("div", { class: "bg-elevated relative size-12 overflow-hidden" }, [
              vueExports.h("img", {
                src: getImageUrl(row.original, row.original.Images[0]),
                alt: row.original.Title,
                class: "size-full object-cover"
              })
            ]);
          }
          return vueExports.h("div", { class: "bg-elevated flex size-12 items-center justify-center" }, [
            vueExports.h("span", { class: "text-dimmed text-xs" }, "–")
          ]);
        }
      },
      {
        id: "images",
        header: "Images",
        enableSorting: false,
        meta: {
          class: {
            th: "w-20 text-center",
            td: "w-20 text-center"
          }
        },
        cell: ({ row }) => vueExports.h(_sfc_main$6, {
          color: "neutral",
          variant: "subtle",
          size: "sm"
        }, () => `${row.original.Images?.length || 0}`)
      },
      {
        accessorKey: "Title",
        header: "Title",
        cell: ({ row }) => vueExports.h("span", { class: "text-highlighted font-medium" }, row.original.Title)
      },
      {
        id: "responsibilities",
        header: "Responsibilities",
        enableSorting: false,
        meta: {
          class: {
            td: "max-w-xs"
          }
        },
        cell: ({ row }) => {
          const responsibilities = row.original.Responsibility_json || row.original.Responsibility || [];
          if (responsibilities.length === 0)
            return vueExports.h("span", { class: "text-dimmed text-xs" }, "–");
          return vueExports.h("div", { class: "flex flex-wrap gap-1" }, responsibilities.map((resp) => vueExports.h("span", {
            class: "bg-elevated border-default text-toned border px-1 py-0 text-[10px] font-medium tracking-wide uppercase"
          }, resp)));
        }
      },
      {
        id: "edit",
        enableSorting: false,
        enableHiding: false,
        meta: {
          class: {
            th: "w-20",
            td: "w-20"
          }
        },
        cell: ({ row }) => vueExports.h(_sfc_main$9, {
          variant: "outline",
          color: "neutral",
          size: "sm",
          class: "text-xs tracking-wide uppercase",
          onClick: () => emit("edit", row.original)
        }, () => "Edit")
      },
      {
        id: "delete",
        enableSorting: false,
        enableHiding: false,
        meta: {
          class: {
            th: "w-24",
            td: "w-24"
          }
        },
        cell: ({ row }) => vueExports.h(_sfc_main$9, {
          color: "error",
          variant: "soft",
          size: "sm",
          class: "text-xs tracking-wide uppercase",
          onClick: () => emit("delete", row.original.id)
        }, () => "Delete")
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UTable = _sfc_main$5;
      const _component_UColorModeSwitch = _sfc_main$3;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "border-default border" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(localProjects),
        columns,
        sticky: "",
        ui: {
          root: "border-0 max-h-96",
          tbody: "project-table-tbody",
          tr: "hover:bg-elevated/50 transition-colors"
        },
        class: "flex-1"
      }, null, _parent));
      _push(`<div class="border-default flex items-center justify-between border-t px-4 py-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(UButton), {
        to: "/",
        variant: "ghost",
        color: "neutral",
        size: "sm",
        class: "text-xs tracking-wide uppercase"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View Portfolio `);
          } else {
            return [
              vueExports.createTextVNode(" View Portfolio ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(UButton), {
        variant: "ghost",
        color: "neutral",
        size: "sm",
        icon: "i-ph-gear",
        "aria-label": "Settings",
        onClick: ($event) => emit("openSettings")
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UColorModeSwitch, null, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/components/ProjectTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$2, { __name: "ProjectTable" });
const theme = {
  "slots": {
    "overlay": "fixed inset-0",
    "content": "bg-default divide-y divide-default flex flex-col focus:outline-none",
    "header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-16",
    "wrapper": "",
    "body": "flex-1 p-4 sm:p-6",
    "footer": "flex items-center gap-1.5 p-4 sm:px-6",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "close": "absolute top-4 end-4"
  },
  "variants": {
    "transition": {
      "true": {
        "overlay": "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
        "content": "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]"
      }
    },
    "fullscreen": {
      "true": {
        "content": "inset-0"
      },
      "false": {
        "content": "w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default"
      }
    },
    "overlay": {
      "true": {
        "overlay": "bg-elevated/75"
      }
    },
    "scrollable": {
      "true": {
        "overlay": "overflow-y-auto",
        "content": "relative"
      },
      "false": {
        "content": "fixed",
        "body": "overflow-y-auto"
      }
    }
  },
  "compoundVariants": [
    {
      "scrollable": true,
      "fullscreen": false,
      "class": {
        "overlay": "grid place-items-center p-4 sm:py-8"
      }
    },
    {
      "scrollable": false,
      "fullscreen": false,
      "class": {
        "content": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden"
      }
    }
  ]
};
const _sfc_main$1 = {
  __name: "UModal",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: false },
    description: { type: String, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    scrollable: { type: Boolean, required: false },
    transition: { type: Boolean, required: false, default: true },
    fullscreen: { type: Boolean, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    close: { type: [Boolean, Object], required: false, default: true },
    closeIcon: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    modal: { type: Boolean, required: false, default: true }
  },
  emits: ["after:leave", "after:enter", "close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "modal"), emits);
    const portalProps = usePortal(vueExports.toRef(() => props.portal));
    const contentProps = vueExports.toRef(() => props.content);
    const contentEvents = vueExports.computed(() => {
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      if (props.scrollable) {
        return {
          // FIXME: This is a workaround to prevent the modal from closing when clicking on the scrollbar https://reka-ui.com/docs/components/dialog#scrollable-overlay but it's not working on Mac OS.
          pointerDownOutside: (e) => {
            const originalEvent = e.detail.originalEvent;
            const target = originalEvent.target;
            if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
              e.preventDefault();
            }
          }
        };
      }
      return {};
    });
    const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.modal || {} })({
      transition: props.transition,
      fullscreen: props.fullscreen,
      overlay: props.overlay,
      scrollable: props.scrollable
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogRoot_default), vueExports.mergeProps(vueExports.unref(rootProps), _attrs), {
        default: vueExports.withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DefineContentTemplate), null, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogContent_default), vueExports.mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, {
                    onAfterEnter: ($event) => emits("after:enter"),
                    onAfterLeave: ($event) => emits("after:leave")
                  }, vueExports.toHandlers(contentEvents.value)), {
                    default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description))) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(VisuallyHidden_default), null, {
                            default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.title || !!slots.title) {
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogTitle_default), null, {
                                    default: vueExports.withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                          _push6(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                            vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.description || !!slots.description) {
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogDescription_default), null, {
                                    default: vueExports.withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                          _push6(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                            vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), { key: 0 }, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                        vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : vueExports.createCommentVNode("", true),
                                  __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), { key: 1 }, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                        vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : vueExports.createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "content", { close }, () => {
                          if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close)) {
                            _push4(`<div data-slot="header" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId3}>`);
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "header", { close }, () => {
                              _push4(`<div data-slot="wrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId3}>`);
                              if (__props.title || !!slots.title) {
                                _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogTitle_default), {
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                        _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                          vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              if (__props.description || !!slots.description) {
                                _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogDescription_default), {
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                        _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                          vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              _push4(`</div>`);
                              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push4, _parent4, _scopeId3);
                              if (props.close || !!slots.close) {
                                _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogClose_default), { "as-child": "" }, {
                                  default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                                        if (props.close) {
                                          _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$9, vueExports.mergeProps({
                                            icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": vueExports.unref(t)("modal.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            "data-slot": "close",
                                            class: ui.value.close({ class: props.ui?.close })
                                          }), null, _parent5, _scopeId4));
                                        } else {
                                          _push5(`<!---->`);
                                        }
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        vueExports.renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                          props.close ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                                            key: 0,
                                            icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": vueExports.unref(t)("modal.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            "data-slot": "close",
                                            class: ui.value.close({ class: props.ui?.close })
                                          }), null, 16, ["icon", "aria-label", "class"])) : vueExports.createCommentVNode("", true)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                            }, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.body) {
                            _push4(`<div data-slot="body" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.body({ class: props.ui?.body }))}"${_scopeId3}>`);
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "body", { close }, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.footer) {
                            _push4(`<div data-slot="footer" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.footer({ class: props.ui?.footer }))}"${_scopeId3}>`);
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "footer", { close }, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { key: 0 }, {
                            default: vueExports.withCtx(() => [
                              __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), { key: 0 }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                    vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : vueExports.createCommentVNode("", true),
                              __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), { key: 1 }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                    vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : vueExports.createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : vueExports.createCommentVNode("", true),
                          vueExports.renderSlot(_ctx.$slots, "content", { close }, () => [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 0,
                              "data-slot": "header",
                              class: ui.value.header({ class: props.ui?.header })
                            }, [
                              vueExports.renderSlot(_ctx.$slots, "header", { close }, () => [
                                vueExports.createVNode("div", {
                                  "data-slot": "wrapper",
                                  class: ui.value.wrapper({ class: props.ui?.wrapper })
                                }, [
                                  __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), {
                                    key: 0,
                                    "data-slot": "title",
                                    class: ui.value.title({ class: props.ui?.title })
                                  }, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                        vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : vueExports.createCommentVNode("", true),
                                  __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), {
                                    key: 1,
                                    "data-slot": "description",
                                    class: ui.value.description({ class: props.ui?.description })
                                  }, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                        vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : vueExports.createCommentVNode("", true)
                                ], 2),
                                vueExports.renderSlot(_ctx.$slots, "actions"),
                                props.close || !!slots.close ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogClose_default), {
                                  key: 0,
                                  "as-child": ""
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                      props.close ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                                        key: 0,
                                        icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                                        color: "neutral",
                                        variant: "ghost",
                                        "aria-label": vueExports.unref(t)("modal.close")
                                      }, typeof props.close === "object" ? props.close : {}, {
                                        "data-slot": "close",
                                        class: ui.value.close({ class: props.ui?.close })
                                      }), null, 16, ["icon", "aria-label", "class"])) : vueExports.createCommentVNode("", true)
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)) : vueExports.createCommentVNode("", true)
                              ])
                            ], 2)) : vueExports.createCommentVNode("", true),
                            !!slots.body ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 1,
                              "data-slot": "body",
                              class: ui.value.body({ class: props.ui?.body })
                            }, [
                              vueExports.renderSlot(_ctx.$slots, "body", { close })
                            ], 2)) : vueExports.createCommentVNode("", true),
                            !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 2,
                              "data-slot": "footer",
                              class: ui.value.footer({ class: props.ui?.footer })
                            }, [
                              vueExports.renderSlot(_ctx.$slots, "footer", { close })
                            ], 2)) : vueExports.createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(DialogContent_default), vueExports.mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, contentProps.value, {
                      onAfterEnter: ($event) => emits("after:enter"),
                      onAfterLeave: ($event) => emits("after:leave")
                    }, vueExports.toHandlers(contentEvents.value)), {
                      default: vueExports.withCtx(() => [
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { key: 0 }, {
                          default: vueExports.withCtx(() => [
                            __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), { key: 0 }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                  vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                ])
                              ]),
                              _: 3
                            })) : vueExports.createCommentVNode("", true),
                            __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), { key: 1 }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                  vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                ])
                              ]),
                              _: 3
                            })) : vueExports.createCommentVNode("", true)
                          ]),
                          _: 3
                        })) : vueExports.createCommentVNode("", true),
                        vueExports.renderSlot(_ctx.$slots, "content", { close }, () => [
                          !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            "data-slot": "header",
                            class: ui.value.header({ class: props.ui?.header })
                          }, [
                            vueExports.renderSlot(_ctx.$slots, "header", { close }, () => [
                              vueExports.createVNode("div", {
                                "data-slot": "wrapper",
                                class: ui.value.wrapper({ class: props.ui?.wrapper })
                              }, [
                                __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), {
                                  key: 0,
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                      vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : vueExports.createCommentVNode("", true),
                                __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), {
                                  key: 1,
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                      vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : vueExports.createCommentVNode("", true)
                              ], 2),
                              vueExports.renderSlot(_ctx.$slots, "actions"),
                              props.close || !!slots.close ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogClose_default), {
                                key: 0,
                                "as-child": ""
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                    props.close ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                                      key: 0,
                                      icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                                      color: "neutral",
                                      variant: "ghost",
                                      "aria-label": vueExports.unref(t)("modal.close")
                                    }, typeof props.close === "object" ? props.close : {}, {
                                      "data-slot": "close",
                                      class: ui.value.close({ class: props.ui?.close })
                                    }), null, 16, ["icon", "aria-label", "class"])) : vueExports.createCommentVNode("", true)
                                  ])
                                ]),
                                _: 2
                              }, 1024)) : vueExports.createCommentVNode("", true)
                            ])
                          ], 2)) : vueExports.createCommentVNode("", true),
                          !!slots.body ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 1,
                            "data-slot": "body",
                            class: ui.value.body({ class: props.ui?.body })
                          }, [
                            vueExports.renderSlot(_ctx.$slots, "body", { close })
                          ], 2)) : vueExports.createCommentVNode("", true),
                          !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 2,
                            "data-slot": "footer",
                            class: ui.value.footer({ class: props.ui?.footer })
                          }, [
                            vueExports.renderSlot(_ctx.$slots, "footer", { close })
                          ], 2)) : vueExports.createCommentVNode("", true)
                        ])
                      ]),
                      _: 2
                    }, 1040, ["class", "onAfterEnter", "onAfterLeave"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            if (!!slots.default) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogTrigger_default), {
                "as-child": "",
                class: props.class
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogPortal_default), vueExports.unref(portalProps), {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.scrollable) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogOverlay_default), {
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ReuseContentTemplate), null, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(vueExports.unref(ReuseContentTemplate))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!--[-->`);
                    if (__props.overlay) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogOverlay_default), {
                        "data-slot": "overlay",
                        class: ui.value.overlay({ class: props.ui?.overlay })
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ReuseContentTemplate), null, null, _parent3, _scopeId2));
                    _push3(`<!--]-->`);
                  }
                } else {
                  return [
                    __props.scrollable ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogOverlay_default), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(vueExports.unref(ReuseContentTemplate))
                      ]),
                      _: 1
                    }, 8, ["class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                      __props.overlay ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogOverlay_default), {
                        key: 0,
                        "data-slot": "overlay",
                        class: ui.value.overlay({ class: props.ui?.overlay })
                      }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode(vueExports.unref(ReuseContentTemplate))
                    ], 64))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(vueExports.unref(DefineContentTemplate), null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(vueExports.unref(DialogContent_default), vueExports.mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, {
                    onAfterEnter: ($event) => emits("after:enter"),
                    onAfterLeave: ($event) => emits("after:leave")
                  }, vueExports.toHandlers(contentEvents.value)), {
                    default: vueExports.withCtx(() => [
                      !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { key: 0 }, {
                        default: vueExports.withCtx(() => [
                          __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), { key: 0 }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                              ])
                            ]),
                            _: 3
                          })) : vueExports.createCommentVNode("", true),
                          __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), { key: 1 }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                              ])
                            ]),
                            _: 3
                          })) : vueExports.createCommentVNode("", true)
                        ]),
                        _: 3
                      })) : vueExports.createCommentVNode("", true),
                      vueExports.renderSlot(_ctx.$slots, "content", { close }, () => [
                        !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          "data-slot": "header",
                          class: ui.value.header({ class: props.ui?.header })
                        }, [
                          vueExports.renderSlot(_ctx.$slots, "header", { close }, () => [
                            vueExports.createVNode("div", {
                              "data-slot": "wrapper",
                              class: ui.value.wrapper({ class: props.ui?.wrapper })
                            }, [
                              __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTitle_default), {
                                key: 0,
                                "data-slot": "title",
                                class: ui.value.title({ class: props.ui?.title })
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                                    vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : vueExports.createCommentVNode("", true),
                              __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogDescription_default), {
                                key: 1,
                                "data-slot": "description",
                                class: ui.value.description({ class: props.ui?.description })
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                                    vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : vueExports.createCommentVNode("", true)
                            ], 2),
                            vueExports.renderSlot(_ctx.$slots, "actions"),
                            props.close || !!slots.close ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogClose_default), {
                              key: 0,
                              "as-child": ""
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                  props.close ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$9, vueExports.mergeProps({
                                    key: 0,
                                    icon: __props.closeIcon || vueExports.unref(appConfig).ui.icons.close,
                                    color: "neutral",
                                    variant: "ghost",
                                    "aria-label": vueExports.unref(t)("modal.close")
                                  }, typeof props.close === "object" ? props.close : {}, {
                                    "data-slot": "close",
                                    class: ui.value.close({ class: props.ui?.close })
                                  }), null, 16, ["icon", "aria-label", "class"])) : vueExports.createCommentVNode("", true)
                                ])
                              ]),
                              _: 2
                            }, 1024)) : vueExports.createCommentVNode("", true)
                          ])
                        ], 2)) : vueExports.createCommentVNode("", true),
                        !!slots.body ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 1,
                          "data-slot": "body",
                          class: ui.value.body({ class: props.ui?.body })
                        }, [
                          vueExports.renderSlot(_ctx.$slots, "body", { close })
                        ], 2)) : vueExports.createCommentVNode("", true),
                        !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 2,
                          "data-slot": "footer",
                          class: ui.value.footer({ class: props.ui?.footer })
                        }, [
                          vueExports.renderSlot(_ctx.$slots, "footer", { close })
                        ], 2)) : vueExports.createCommentVNode("", true)
                      ])
                    ]),
                    _: 2
                  }, 1040, ["class", "onAfterEnter", "onAfterLeave"])
                ]),
                _: 2
              }, 1024),
              !!slots.default ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTrigger_default), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["class"])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(vueExports.unref(DialogPortal_default), vueExports.unref(portalProps), {
                default: vueExports.withCtx(() => [
                  __props.scrollable ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogOverlay_default), {
                    key: 0,
                    "data-slot": "overlay",
                    class: ui.value.overlay({ class: props.ui?.overlay })
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(vueExports.unref(ReuseContentTemplate))
                    ]),
                    _: 1
                  }, 8, ["class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                    __props.overlay ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogOverlay_default), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(vueExports.unref(ReuseContentTemplate))
                  ], 64))
                ]),
                _: 1
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useAppToast() {
  const toast = useToast();
  const toasts = vueExports.ref([]);
  const showToast = (message, type) => {
    const id = Date.now().toString();
    toasts.value.push({ id, message, type });
    toast.add({
      title: message,
      color: type === "success" ? "success" : "error",
      icon: type === "success" ? "i-lucide-check-circle" : "i-lucide-alert-circle"
    });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 5e3);
  };
  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };
  return {
    toasts,
    showToast,
    removeToast
  };
}
const __nuxt_component_4_lazy = vueExports.defineAsyncComponent(() => import('./ProjectEditor-DZA9WR2l.mjs').then((c) => c.default || c));
const __nuxt_component_5_lazy = vueExports.defineAsyncComponent(() => import('./SettingsSidebar-DB8pCgbn.mjs').then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { showToast } = useAppToast();
    const editingProject = vueExports.ref(null);
    const showNewProjectForm = vueExports.ref(false);
    const showSettings = vueExports.ref(false);
    const isDeleteModalOpen = vueExports.ref(false);
    const projectToDelete = vueExports.ref(null);
    const { data: rawProjects, refresh: refreshProjects, status: projectsStatus, error: projectsError } = useAsyncData(
      "admin-projects",
      () => pb.collection("Portfolio_Projects").getFullList({ sort: "Order", requestKey: null })
    );
    const projects = vueExports.ref([]);
    vueExports.watch(rawProjects, (val) => {
      if (val)
        projects.value = [...val];
    }, { immediate: true });
    const loading = vueExports.computed(() => projectsStatus.value === "pending");
    const error = vueExports.computed(() => projectsError.value ? "Failed to load projects" : null);
    vueExports.watch(projectsError, (err) => {
      if (err) {
        const status = err?.status || err?.data?.status;
        if (status === 401 || status === 403) {
          pb.authStore.clear();
          navigateTo("/admin");
        }
      }
    });
    function handleLogout() {
      pb.authStore.clear();
      navigateTo("/");
    }
    function handleDelete(projectId) {
      projectToDelete.value = projectId;
      isDeleteModalOpen.value = true;
    }
    async function confirmDelete() {
      if (!projectToDelete.value)
        return;
      try {
        await pb.collection("Portfolio_Projects").delete(projectToDelete.value);
        isDeleteModalOpen.value = false;
        projectToDelete.value = null;
        await refreshProjects();
        showToast("Project deleted successfully", "success");
      } catch (err) {
        const typedErr = err;
        if (typedErr?.status === 401 || typedErr?.status === 403) {
          pb.authStore.clear();
          navigateTo("/admin");
          return;
        }
        showToast(`Failed to delete project: ${typedErr?.data?.message || typedErr?.message || "Unknown error"}`, "error");
        isDeleteModalOpen.value = false;
        projectToDelete.value = null;
      }
    }
    async function handleSave() {
      const isCreating = showNewProjectForm.value;
      editingProject.value = null;
      showNewProjectForm.value = false;
      await refreshProjects();
      showToast(isCreating ? "Project created successfully" : "Project updated successfully", "success");
    }
    function handleReorder(reorderedProjects) {
      projects.value = reorderedProjects;
    }
    async function handlePublishChanges() {
      try {
        for (const [index, project] of projects.value.entries()) {
          await pb.collection("Portfolio_Projects").update(project.id, { Order: index + 1 });
        }
        showToast("Changes published successfully!", "success");
      } catch (err) {
        const typedErr = err;
        showToast(`Failed to publish: ${typedErr?.data?.message || typedErr?.message || "Unknown error"}`, "error");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UAlert = _sfc_main$8;
      const _component_HeroAdmin = __nuxt_component_2;
      const _component_ProjectTable = __nuxt_component_3;
      const _component_LazyProjectEditor = __nuxt_component_4_lazy;
      const _component_LazySettingsSidebar = __nuxt_component_5_lazy;
      const _component_UModal = _sfc_main$1;
      if (vueExports.unref(loading)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-default flex min-h-screen items-center justify-center" }, _attrs))} data-v-7703edf9><div class="text-highlighted text-xl" data-v-7703edf9> Loading... </div></div>`);
      } else {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "admin-container bg-default min-h-screen" }, _attrs))} data-v-7703edf9><header class="border-default bg-default/80 sticky top-0 z-10 border-b backdrop-blur-sm" data-v-7703edf9><div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8" data-v-7703edf9><div data-v-7703edf9><h1 class="text-highlighted text-xl font-medium tracking-tight" data-v-7703edf9> Portfolio </h1><p class="text-muted mt-1 text-xs tracking-wide" data-v-7703edf9>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(projects).length)} ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(projects).length === 1 ? "project" : "projects")}</p></div><div class="flex items-center gap-3" data-v-7703edf9>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          variant: "outline",
          color: "neutral",
          size: "sm",
          icon: "i-ph-plus",
          class: "text-xs tracking-wide uppercase",
          onClick: ($event) => showNewProjectForm.value = true
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` New Project `);
            } else {
              return [
                vueExports.createTextVNode(" New Project ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          variant: "outline",
          color: "neutral",
          size: "sm",
          icon: "i-ph-cloud-arrow-up",
          class: "text-xs tracking-wide uppercase",
          onClick: handlePublishChanges
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Publish Changes `);
            } else {
              return [
                vueExports.createTextVNode(" Publish Changes ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          variant: "outline",
          color: "neutral",
          size: "sm",
          class: "text-xs tracking-wide uppercase",
          onClick: handleLogout
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Logout `);
            } else {
              return [
                vueExports.createTextVNode(" Logout ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></header><main class="mx-auto max-w-7xl px-6 py-12 lg:px-8" data-v-7703edf9>`);
        if (vueExports.unref(error)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "soft",
            title: vueExports.unref(error),
            icon: "i-ph-warning-circle",
            class: "mb-8"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_HeroAdmin, {
          onShowToast: (msg, type) => vueExports.unref(showToast)(msg, type)
        }, null, _parent));
        _push(`<div class="border-default mb-12 border-t" data-v-7703edf9></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectTable, {
          projects: vueExports.unref(projects),
          onEdit: ($event) => editingProject.value = $event,
          onDelete: handleDelete,
          onReorder: handleReorder,
          onOpenSettings: ($event) => showSettings.value = true
        }, null, _parent));
        _push(`</main>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LazyProjectEditor, {
          project: vueExports.unref(editingProject),
          "is-open": !!vueExports.unref(editingProject) || vueExports.unref(showNewProjectForm),
          onSave: handleSave,
          onCancel: ($event) => {
            editingProject.value = null;
            showNewProjectForm.value = false;
          },
          onShowToast: (msg, type) => vueExports.unref(showToast)(msg, type)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LazySettingsSidebar, {
          "is-open": vueExports.unref(showSettings),
          onClose: ($event) => showSettings.value = false,
          onShowToast: (msg, type) => vueExports.unref(showToast)(msg, type)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
          open: vueExports.unref(isDeleteModalOpen),
          "onUpdate:open": ($event) => vueExports.isRef(isDeleteModalOpen) ? isDeleteModalOpen.value = $event : null,
          title: "Delete Project"
        }, {
          body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="text-muted text-sm" data-v-7703edf9${_scopeId}> Are you sure you want to delete this project? This action cannot be undone. </p>`);
            } else {
              return [
                vueExports.createVNode("p", { class: "text-muted text-sm" }, " Are you sure you want to delete this project? This action cannot be undone. ")
              ];
            }
          }),
          footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                variant: "outline",
                color: "neutral",
                class: "flex-1 text-sm tracking-wide uppercase",
                onClick: ($event) => isDeleteModalOpen.value = false
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Cancel `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Cancel ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "error",
                class: "flex-1 text-sm tracking-wide uppercase",
                onClick: confirmDelete
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Delete `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Delete ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  variant: "outline",
                  color: "neutral",
                  class: "flex-1 text-sm tracking-wide uppercase",
                  onClick: ($event) => isDeleteModalOpen.value = false
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Cancel ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "error",
                  class: "flex-1 text-sm tracking-wide uppercase",
                  onClick: confirmDelete
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Delete ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../layers/2.admin/app/pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7703edf9"]]);
const dashboard$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard
}, Symbol.toStringTag, { value: "Module" }));

export { DialogRoot_default as D, VisuallyHiddenInput_default as V, _sfc_main$4 as _, useId as a, DialogOverlay_default as b, DialogContent_default as c, DialogTrigger_default as d, DialogPortal_default as e, DialogTitle_default as f, DialogDescription_default as g, dashboard$1 as h, useFormControl as u };
//# sourceMappingURL=dashboard-Co8oTG6T.mjs.map
