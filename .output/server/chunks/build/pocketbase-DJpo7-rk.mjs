import { v as vueExports, l as useForwardExpose, P as Primitive, u as useRuntimeConfig } from './server.mjs';
import PocketBase from 'pocketbase';

var Label_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Label",
  props: {
    for: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "label"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { onMousedown: _cache[0] || (_cache[0] = (event) => {
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }) }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var Label_default = Label_vue_vue_type_script_setup_true_lang_default;
let pbInstance = null;
function usePocketBase() {
  if (!pbInstance) {
    const config = useRuntimeConfig();
    pbInstance = new PocketBase(config.public.pbUrl);
  }
  return pbInstance;
}
const pb = new Proxy({}, {
  get(_target, prop) {
    const instance = usePocketBase();
    return Reflect.get(instance, prop);
  }
});
function getImageUrl(record, filename) {
  const config = useRuntimeConfig();
  return `${config.public.pbUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
}

export { Label_default as L, getImageUrl as g, pb as p };
//# sourceMappingURL=pocketbase-DJpo7-rk.mjs.map
