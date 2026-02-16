import { v as vueExports, s as serverRenderer_cjs_prodExports, e as useDebounceFn, u as useRuntimeConfig, d as createSharedComposable, b as _sfc_main$f, c as _sfc_main$8 } from './server.mjs';
import { b as useAboutData, _ as __nuxt_component_7, u as useFetch, A as Asset7Logo, a as Asset11Logo } from './AboutPopup-DmzvmQkz.mjs';
import { u as useDevice } from './useDevice-S3-EEo3A.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useEventListener, a as useIntersectionObserver, b as useActiveElement, c as useScroll, d as useElementSize, o as onKeyDown } from './index-CtsWe4-H.mjs';
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

const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LogoTop",
  __ssrInlineRender: true,
  props: {
    isHero: { type: Boolean },
    showAboutPopup: { type: Boolean },
    showPopup: { type: Boolean }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { isMobile, isTablet } = useDevice();
    const containerWidth = vueExports.computed(() => isMobile ? "160px" : "200px");
    const containerHeight = vueExports.computed(() => isMobile ? "60px" : "80px");
    const isHidden = vueExports.computed(() => props.showAboutPopup || props.showPopup);
    const yOffset = vueExports.computed(() => {
      if (!props.isHero)
        return 0;
      if (isMobile)
        return 180;
      if (isTablet)
        return 250;
      return 320;
    });
    const initialVariant = vueExports.computed(() => ({
      y: yOffset.value
    }));
    const enterVariant = {
      y: 0,
      transition: {
        type: "keyframes",
        duration: 1200,
        ease: "easeOut"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_motion = vueExports.resolveDirective("motion");
      _push(`<button${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: "fixed left-1/2 z-50 m-0 -translate-x-1/2 cursor-pointer appearance-none border-0 bg-none p-0 mix-blend-exclusion",
        style: {
          top: "60px",
          width: vueExports.unref(containerWidth),
          height: vueExports.unref(containerHeight),
          opacity: vueExports.unref(isHidden) ? 0 : 1,
          pointerEvents: vueExports.unref(isHidden) ? "none" : "auto",
          transition: "opacity 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out"
        },
        "aria-label": "Open about"
      }, _attrs))}><div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        initial: vueExports.unref(initialVariant),
        enter: enterVariant,
        class: "flex h-full w-full items-center justify-center"
      }, serverRenderer_cjs_prodExports.ssrGetDirectiveProps(_ctx, _directive_motion)))}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(Asset7Logo))} alt="Joanna Logo Top" class="max-h-full max-w-[54.15%]"></div></button>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LogoTop.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$7, { __name: "LogoTop" });
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LogoBottom",
  __ssrInlineRender: true,
  props: {
    isHero: { type: Boolean },
    showAboutPopup: { type: Boolean },
    showPopup: { type: Boolean }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { isMobile, isTablet } = useDevice();
    const containerWidth = vueExports.computed(() => isMobile ? "160px" : "200px");
    const containerHeight = vueExports.computed(() => isMobile ? "60px" : "80px");
    const containerHeightPx = vueExports.computed(() => isMobile ? 60 : 80);
    const isHidden = vueExports.computed(() => props.showAboutPopup || props.showPopup);
    const yOffset = vueExports.computed(() => {
      if (!props.isHero)
        return 0;
      if (isMobile)
        return -180;
      if (isTablet)
        return -250;
      return -320;
    });
    const initialVariant = vueExports.computed(() => ({
      y: yOffset.value
    }));
    const enterVariant = {
      y: 0,
      transition: {
        type: "keyframes",
        duration: 1200,
        ease: "easeOut"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_motion = vueExports.resolveDirective("motion");
      _push(`<button${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: "fixed left-1/2 z-50 m-0 -translate-x-1/2 cursor-pointer appearance-none border-0 bg-none p-0 mix-blend-exclusion",
        style: {
          top: `calc(100vh - 60px - ${vueExports.unref(containerHeightPx)}px)`,
          width: vueExports.unref(containerWidth),
          height: vueExports.unref(containerHeight),
          opacity: vueExports.unref(isHidden) ? 0 : 1,
          pointerEvents: vueExports.unref(isHidden) ? "none" : "auto",
          transition: "opacity 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out"
        },
        "aria-label": "Open about"
      }, _attrs))}><div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        initial: vueExports.unref(initialVariant),
        enter: enterVariant,
        class: "flex h-full w-full items-center justify-center"
      }, serverRenderer_cjs_prodExports.ssrGetDirectiveProps(_ctx, _directive_motion)))}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(Asset11Logo))} alt="Van Der Weg Logo Bottom" class="max-h-[83.33%] max-w-full"></div></button>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LogoBottom.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$6, { __name: "LogoBottom" });
function getImageUrl(record, filename) {
  const config = useRuntimeConfig();
  return `${config.public.pbUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
}
function useHomepageData() {
  const config = useRuntimeConfig();
  const { data: response, status, error, refresh } = useFetch(
    `${config.public.pbUrl}/api/collections/Homepage/records`,
    {
      key: "homepage"
    },
    "$VS_PrjQaJW"
    /* nuxt-injected */
  );
  const loading = vueExports.computed(() => status.value === "pending");
  const hasError = vueExports.computed(() => !!error.value);
  const homepage = vueExports.computed(() => {
    return response.value?.items.find((item) => item.Is_Active) ?? null;
  });
  const heroImage = vueExports.computed(() => {
    if (!homepage.value?.Hero_Image)
      return "";
    return getImageUrl(homepage.value, homepage.value.Hero_Image);
  });
  const heroTitle = vueExports.computed(() => homepage.value?.Hero_Title || "Creative Strategy and Communication");
  return { heroImage, heroTitle, loading, hasError, error, refresh };
}
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "HeroSection",
  __ssrInlineRender: true,
  props: {
    isAboutPopupVisible: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const { heroImage, heroTitle } = useHomepageData();
    const { isMobile } = useDevice();
    const imageScaled = vueExports.ref(false);
    const showTitle = vueExports.computed(() => !props.isAboutPopupVisible);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        id: "hero-section",
        class: ["relative flex w-full snap-center items-center justify-center overflow-hidden bg-white", vueExports.unref(isMobile) ? "h-[100lvh]" : "h-screen"]
      }, _attrs))} data-v-2987210a><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([[vueExports.unref(imageScaled) ? "scale-100" : "scale-30"], "absolute inset-0 bg-cover bg-center transition-transform duration-1200 ease-out"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url(${vueExports.unref(heroImage)})` })}" data-v-2987210a></div>`);
      if (vueExports.unref(showTitle)) {
        _push(`<div class="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center" data-v-2987210a><h1 class="title-font text-white" data-v-2987210a>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(heroTitle))}</h1></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute bottom-8 left-1/2 z-10 -translate-x-3 text-white" data-v-2987210a>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-chevron-down",
        class: "size-6 text-white"
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-2987210a"]]), { __name: "HeroSection" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "MotionCarousel",
  __ssrInlineRender: true,
  props: {
    images: {},
    projectTitle: {},
    totalSlides: {},
    showTopProgressBar: { type: Boolean, default: true },
    isPopupVisible: { type: Boolean, default: false },
    isAboutPopupVisible: { type: Boolean, default: false }
  },
  emits: ["showPopup"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { isMobile } = useDevice();
    const containerRef = vueExports.ref(null);
    vueExports.useTemplateRef("projectTitleRef");
    const { x: scrollX } = useScroll(containerRef, { behavior: "smooth" });
    const { width: containerWidth } = useElementSize(containerRef);
    const blurIntensity = vueExports.ref(0);
    const halfWidth = vueExports.computed(() => containerWidth.value * 0.5);
    const maxScroll = vueExports.computed(() => {
      const carousel = containerRef.value;
      if (!carousel)
        return 0;
      return carousel.scrollWidth - containerWidth.value;
    });
    const scrollProgress = vueExports.computed(() => {
      if (maxScroll.value <= 0)
        return 0;
      return scrollX.value / maxScroll.value;
    });
    const currentSlide = vueExports.computed(() => {
      if (isMobile) {
        const currentIndex = Math.round(scrollProgress.value * (props.totalSlides - 1));
        return Math.max(0, Math.min(currentIndex, props.totalSlides - 1));
      }
      if (halfWidth.value <= 0)
        return 0;
      if (scrollX.value >= maxScroll.value - 5) {
        return props.totalSlides - 1;
      }
      const slideIndex = Math.round(scrollX.value / halfWidth.value);
      return Math.min(slideIndex, props.images.length - 1);
    });
    const isOnBlurSlide = vueExports.computed(() => {
      if (isMobile) {
        return currentSlide.value === props.totalSlides - 1;
      }
      return scrollX.value >= maxScroll.value - 5;
    });
    const lastImage = vueExports.computed(() => props.images[props.images.length - 1]);
    const titleText = vueExports.computed(() => isOnBlurSlide.value ? "NEXT PROJECT" : props.projectTitle);
    const titleHidden = vueExports.computed(() => props.isPopupVisible || props.isAboutPopupVisible);
    const showBottomBar = vueExports.computed(() => {
      if (isMobile) {
        return currentSlide.value > 0 && currentSlide.value <= props.images.length;
      }
      return currentSlide.value > 0 && !isOnBlurSlide.value;
    });
    const showTopBar = vueExports.computed(() => props.showTopProgressBar && isMobile && props.images.length > 1 && currentSlide.value > 0 && currentSlide.value <= props.images.length);
    const showRightChevron = vueExports.computed(() => !isMobile && props.images.length > 1 && currentSlide.value < props.images.length - 1);
    const progressBarTransform = vueExports.computed(() => {
      if (showBottomBar.value) {
        return "translateY(0) translateZ(0)";
      }
      return "translateY(10px) translateZ(0)";
    });
    const topProgressBarTransform = vueExports.computed(() => {
      if (showBottomBar.value) {
        return "translateY(0)";
      }
      return "translateY(-10px)";
    });
    vueExports.watch(scrollX, () => {
      if (isMobile) {
        calculateBlurIntensity();
      }
    });
    function calculateBlurIntensity() {
      const carousel = containerRef.value;
      if (!carousel)
        return;
      const slides = carousel.querySelectorAll(".motion-carousel__slide");
      const blurSlide = slides[slides.length - 1];
      if (!blurSlide)
        return;
      const blurSlideRect = blurSlide.getBoundingClientRect();
      const carouselRect = carousel.getBoundingClientRect();
      const blurSlideLeft = blurSlideRect.left - carouselRect.left;
      const carouselWidth = carouselRect.width;
      const slideWidth = blurSlideRect.width;
      const idealCenterPosition = (carouselWidth - slideWidth) / 2;
      const distanceFromCenter = Math.abs(blurSlideLeft - idealCenterPosition);
      const maxDistance = carouselWidth - idealCenterPosition;
      let visibility = 0;
      if (maxDistance > 0) {
        const raw = 1 - distanceFromCenter / maxDistance;
        const delayThreshold = 0.5;
        if (raw > delayThreshold) {
          visibility = (raw - delayThreshold) / (1 - delayThreshold);
        }
        visibility = Math.max(0, Math.min(1, visibility));
      }
      blurIntensity.value = visibility;
    }
    if (!isMobile) {
      onKeyDown("ArrowRight", (e) => {
        if (currentSlide.value < props.totalSlides - 1) {
          e.preventDefault();
          scrollX.value = (currentSlide.value + 1) * halfWidth.value;
        }
      });
      onKeyDown("ArrowLeft", (e) => {
        if (currentSlide.value > 0) {
          e.preventDefault();
          scrollX.value = (currentSlide.value - 1) * halfWidth.value;
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UProgress = _sfc_main$8;
      _push(`<!--[--><div class="motion-carousel relative h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth bg-cover bg-center" data-carousel style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url(${vueExports.unref(lastImage).src})` })}" data-v-c5191fb1><div class="absolute inset-0 z-5 bg-cover bg-center" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url(${vueExports.unref(lastImage).src})` })}" data-v-c5191fb1></div><div class="relative z-10 flex h-full w-full" data-v-c5191fb1>`);
      if (vueExports.unref(isMobile)) {
        _push(`<!--[--><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(__props.images.slice(0, -1), (image, idx) => {
          _push(`<div class="motion-carousel__slide relative h-full w-full min-w-full flex-shrink-0 snap-center snap-always bg-black bg-cover bg-center" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url(${image.src})` })}" role="group"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `Slide ${idx + 1}`)} data-v-c5191fb1></div>`);
        });
        _push(`<!--]--><div class="motion-carousel__slide relative z-15 h-full w-full min-w-full flex-shrink-0 snap-center snap-always bg-transparent bg-cover bg-center bg-no-repeat opacity-0" role="group"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `Slide ${__props.images.length}`)} style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url(${vueExports.unref(lastImage).src})` })}" data-v-c5191fb1></div><button class="motion-carousel__slide relative z-15 m-0 block h-full w-full min-w-full flex-shrink-0 cursor-pointer snap-center snap-always appearance-none border-0 bg-transparent p-0 text-left" aria-label="Go to next project" data-v-c5191fb1><div class="pointer-events-none absolute inset-0 z-1" data-v-c5191fb1><div class="absolute inset-0 z-1" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
          background: `rgba(0, 0, 0, ${0.25 * vueExports.unref(blurIntensity) ** 2})`,
          backdropFilter: `blur(${8 * vueExports.unref(blurIntensity) ** 2}px)`,
          WebkitBackdropFilter: `blur(${8 * vueExports.unref(blurIntensity) ** 2}px)`,
          transition: "none"
        })}" data-v-c5191fb1><div class="pointer-events-auto absolute bottom-5 left-1/2 z-100 cursor-pointer transition-opacity duration-300 hover:opacity-70" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ opacity: vueExports.unref(blurIntensity) ** 2, transform: "translateX(-50%) translateZ(0)", willChange: "transform, opacity" })}" data-v-c5191fb1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-chevron-down",
          class: "size-6 text-white"
        }, null, _parent));
        _push(`</div></div></div></button><!--]-->`);
      } else {
        _push(`<!--[--><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(__props.images, (image, idx) => {
          _push(`<div class="relative h-full w-[50vw] min-w-[50vw] flex-shrink-0 snap-center snap-always bg-black bg-cover bg-center" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundImage: `url(${image.src})` })}" role="group"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `Slide ${idx + 1}`)} data-v-c5191fb1></div>`);
        });
        _push(`<!--]--><button class="relative z-15 m-0 block h-full w-[100vw]! min-w-[100vw]! flex-shrink-0 cursor-pointer snap-center snap-always appearance-none border-0 bg-transparent p-0 text-left" aria-label="Go to next project" data-v-c5191fb1><div class="absolute inset-0 z-1 bg-black/30 backdrop-blur-xl" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "backdrop-filter": "blur(12px)", "-webkit-backdrop-filter": "blur(12px)" })}" data-v-c5191fb1></div></button><!--]-->`);
      }
      _push(`</div></div><div class="pointer-events-none absolute top-1/2 left-1/2 z-200 w-full -translate-x-1/2 -translate-y-1/2 text-center" data-v-c5191fb1><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([[vueExports.unref(titleHidden) ? "invisible opacity-0" : "visible opacity-100"], "title-font pointer-events-auto m-0 block w-full cursor-pointer appearance-none border-0 bg-none p-0 text-center text-white transition-[opacity,visibility] duration-300 ease-in-out"])}" data-v-c5191fb1>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(titleText))}</button></div>`);
      if (__props.images.length > 1) {
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
          vueExports.unref(showBottomBar) ? "opacity-100" : "opacity-0",
          vueExports.unref(isMobile) ? "bottom-5" : "bottom-7 will-change-transform"
        ], "absolute right-0 left-0 z-20 flex justify-center px-6 transition-[opacity,transform] duration-150 ease-in-out"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ pointerEvents: vueExports.unref(currentSlide) > 0 ? "auto" : "none", transform: vueExports.unref(progressBarTransform) })}" data-v-c5191fb1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UProgress, {
          "model-value": vueExports.unref(scrollProgress),
          max: 1,
          size: "xs",
          ui: {
            base: "bg-gray-500/50 backdrop-blur-sm",
            indicator: "bg-gray-50"
          },
          class: "w-[80vw]"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(showTopBar)) {
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([[vueExports.unref(showBottomBar) ? "opacity-100" : "opacity-0"], "absolute top-5 right-0 left-0 z-20 flex justify-center px-6 transition-[opacity,transform] duration-150 ease-in-out"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ pointerEvents: vueExports.unref(currentSlide) > 0 ? "auto" : "none", transform: vueExports.unref(topProgressBarTransform) })}" data-v-c5191fb1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UProgress, {
          "model-value": vueExports.unref(scrollProgress),
          max: 1,
          size: "xs",
          ui: {
            base: "bg-gray-500/50 backdrop-blur-sm",
            indicator: "bg-gray-50"
          },
          class: "w-[80vw]"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!vueExports.unref(isMobile) && __props.images.length > 1) {
        _push(`<div class="absolute right-0 bottom-10 left-0 z-20 flex justify-center will-change-transform" data-v-c5191fb1><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([[vueExports.unref(isOnBlurSlide) ? "translate-y-0 opacity-100" : "-translate-y-2.5 opacity-0"], "m-0 block cursor-pointer appearance-none border-0 bg-none p-0 transition-[opacity,transform] duration-150 ease-in-out"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ transform: vueExports.unref(isOnBlurSlide) ? "translateY(0) translateZ(0)" : "translateY(-10px) translateZ(0)" })}" aria-label="Go to next project" data-v-c5191fb1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-chevron-down",
          class: "size-6 text-white transition-opacity duration-300 hover:opacity-70"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(showRightChevron)) {
        _push(`<button class="absolute top-1/2 right-6 z-250 -translate-y-1/2 cursor-pointer border-none bg-none transition-opacity duration-150 hover:opacity-70" aria-label="Next slide" data-v-c5191fb1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-chevron-right",
          class: "pointer-events-none size-6 text-white"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MotionCarousel.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-c5191fb1"]]), { __name: "MotionCarousel" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectNavigation",
  __ssrInlineRender: true,
  props: {
    projectTitles: {}
  },
  emits: ["linkClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "w-full text-center px-6 md:w-4/5 md:px-0" }, _attrs))}><ul class="space-y-1"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(props.projectTitles, (title, index2) => {
        _push(`<li><a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", `#project-${index2}`)} class="title-font block text-black uppercase leading-none no-underline hover:underline">${serverRenderer_cjs_prodExports.ssrInterpolate(title)}</a></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProjectNavigation.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "ProjectNavigation" });
function usePortfolioProjects() {
  const config = useRuntimeConfig();
  const { data: response, status, error, refresh } = useFetch(
    `${config.public.pbUrl}/api/collections/Portfolio_Projects/records`,
    {
      key: "portfolio"
    },
    "$5DX9Z4_mmV"
    /* nuxt-injected */
  );
  const loading = vueExports.computed(() => status.value === "pending");
  const hasError = vueExports.computed(() => !!error.value);
  const projects = vueExports.computed(() => {
    if (!response.value)
      return [];
    const sorted = [...response.value.items].sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0));
    return sorted.map((project) => ({
      title: project.Title ?? "",
      description: project.Description ?? "",
      responsibility: project.Responsibility_json ?? [],
      images: (project.Images ?? []).map((filename) => ({
        src: getImageUrl(project, filename)
      }))
    }));
  });
  const projectTitles = vueExports.computed(() => projects.value.map((p) => p.title));
  return { projects, projectTitles, loading, hasError, error, refresh };
}
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectIndex",
  __ssrInlineRender: true,
  setup(__props) {
    const { projectTitles } = usePortfolioProjects();
    function handleLinkClick(index2) {
      return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProjectNavigation = __nuxt_component_0;
      _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        id: "project-index",
        class: "flex h-[100lvh] w-full snap-center items-center justify-center bg-white"
      }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectNavigation, {
        "project-titles": vueExports.unref(projectTitles),
        onLinkClick: handleLinkClick
      }, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProjectIndex.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$2, { __name: "ProjectIndex" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectPopup",
  __ssrInlineRender: true,
  props: {
    projectTitle: {}
  },
  setup(__props) {
    const props = __props;
    const { projects } = usePortfolioProjects();
    const project = vueExports.computed(() => projects.value.find((p) => p.title === props.projectTitle));
    const projectDescription = vueExports.computed(() => project.value?.description || "");
    const projectResponsibility = vueExports.computed(() => project.value?.responsibility || []);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "popup-container" }, _attrs))}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(ProjectCardSVG))} alt="Project Card" class="popup-card-image"><div class="absolute inset-0 flex flex-col justify-center px-4 py-8"><h2 class="text-popup-title">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.projectTitle)}</h2><div class="text-popup-title"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(projectResponsibility), (responsibility, index2) => {
        _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(responsibility)}`);
        if (index2 < vueExports.unref(projectResponsibility).length - 1) {
          _push(`<br>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span>`);
      });
      _push(`<!--]--></div><p class="text-popup-body">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(projectDescription))}</p></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProjectPopup.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "ProjectPopup" });
const kbdKeysMap = {
  meta: "",
  ctrl: "",
  alt: "",
  win: "⊞",
  command: "⌘",
  shift: "⇧",
  control: "⌃",
  option: "⌥",
  enter: "↵",
  delete: "⌦",
  backspace: "⌫",
  escape: "Esc",
  tab: "⇥",
  capslock: "⇪",
  arrowup: "↑",
  arrowright: "→",
  arrowdown: "↓",
  arrowleft: "←",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘"
};
const _useKbd = () => {
  const macOS = vueExports.computed(() => false);
  const kbdKeysSpecificMap = vueExports.reactive({
    meta: " ",
    alt: " ",
    ctrl: " "
  });
  function getKbdKey(value) {
    if (!value) {
      return;
    }
    if (["meta", "alt", "ctrl"].includes(value)) {
      return kbdKeysSpecificMap[value];
    }
    return kbdKeysMap[value] || value;
  }
  return {
    macOS,
    getKbdKey
  };
};
const useKbd = /* @__PURE__ */ createSharedComposable(_useKbd);
const chainedShortcutRegex = /^[^-]+.*-.*[^-]+$/;
const combinedShortcutRegex = /^[^_]+.*_.*[^_]+$/;
const shiftableKeys = ["arrowleft", "arrowright", "arrowup", "arrowright", "tab", "escape", "enter", "backspace"];
function convertKeyToCode(key) {
  if (/^[a-z]$/i.test(key)) {
    return `Key${key.toUpperCase()}`;
  }
  if (/^\d$/.test(key)) {
    return `Digit${key}`;
  }
  if (/^f\d+$/i.test(key)) {
    return key.toUpperCase();
  }
  const specialKeys = {
    space: "Space",
    enter: "Enter",
    escape: "Escape",
    tab: "Tab",
    backspace: "Backspace",
    delete: "Delete",
    arrowup: "ArrowUp",
    arrowdown: "ArrowDown",
    arrowleft: "ArrowLeft",
    arrowright: "ArrowRight"
  };
  return specialKeys[key.toLowerCase()] || key;
}
function defineShortcuts(config, options = {}) {
  const chainedInputs = vueExports.ref([]);
  const clearChainedInput = () => {
    chainedInputs.value.splice(0, chainedInputs.value.length);
  };
  const debouncedClearChainedInput = useDebounceFn(clearChainedInput, options.chainDelay ?? 800);
  const { macOS } = useKbd();
  const activeElement = useActiveElement();
  const layoutIndependent = options.layoutIndependent ?? false;
  const shiftableCodes = shiftableKeys.map((k) => convertKeyToCode(k));
  const onKeyDown2 = (e) => {
    if (!e.key) {
      return;
    }
    const alphabetKey = layoutIndependent ? /^Key[A-Z]$/i.test(e.code) : /^[a-z]{1}$/i.test(e.key);
    const shiftableKey = layoutIndependent ? shiftableCodes.includes(e.code) : shiftableKeys.includes(e.key.toLowerCase());
    let chainedKey;
    chainedInputs.value.push(layoutIndependent ? e.code : e.key);
    if (chainedInputs.value.length >= 2) {
      chainedKey = chainedInputs.value.slice(-2).join("-");
      for (const shortcut of shortcuts.value.filter((s) => s.chained)) {
        if (shortcut.key !== chainedKey) {
          continue;
        }
        if (shortcut.enabled) {
          e.preventDefault();
          shortcut.handler(e);
        }
        clearChainedInput();
        return;
      }
    }
    for (const shortcut of shortcuts.value.filter((s) => !s.chained)) {
      if (layoutIndependent) {
        if (e.code !== shortcut.key) {
          continue;
        }
      } else {
        if (e.key.toLowerCase() !== shortcut.key) {
          continue;
        }
      }
      if (e.metaKey !== shortcut.metaKey) {
        continue;
      }
      if (e.ctrlKey !== shortcut.ctrlKey) {
        continue;
      }
      if ((alphabetKey || shiftableKey || shortcut.shiftKey || e.shiftKey) && e.shiftKey !== shortcut.shiftKey) {
        continue;
      }
      if (shortcut.enabled) {
        e.preventDefault();
        shortcut.handler(e);
      }
      clearChainedInput();
      return;
    }
    debouncedClearChainedInput();
  };
  const usingInput = vueExports.computed(() => {
    const tagName = activeElement.value?.tagName;
    const contentEditable = activeElement.value?.contentEditable;
    const usingInput2 = !!(tagName === "INPUT" || tagName === "TEXTAREA" || contentEditable === "true" || contentEditable === "plaintext-only");
    if (usingInput2) {
      return activeElement.value?.name || true;
    }
    return false;
  });
  const shortcuts = vueExports.computed(() => {
    return Object.entries(vueExports.toValue(config)).map(([key, shortcutConfig]) => {
      if (!shortcutConfig) {
        return null;
      }
      let shortcut;
      if (key.includes("-") && key !== "-" && !key.includes("_") && !key.match(chainedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`);
      }
      if (key.includes("_") && key !== "_" && !key.match(combinedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`);
      }
      const chained = key.includes("-") && key !== "-" && !key.includes("_");
      if (chained) {
        if (layoutIndependent) {
          const parts = key.split("-").map((p) => convertKeyToCode(p));
          shortcut = {
            key: parts.join("-"),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false
          };
        } else {
          shortcut = {
            key: key.toLowerCase(),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false
          };
        }
      } else {
        const keySplit = key.toLowerCase().split("_").map((k) => k);
        let baseKey = keySplit.filter((k) => !["meta", "command", "ctrl", "shift", "alt", "option"].includes(k)).join("_");
        if (layoutIndependent) {
          baseKey = convertKeyToCode(baseKey);
        }
        shortcut = {
          key: baseKey,
          metaKey: keySplit.includes("meta") || keySplit.includes("command"),
          ctrlKey: keySplit.includes("ctrl"),
          shiftKey: keySplit.includes("shift"),
          altKey: keySplit.includes("alt") || keySplit.includes("option")
        };
      }
      shortcut.chained = chained;
      if (!macOS.value && shortcut.metaKey && !shortcut.ctrlKey) {
        shortcut.metaKey = false;
        shortcut.ctrlKey = true;
      }
      if (typeof shortcutConfig === "function") {
        shortcut.handler = shortcutConfig;
      } else if (typeof shortcutConfig === "object") {
        shortcut = { ...shortcut, handler: shortcutConfig.handler };
      }
      if (!shortcut.handler) {
        console.trace("[Shortcut] Invalid value");
        return null;
      }
      let enabled = true;
      if (!shortcutConfig.usingInput) {
        enabled = !usingInput.value;
      } else if (typeof shortcutConfig.usingInput === "string") {
        enabled = usingInput.value === shortcutConfig.usingInput;
      }
      shortcut.enabled = enabled;
      return shortcut;
    }).filter(Boolean);
  });
  return useEventListener("keydown", onKeyDown2);
}
function useMobileSwipeHint(projectCount) {
  const { isMobile: _isMobile } = useDevice();
  const hasShownMobileHint = vueExports.ref(false);
  const target = vueExports.computed(() => {
    return null;
  });
  const { stop } = useIntersectionObserver(
    target,
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasShownMobileHint.value) {
          hasShownMobileHint.value = true;
          stop();
          setTimeout(() => {
            return;
          }, 1e3);
        }
      });
    },
    { threshold: 0.5, rootMargin: "0px" }
  );
  return { setup: () => {
  } };
}
function useSectionTracking(projectCount, resetInactiveCarousels) {
  const currentSectionIndex = vueExports.ref(0);
  const targets = vueExports.computed(() => {
    return [];
  });
  const { stop } = useIntersectionObserver(
    targets,
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id;
          let index2;
          if (sectionId === "hero-section") {
            index2 = 0;
          } else if (sectionId.startsWith("project-")) {
            index2 = Number.parseInt(sectionId.replace("project-", "")) + 1;
          } else if (sectionId === "project-index") {
            index2 = projectCount.value + 1;
          }
          if (index2 !== void 0) {
            currentSectionIndex.value = index2;
          }
        }
      });
    },
    { threshold: 0.5, root: vueExports.computed(() => {
      return null;
    }) }
  );
  return { currentSectionIndex, setupSectionTracking: () => {
  }, stop };
}
const __nuxt_component_2_lazy = vueExports.defineAsyncComponent(() => import('./HamburgerMenu-51Pg4C7H.mjs').then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { projects: projectsData } = usePortfolioProjects();
    useHomepageData();
    useAboutData();
    const projectCount = vueExports.computed(() => projectsData.value.length);
    const showPopup = vueExports.ref(false);
    const showAboutPopup = vueExports.ref(false);
    const popupProjectTitle = vueExports.ref("");
    function handleShowPopup(projectTitle) {
      popupProjectTitle.value = projectTitle;
      showPopup.value = true;
    }
    function closePopups() {
      showPopup.value = false;
      showAboutPopup.value = false;
    }
    defineShortcuts({
      o: () => showAboutPopup.value = !showAboutPopup.value,
      p: () => showPopup.value = !showPopup.value,
      escape: () => closePopups()
    });
    useMobileSwipeHint();
    const { currentSectionIndex } = useSectionTracking(projectCount);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LogoTop = __nuxt_component_0$1;
      const _component_LogoBottom = __nuxt_component_1;
      const _component_LazyHamburgerMenu = __nuxt_component_2_lazy;
      const _component_HeroSection = __nuxt_component_3;
      const _component_MotionCarousel = __nuxt_component_4;
      const _component_ProjectIndex = __nuxt_component_5;
      const _component_ProjectPopup = __nuxt_component_6;
      const _component_AboutPopup = __nuxt_component_7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "contents" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LogoTop, {
        "is-hero": vueExports.unref(currentSectionIndex) === 0,
        "show-about-popup": vueExports.unref(showAboutPopup),
        "show-popup": vueExports.unref(showPopup),
        onClick: ($event) => showAboutPopup.value = true
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LogoBottom, {
        "is-hero": vueExports.unref(currentSectionIndex) === 0,
        "show-about-popup": vueExports.unref(showAboutPopup),
        "show-popup": vueExports.unref(showPopup),
        onClick: ($event) => showAboutPopup.value = true
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LazyHamburgerMenu, {
        "is-popup-visible": vueExports.unref(showPopup) || vueExports.unref(showAboutPopup)
      }, null, _parent));
      _push(`<main class="snap-y snap-mandatory overflow-y-scroll bg-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
        height: "100lvh",
        scrollBehavior: "smooth",
        scrollSnapType: "y mandatory"
      })}">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_HeroSection, { "is-about-popup-visible": vueExports.unref(showAboutPopup) }, null, _parent));
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(projectsData), (project, index2) => {
        _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `project-${index2}`)} class="relative w-full snap-center" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "height": "100lvh" })}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_MotionCarousel, {
          images: project.images,
          "project-title": project.title,
          "total-slides": _ctx.$device.isMobile ? project.images.length + 2 : project.images.length + 1,
          "show-top-progress-bar": _ctx.$device.isMobile,
          "is-popup-visible": vueExports.unref(showPopup),
          "is-about-popup-visible": vueExports.unref(showAboutPopup),
          onShowPopup: handleShowPopup
        }, null, _parent));
        _push(`</section>`);
      });
      _push(`<!--]-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectIndex, null, null, _parent));
      _push(`</main>`);
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (vueExports.unref(showPopup)) {
          _push2(`<div class="fixed inset-0 z-9998" role="button" tabindex="-1" aria-label="Close popup"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (vueExports.unref(showAboutPopup)) {
          _push2(`<div class="popup-backdrop fixed inset-0 z-9998" role="button" tabindex="-1" aria-label="Close popup"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (vueExports.unref(showPopup)) {
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectPopup, {
            class: "relative z-9999",
            "project-title": vueExports.unref(popupProjectTitle),
            onClick: () => {
            }
          }, null, _parent));
        } else {
          _push2(`<!---->`);
        }
        if (vueExports.unref(showAboutPopup)) {
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AboutPopup, {
            class: "relative z-9999",
            onClick: () => {
            }
          }, null, _parent));
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));

export { __nuxt_component_0 as _, index as i, usePortfolioProjects as u };
//# sourceMappingURL=index-CA6a8yDh.mjs.map
