import { v as vueExports, a4 as isDef, $ as toArray, a0 as watchImmediate, a6 as isObject, a1 as notNullish, X as noop, a2 as tryOnScopeDispose, a7 as useThrottleFn, Y as tryOnMounted, a3 as makeDestructurable, Z as toRef, a5 as camelize, e as useDebounceFn } from './server.mjs';

// @__NO_SIDE_EFFECTS__
function createReusableTemplate(options = {}) {
  const { inheritAttrs = true } = options;
  const render = vueExports.shallowRef();
  const define = vueExports.defineComponent({ setup(_, { slots }) {
    return () => {
      render.value = slots.default;
    };
  } });
  const reuse = vueExports.defineComponent({
    inheritAttrs,
    props: options.props,
    setup(props, { attrs, slots }) {
      return () => {
        var _render$value;
        if (!render.value && true) throw new Error("[VueUse] Failed to find the definition of reusable template");
        const vnode = (_render$value = render.value) === null || _render$value === void 0 ? void 0 : _render$value.call(render, {
          ...options.props == null ? keysToCamelKebabCase(attrs) : props,
          $slots: slots
        });
        return inheritAttrs && (vnode === null || vnode === void 0 ? void 0 : vnode.length) === 1 ? vnode[0] : vnode;
      };
    }
  });
  return makeDestructurable({
    define,
    reuse
  }, [define, reuse]);
}
function keysToCamelKebabCase(obj) {
  const newObj = {};
  for (const key in obj) newObj[camelize(key)] = obj[key];
  return newObj;
}
const defaultWindow = void 0;
function unrefElement(elRef) {
  var _$el;
  const plain = vueExports.toValue(elRef);
  return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = vueExports.computed(() => {
    const test = toArray(vueExports.toValue(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  return watchImmediate(() => {
    var _firstParamTargets$va, _firstParamTargets$va2;
    return [
      (_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
      toArray(vueExports.toValue(firstParamTargets.value ? args[1] : args[0])),
      toArray(vueExports.unref(firstParamTargets.value ? args[2] : args[1])),
      vueExports.toValue(firstParamTargets.value ? args[3] : args[2])
    ];
  }, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
    if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
    const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
    const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
    onCleanup(() => {
      cleanups.forEach((fn) => fn());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
  const isMounted = vueExports.shallowRef(false);
  vueExports.getCurrentInstance();
  return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
  const isMounted = /* @__PURE__ */ useMounted();
  return vueExports.computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useMutationObserver(target, callback, options = {}) {
  const { window: window$1 = defaultWindow, ...mutationOptions } = options;
  let observer;
  const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "MutationObserver" in window$1);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const stopWatch = vueExports.watch(vueExports.computed(() => {
    const items = toArray(vueExports.toValue(target)).map(unrefElement).filter(notNullish);
    return new Set(items);
  }), (newTargets) => {
    cleanup();
    if (isSupported.value && newTargets.size) {
      observer = new MutationObserver(callback);
      newTargets.forEach((el) => observer.observe(el, mutationOptions));
    }
  }, {
    immediate: true,
    flush: "post"
  });
  const takeRecords = () => {
    return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
  };
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop,
    takeRecords
  };
}
function onElementRemoval(target, callback, options = {}) {
  const { window: window$1 = defaultWindow, document: document$1 = window$1 === null || window$1 === void 0 ? void 0 : window$1.document, flush = "sync" } = options;
  if (!window$1 || !document$1) return noop;
  let stopFn;
  const cleanupAndUpdate = (fn) => {
    stopFn === null || stopFn === void 0 || stopFn();
    stopFn = fn;
  };
  const stopWatch = vueExports.watchEffect(() => {
    const el = unrefElement(target);
    if (el) {
      const { stop } = useMutationObserver(document$1, (mutationsList) => {
        if (mutationsList.map((mutation) => [...mutation.removedNodes]).flat().some((node) => node === el || node.contains(el))) callback(mutationsList);
      }, {
        window: window$1,
        childList: true,
        subtree: true
      });
      cleanupAndUpdate(stop);
    }
  }, { flush });
  const stopHandle = () => {
    stopWatch();
    cleanupAndUpdate();
  };
  tryOnScopeDispose(stopHandle);
  return stopHandle;
}
function createKeyPredicate(keyFilter) {
  if (typeof keyFilter === "function") return keyFilter;
  else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
  else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
  return () => true;
}
function onKeyStroke(...args) {
  let key;
  let handler;
  let options = {};
  if (args.length === 3) {
    key = args[0];
    handler = args[1];
    options = args[2];
  } else if (args.length === 2) if (typeof args[1] === "object") {
    key = true;
    handler = args[0];
    options = args[1];
  } else {
    key = args[0];
    handler = args[1];
  }
  else {
    key = true;
    handler = args[0];
  }
  const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
  const predicate = createKeyPredicate(key);
  const listener = (e) => {
    if (e.repeat && vueExports.toValue(dedupe)) return;
    if (predicate(e)) handler(e);
  };
  return useEventListener(target, eventName, listener, passive);
}
function onKeyDown(key, handler, options = {}) {
  return onKeyStroke(key, handler, {
    ...options,
    eventName: "keydown"
  });
}
// @__NO_SIDE_EFFECTS__
function useActiveElement(options = {}) {
  var _options$document;
  const { window: window$1 = defaultWindow, deep = true, triggerOnRemoval = false } = options;
  const document$1 = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : window$1 === null || window$1 === void 0 ? void 0 : window$1.document;
  const getDeepActiveElement = () => {
    let element = document$1 === null || document$1 === void 0 ? void 0 : document$1.activeElement;
    if (deep) {
      var _element$shadowRoot;
      while (element === null || element === void 0 ? void 0 : element.shadowRoot) element = element === null || element === void 0 || (_element$shadowRoot = element.shadowRoot) === null || _element$shadowRoot === void 0 ? void 0 : _element$shadowRoot.activeElement;
    }
    return element;
  };
  const activeElement = vueExports.shallowRef();
  const trigger = () => {
    activeElement.value = getDeepActiveElement();
  };
  if (window$1) {
    const listenerOptions = {
      capture: true,
      passive: true
    };
    useEventListener(window$1, "blur", (event) => {
      if (event.relatedTarget !== null) return;
      trigger();
    }, listenerOptions);
    useEventListener(window$1, "focus", trigger, listenerOptions);
  }
  if (triggerOnRemoval) onElementRemoval(activeElement, trigger, { document: document$1 });
  trigger();
  return activeElement;
}
function cloneFnJSON(source) {
  return JSON.parse(JSON.stringify(source));
}
function useDropZone(target, options = {}) {
  const isOverDropZone = vueExports.shallowRef(false);
  const files = vueExports.shallowRef(null);
  return {
    files,
    isOverDropZone
  };
}
function useResizeObserver(target, callback, options = {}) {
  const { window: window$1 = defaultWindow, ...observerOptions } = options;
  let observer;
  const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "ResizeObserver" in window$1);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const stopWatch = vueExports.watch(vueExports.computed(() => {
    const _targets = vueExports.toValue(target);
    return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
  }), (els) => {
    cleanup();
    if (isSupported.value && window$1) {
      observer = new ResizeObserver(callback);
      for (const _el of els) if (_el) observer.observe(_el, observerOptions);
    }
  }, {
    immediate: true,
    flush: "post"
  });
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
function useElementSize(target, initialSize = {
  width: 0,
  height: 0
}, options = {}) {
  const { window: window$1 = defaultWindow, box = "content-box" } = options;
  const isSVG = vueExports.computed(() => {
    var _unrefElement;
    return (_unrefElement = unrefElement(target)) === null || _unrefElement === void 0 || (_unrefElement = _unrefElement.namespaceURI) === null || _unrefElement === void 0 ? void 0 : _unrefElement.includes("svg");
  });
  const width = vueExports.shallowRef(initialSize.width);
  const height = vueExports.shallowRef(initialSize.height);
  const { stop: stop1 } = useResizeObserver(target, ([entry]) => {
    const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
    if (window$1 && isSVG.value) {
      const $elem = unrefElement(target);
      if ($elem) {
        const rect = $elem.getBoundingClientRect();
        width.value = rect.width;
        height.value = rect.height;
      }
    } else if (boxSize) {
      const formatBoxSize = toArray(boxSize);
      width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
      height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
    } else {
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    }
  }, options);
  tryOnMounted(() => {
    const ele = unrefElement(target);
    if (ele) {
      width.value = "offsetWidth" in ele ? ele.offsetWidth : initialSize.width;
      height.value = "offsetHeight" in ele ? ele.offsetHeight : initialSize.height;
    }
  });
  const stop2 = vueExports.watch(() => unrefElement(target), (ele) => {
    width.value = ele ? initialSize.width : 0;
    height.value = ele ? initialSize.height : 0;
  });
  function stop() {
    stop1();
    stop2();
  }
  return {
    width,
    height,
    stop
  };
}
function useIntersectionObserver(target, callback, options = {}) {
  const { root, rootMargin, threshold = 0, window: window$1 = defaultWindow, immediate = true } = options;
  const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "IntersectionObserver" in window$1);
  const targets = vueExports.computed(() => {
    return toArray(vueExports.toValue(target)).map(unrefElement).filter(notNullish);
  });
  let cleanup = noop;
  const isActive = vueExports.shallowRef(immediate);
  const stopWatch = isSupported.value ? vueExports.watch(() => [
    targets.value,
    unrefElement(root),
    vueExports.toValue(rootMargin),
    isActive.value
  ], ([targets$1, root$1, rootMargin$1]) => {
    cleanup();
    if (!isActive.value) return;
    if (!targets$1.length) return;
    const observer = new IntersectionObserver(callback, {
      root: unrefElement(root$1),
      rootMargin: rootMargin$1,
      threshold
    });
    targets$1.forEach((el) => el && observer.observe(el));
    cleanup = () => {
      observer.disconnect();
      cleanup = noop;
    };
  }, {
    immediate,
    flush: "post"
  }) : noop;
  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop
  };
}
const events = /* @__PURE__ */ new Map();
// @__NO_SIDE_EFFECTS__
function useEventBus(key) {
  const scope = vueExports.getCurrentScope();
  function on(listener) {
    var _scope$cleanups;
    const listeners = events.get(key) || /* @__PURE__ */ new Set();
    listeners.add(listener);
    events.set(key, listeners);
    const _off = () => off(listener);
    scope === null || scope === void 0 || (_scope$cleanups = scope.cleanups) === null || _scope$cleanups === void 0 || _scope$cleanups.push(_off);
    return _off;
  }
  function once(listener) {
    function _listener(...args) {
      off(_listener);
      listener(...args);
    }
    return on(_listener);
  }
  function off(listener) {
    const listeners = events.get(key);
    if (!listeners) return;
    listeners.delete(listener);
    if (!listeners.size) reset();
  }
  function reset() {
    events.delete(key);
  }
  function emit(event, payload) {
    var _events$get;
    (_events$get = events.get(key)) === null || _events$get === void 0 || _events$get.forEach((v) => v(event, payload));
  }
  return {
    on,
    once,
    off,
    emit,
    reset
  };
}
const ARRIVED_STATE_THRESHOLD_PIXELS = 1;
function useScroll(element, options = {}) {
  const { throttle = 0, idle = 200, onStop = noop, onScroll = noop, offset = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, observe: _observe = { mutation: false }, eventListenerOptions = {
    capture: false,
    passive: true
  }, behavior = "auto", window: window$1 = defaultWindow, onError = (e) => {
    console.error(e);
  } } = options;
  const observe = typeof _observe === "boolean" ? { mutation: _observe } : _observe;
  const internalX = vueExports.shallowRef(0);
  const internalY = vueExports.shallowRef(0);
  const x = vueExports.computed({
    get() {
      return internalX.value;
    },
    set(x$1) {
      scrollTo(x$1, void 0);
    }
  });
  const y = vueExports.computed({
    get() {
      return internalY.value;
    },
    set(y$1) {
      scrollTo(void 0, y$1);
    }
  });
  function scrollTo(_x, _y) {
    var _ref, _toValue, _toValue2, _document;
    if (!window$1) return;
    const _element = vueExports.toValue(element);
    if (!_element) return;
    (_ref = _element instanceof Document ? window$1.document.body : _element) === null || _ref === void 0 || _ref.scrollTo({
      top: (_toValue = vueExports.toValue(_y)) !== null && _toValue !== void 0 ? _toValue : y.value,
      left: (_toValue2 = vueExports.toValue(_x)) !== null && _toValue2 !== void 0 ? _toValue2 : x.value,
      behavior: vueExports.toValue(behavior)
    });
    const scrollContainer = (_element === null || _element === void 0 || (_document = _element.document) === null || _document === void 0 ? void 0 : _document.documentElement) || (_element === null || _element === void 0 ? void 0 : _element.documentElement) || _element;
    if (x != null) internalX.value = scrollContainer.scrollLeft;
    if (y != null) internalY.value = scrollContainer.scrollTop;
  }
  const isScrolling = vueExports.shallowRef(false);
  const arrivedState = vueExports.reactive({
    left: true,
    right: false,
    top: true,
    bottom: false
  });
  const directions = vueExports.reactive({
    left: false,
    right: false,
    top: false,
    bottom: false
  });
  const onScrollEnd = (e) => {
    if (!isScrolling.value) return;
    isScrolling.value = false;
    directions.left = false;
    directions.right = false;
    directions.top = false;
    directions.bottom = false;
    onStop(e);
  };
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle);
  const setArrivedState = (target) => {
    var _document2;
    if (!window$1) return;
    const el = (target === null || target === void 0 || (_document2 = target.document) === null || _document2 === void 0 ? void 0 : _document2.documentElement) || (target === null || target === void 0 ? void 0 : target.documentElement) || unrefElement(target);
    const { display, flexDirection, direction } = window$1.getComputedStyle(el);
    const directionMultipler = direction === "rtl" ? -1 : 1;
    const scrollLeft = el.scrollLeft;
    directions.left = scrollLeft < internalX.value;
    directions.right = scrollLeft > internalX.value;
    const left = Math.abs(scrollLeft * directionMultipler) <= (offset.left || 0);
    const right = Math.abs(scrollLeft * directionMultipler) + el.clientWidth >= el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "row-reverse") {
      arrivedState.left = right;
      arrivedState.right = left;
    } else {
      arrivedState.left = left;
      arrivedState.right = right;
    }
    internalX.value = scrollLeft;
    let scrollTop = el.scrollTop;
    if (target === window$1.document && !scrollTop) scrollTop = window$1.document.body.scrollTop;
    directions.top = scrollTop < internalY.value;
    directions.bottom = scrollTop > internalY.value;
    const top = Math.abs(scrollTop) <= (offset.top || 0);
    const bottom = Math.abs(scrollTop) + el.clientHeight >= el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "column-reverse") {
      arrivedState.top = bottom;
      arrivedState.bottom = top;
    } else {
      arrivedState.top = top;
      arrivedState.bottom = bottom;
    }
    internalY.value = scrollTop;
  };
  const onScrollHandler = (e) => {
    var _documentElement;
    if (!window$1) return;
    setArrivedState((_documentElement = e.target.documentElement) !== null && _documentElement !== void 0 ? _documentElement : e.target);
    isScrolling.value = true;
    onScrollEndDebounced(e);
    onScroll(e);
  };
  useEventListener(element, "scroll", throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler, eventListenerOptions);
  tryOnMounted(() => {
    try {
      const _element = vueExports.toValue(element);
      if (!_element) return;
      setArrivedState(_element);
    } catch (e) {
      onError(e);
    }
  });
  if ((observe === null || observe === void 0 ? void 0 : observe.mutation) && element != null && element !== window$1 && element !== void 0) useMutationObserver(element, () => {
    const _element = vueExports.toValue(element);
    if (!_element) return;
    setArrivedState(_element);
  }, {
    attributes: true,
    childList: true,
    subtree: true
  });
  useEventListener(element, "scrollend", onScrollEnd, eventListenerOptions);
  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = vueExports.toValue(element);
      if (window$1 && _element) setArrivedState(_element);
    }
  };
}
function usePointerSwipe(target, options = {}) {
  const targetRef = toRef(target);
  const { threshold = 50, onSwipe, onSwipeEnd, onSwipeStart, disableTextSelect = false } = options;
  const posStart = vueExports.reactive({
    x: 0,
    y: 0
  });
  const updatePosStart = (x, y) => {
    posStart.x = x;
    posStart.y = y;
  };
  const posEnd = vueExports.reactive({
    x: 0,
    y: 0
  });
  const updatePosEnd = (x, y) => {
    posEnd.x = x;
    posEnd.y = y;
  };
  const distanceX = vueExports.computed(() => posStart.x - posEnd.x);
  const distanceY = vueExports.computed(() => posStart.y - posEnd.y);
  const { max, abs } = Math;
  const isThresholdExceeded = vueExports.computed(() => max(abs(distanceX.value), abs(distanceY.value)) >= threshold);
  const isSwiping = vueExports.shallowRef(false);
  const isPointerDown = vueExports.shallowRef(false);
  const direction = vueExports.computed(() => {
    if (!isThresholdExceeded.value) return "none";
    if (abs(distanceX.value) > abs(distanceY.value)) return distanceX.value > 0 ? "left" : "right";
    else return distanceY.value > 0 ? "up" : "down";
  });
  const eventIsAllowed = (e) => {
    var _ref, _options$pointerTypes, _options$pointerTypes2;
    const isReleasingButton = e.buttons === 0;
    const isPrimaryButton = e.buttons === 1;
    return (_ref = (_options$pointerTypes = (_options$pointerTypes2 = options.pointerTypes) === null || _options$pointerTypes2 === void 0 ? void 0 : _options$pointerTypes2.includes(e.pointerType)) !== null && _options$pointerTypes !== void 0 ? _options$pointerTypes : isReleasingButton || isPrimaryButton) !== null && _ref !== void 0 ? _ref : true;
  };
  const listenerOptions = { passive: true };
  const stops = [
    useEventListener(target, "pointerdown", (e) => {
      if (!eventIsAllowed(e)) return;
      isPointerDown.value = true;
      const eventTarget = e.target;
      eventTarget === null || eventTarget === void 0 || eventTarget.setPointerCapture(e.pointerId);
      const { clientX: x, clientY: y } = e;
      updatePosStart(x, y);
      updatePosEnd(x, y);
      onSwipeStart === null || onSwipeStart === void 0 || onSwipeStart(e);
    }, listenerOptions),
    useEventListener(target, "pointermove", (e) => {
      if (!eventIsAllowed(e)) return;
      if (!isPointerDown.value) return;
      const { clientX: x, clientY: y } = e;
      updatePosEnd(x, y);
      if (!isSwiping.value && isThresholdExceeded.value) isSwiping.value = true;
      if (isSwiping.value) onSwipe === null || onSwipe === void 0 || onSwipe(e);
    }, listenerOptions),
    useEventListener(target, "pointerup", (e) => {
      if (!eventIsAllowed(e)) return;
      if (isSwiping.value) onSwipeEnd === null || onSwipeEnd === void 0 || onSwipeEnd(e, direction.value);
      isPointerDown.value = false;
      isSwiping.value = false;
    }, listenerOptions)
  ];
  tryOnMounted(() => {
    var _targetRef$value;
    (_targetRef$value = targetRef.value) === null || _targetRef$value === void 0 || (_targetRef$value = _targetRef$value.style) === null || _targetRef$value === void 0 || _targetRef$value.setProperty("touch-action", "pan-y");
    if (disableTextSelect) {
      var _targetRef$value2, _targetRef$value3, _targetRef$value4;
      (_targetRef$value2 = targetRef.value) === null || _targetRef$value2 === void 0 || (_targetRef$value2 = _targetRef$value2.style) === null || _targetRef$value2 === void 0 || _targetRef$value2.setProperty("-webkit-user-select", "none");
      (_targetRef$value3 = targetRef.value) === null || _targetRef$value3 === void 0 || (_targetRef$value3 = _targetRef$value3.style) === null || _targetRef$value3 === void 0 || _targetRef$value3.setProperty("-ms-user-select", "none");
      (_targetRef$value4 = targetRef.value) === null || _targetRef$value4 === void 0 || (_targetRef$value4 = _targetRef$value4.style) === null || _targetRef$value4 === void 0 || _targetRef$value4.setProperty("user-select", "none");
    }
  });
  const stop = () => stops.forEach((s) => s());
  return {
    isSwiping: vueExports.readonly(isSwiping),
    direction: vueExports.readonly(direction),
    posStart: vueExports.readonly(posStart),
    posEnd: vueExports.readonly(posEnd),
    distanceX,
    distanceY,
    stop
  };
}
// @__NO_SIDE_EFFECTS__
function useVModel(props, key, emit, options = {}) {
  var _vm$$emit, _vm$proxy;
  const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
  const vm = vueExports.getCurrentInstance();
  const _emit = emit || (vm === null || vm === void 0 ? void 0 : vm.emit) || (vm === null || vm === void 0 || (_vm$$emit = vm.$emit) === null || _vm$$emit === void 0 ? void 0 : _vm$$emit.bind(vm)) || (vm === null || vm === void 0 || (_vm$proxy = vm.proxy) === null || _vm$proxy === void 0 || (_vm$proxy = _vm$proxy.$emit) === null || _vm$proxy === void 0 ? void 0 : _vm$proxy.bind(vm === null || vm === void 0 ? void 0 : vm.proxy));
  let event = eventName;
  event = event || `update:${key.toString()}`;
  const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
  const getValue$1 = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
  const triggerEmit = (value) => {
    if (shouldEmit) {
      if (shouldEmit(value)) _emit(event, value);
    } else _emit(event, value);
  };
  if (passive) {
    const proxy = vueExports.ref(getValue$1());
    let isUpdating = false;
    vueExports.watch(() => props[key], (v) => {
      if (!isUpdating) {
        isUpdating = true;
        proxy.value = cloneFn(v);
        vueExports.nextTick(() => isUpdating = false);
      }
    });
    vueExports.watch(proxy, (v) => {
      if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
    }, { deep });
    return proxy;
  } else return vueExports.computed({
    get() {
      return getValue$1();
    },
    set(value) {
      triggerEmit(value);
    }
  });
}

export { useIntersectionObserver as a, useActiveElement as b, useScroll as c, useElementSize as d, createReusableTemplate as e, usePointerSwipe as f, useDropZone as g, useVModel as h, useEventBus as i, onKeyDown as o, useEventListener as u };
//# sourceMappingURL=index-CtsWe4-H.mjs.map
