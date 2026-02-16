import { v as vueExports, G as useAppConfig, S as useForwardPropsEmits, N as reactivePick, U as usePortal, H as tv, s as serverRenderer_cjs_prodExports, V as VisuallyHidden_default, O as useFormField, L as useComponentIcons, P as Primitive, b as _sfc_main$f, I as _sfc_main$c, F as useLocale$1, K as useFieldGroup, _ as _sfc_main$9, j as useVModel$1, D as usePrimitiveElement, m as isNullish, l as useForwardExpose, ab as useFocusWithin, ac as useCollection, k as createContext, ad as looseToNumber, i as injectConfigProviderContext, a9 as reactiveComputed$1, q as getActiveElement, g as unrefElement, aa as createEventHook } from './server.mjs';
import { d as DialogTrigger_default, e as DialogPortal_default, f as DialogTitle_default, g as DialogDescription_default, D as DialogRoot_default, b as DialogOverlay_default, c as DialogContent_default, u as useFormControl, V as VisuallyHiddenInput_default, a as useId } from './dashboard-Co8oTG6T.mjs';
import { h as useVModel } from './index-CtsWe4-H.mjs';
import { U as isEqual } from '../nitro/nitro.mjs';

function clamp(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  return Math.min(max, Math.max(min, value));
}
function roundToStepPrecision(value, step) {
  let roundedValue = value;
  const stepString = step.toString();
  const pointIndex = stepString.indexOf(".");
  const precision = pointIndex >= 0 ? stepString.length - pointIndex : 0;
  if (precision > 0) {
    const pow = 10 ** precision;
    roundedValue = Math.round(roundedValue * pow) / pow;
  }
  return roundedValue;
}
function snapValueToStep(value, min, max, step) {
  min = Number(min);
  max = Number(max);
  const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
  let snappedValue = roundToStepPrecision(Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder, step);
  if (!Number.isNaN(min)) {
    if (snappedValue < min) snappedValue = min;
    else if (!Number.isNaN(max) && snappedValue > max) snappedValue = min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step;
  } else if (!Number.isNaN(max) && snappedValue > max) snappedValue = Math.floor(roundToStepPrecision(max / step, step)) * step;
  snappedValue = roundToStepPrecision(snappedValue, step);
  return snappedValue;
}
const ignoredElement = ["INPUT", "TEXTAREA"];
function useArrowNavigation(e, currentElement, parentElement, options = {}) {
  if (!currentElement || options.enableIgnoredElement && ignoredElement.includes(currentElement.nodeName)) return null;
  const { arrowKeyOptions = "both", attributeName = "[data-reka-collection-item]", itemsArray = [], loop = true, dir = "ltr", preventScroll = true, focus = false } = options;
  const [right, left, up, down, home, end] = [
    e.key === "ArrowRight",
    e.key === "ArrowLeft",
    e.key === "ArrowUp",
    e.key === "ArrowDown",
    e.key === "Home",
    e.key === "End"
  ];
  const goingVertical = up || down;
  const goingHorizontal = right || left;
  if (!home && !end && (!goingVertical && !goingHorizontal || arrowKeyOptions === "vertical" && goingHorizontal || arrowKeyOptions === "horizontal" && goingVertical)) return null;
  const allCollectionItems = itemsArray;
  if (!allCollectionItems.length) return null;
  if (preventScroll) e.preventDefault();
  let item = null;
  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === "ltr" ? right : left;
    item = findNextFocusableElement(allCollectionItems, currentElement, {
      goForward,
      loop
    });
  } else if (home) item = allCollectionItems.at(0) || null;
  else if (end) item = allCollectionItems.at(-1) || null;
  if (focus) item?.focus();
  return item;
}
function findNextFocusableElement(elements, currentElement, options, iterations = elements.length) {
  if (--iterations === 0) return null;
  const index = elements.indexOf(currentElement);
  const newIndex = options.goForward ? index + 1 : index - 1;
  if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) return null;
  const adjustedNewIndex = (newIndex + elements.length) % elements.length;
  const candidate = elements[adjustedNewIndex];
  if (!candidate) return null;
  const isDisabled = candidate.hasAttribute("disabled") && candidate.getAttribute("disabled") !== "false";
  if (isDisabled) return findNextFocusableElement(elements, candidate, options, iterations);
  return candidate;
}
function useDirection(dir) {
  const context = injectConfigProviderContext({ dir: vueExports.ref("ltr") });
  return vueExports.computed(() => dir?.value || context.dir?.value || "ltr");
}
function useLocale(locale) {
  const context = injectConfigProviderContext({ locale: vueExports.ref("en") });
  return vueExports.computed(() => locale?.value || context.locale?.value || "en");
}
let $488c6ddbf4ef74c2$var$formatterCache = /* @__PURE__ */ new Map();
let $488c6ddbf4ef74c2$var$supportsSignDisplay = false;
try {
  $488c6ddbf4ef74c2$var$supportsSignDisplay = new Intl.NumberFormat("de-DE", {
    signDisplay: "exceptZero"
  }).resolvedOptions().signDisplay === "exceptZero";
} catch {
}
let $488c6ddbf4ef74c2$var$supportsUnit = false;
try {
  $488c6ddbf4ef74c2$var$supportsUnit = new Intl.NumberFormat("de-DE", {
    style: "unit",
    unit: "degree"
  }).resolvedOptions().style === "unit";
} catch {
}
const $488c6ddbf4ef74c2$var$UNITS = {
  degree: {
    narrow: {
      default: "°",
      "ja-JP": " 度",
      "zh-TW": "度",
      "sl-SI": " °"
    }
  }
};
class $488c6ddbf4ef74c2$export$cc77c4ff7e8673c5 {
  /** Formats a number value as a string, according to the locale and options provided to the constructor. */
  format(value) {
    let res = "";
    if (!$488c6ddbf4ef74c2$var$supportsSignDisplay && this.options.signDisplay != null) res = $488c6ddbf4ef74c2$export$711b50b3c525e0f2(this.numberFormatter, this.options.signDisplay, value);
    else res = this.numberFormatter.format(value);
    if (this.options.style === "unit" && !$488c6ddbf4ef74c2$var$supportsUnit) {
      var _UNITS_unit;
      let { unit, unitDisplay = "short", locale } = this.resolvedOptions();
      if (!unit) return res;
      let values = (_UNITS_unit = $488c6ddbf4ef74c2$var$UNITS[unit]) === null || _UNITS_unit === void 0 ? void 0 : _UNITS_unit[unitDisplay];
      res += values[locale] || values.default;
    }
    return res;
  }
  /** Formats a number to an array of parts such as separators, digits, punctuation, and more. */
  formatToParts(value) {
    return this.numberFormatter.formatToParts(value);
  }
  /** Formats a number range as a string. */
  formatRange(start, end) {
    if (typeof this.numberFormatter.formatRange === "function") return this.numberFormatter.formatRange(start, end);
    if (end < start) throw new RangeError("End date must be >= start date");
    return `${this.format(start)} – ${this.format(end)}`;
  }
  /** Formats a number range as an array of parts. */
  formatRangeToParts(start, end) {
    if (typeof this.numberFormatter.formatRangeToParts === "function") return this.numberFormatter.formatRangeToParts(start, end);
    if (end < start) throw new RangeError("End date must be >= start date");
    let startParts = this.numberFormatter.formatToParts(start);
    let endParts = this.numberFormatter.formatToParts(end);
    return [
      ...startParts.map((p) => ({
        ...p,
        source: "startRange"
      })),
      {
        type: "literal",
        value: " – ",
        source: "shared"
      },
      ...endParts.map((p) => ({
        ...p,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let options = this.numberFormatter.resolvedOptions();
    if (!$488c6ddbf4ef74c2$var$supportsSignDisplay && this.options.signDisplay != null) options = {
      ...options,
      signDisplay: this.options.signDisplay
    };
    if (!$488c6ddbf4ef74c2$var$supportsUnit && this.options.style === "unit") options = {
      ...options,
      style: "unit",
      unit: this.options.unit,
      unitDisplay: this.options.unitDisplay
    };
    return options;
  }
  constructor(locale, options = {}) {
    this.numberFormatter = $488c6ddbf4ef74c2$var$getCachedNumberFormatter(locale, options);
    this.options = options;
  }
}
function $488c6ddbf4ef74c2$var$getCachedNumberFormatter(locale, options = {}) {
  let { numberingSystem } = options;
  if (numberingSystem && locale.includes("-nu-")) {
    if (!locale.includes("-u-")) locale += "-u-";
    locale += `-nu-${numberingSystem}`;
  }
  if (options.style === "unit" && !$488c6ddbf4ef74c2$var$supportsUnit) {
    var _UNITS_unit;
    let { unit, unitDisplay = "short" } = options;
    if (!unit) throw new Error('unit option must be provided with style: "unit"');
    if (!((_UNITS_unit = $488c6ddbf4ef74c2$var$UNITS[unit]) === null || _UNITS_unit === void 0 ? void 0 : _UNITS_unit[unitDisplay])) throw new Error(`Unsupported unit ${unit} with unitDisplay = ${unitDisplay}`);
    options = {
      ...options,
      style: "decimal"
    };
  }
  let cacheKey = locale + (options ? Object.entries(options).sort((a, b) => a[0] < b[0] ? -1 : 1).join() : "");
  if ($488c6ddbf4ef74c2$var$formatterCache.has(cacheKey)) return $488c6ddbf4ef74c2$var$formatterCache.get(cacheKey);
  let numberFormatter = new Intl.NumberFormat(locale, options);
  $488c6ddbf4ef74c2$var$formatterCache.set(cacheKey, numberFormatter);
  return numberFormatter;
}
function $488c6ddbf4ef74c2$export$711b50b3c525e0f2(numberFormat, signDisplay, num) {
  if (signDisplay === "auto") return numberFormat.format(num);
  else if (signDisplay === "never") return numberFormat.format(Math.abs(num));
  else {
    let needsPositiveSign = false;
    if (signDisplay === "always") needsPositiveSign = num > 0 || Object.is(num, 0);
    else if (signDisplay === "exceptZero") {
      if (Object.is(num, -0) || Object.is(num, 0)) num = Math.abs(num);
      else needsPositiveSign = num > 0;
    }
    if (needsPositiveSign) {
      let negative = numberFormat.format(-num);
      let noSign = numberFormat.format(num);
      let minus = negative.replace(noSign, "").replace(/\u200e|\u061C/, "");
      if ([
        ...minus
      ].length !== 1) console.warn("@react-aria/i18n polyfill for NumberFormat signDisplay: Unsupported case");
      let positive = negative.replace(noSign, "!!!").replace(minus, "+").replace("!!!", noSign);
      return positive;
    } else return numberFormat.format(num);
  }
}
const $6c7bd7858deea686$var$CURRENCY_SIGN_REGEX = new RegExp("^.*\\(.*\\).*$");
const $6c7bd7858deea686$var$NUMBERING_SYSTEMS = [
  "latn",
  "arab",
  "hanidec",
  "deva",
  "beng",
  "fullwide"
];
class $6c7bd7858deea686$export$cd11ab140839f11d {
  /**
  * Parses the given string to a number. Returns NaN if a valid number could not be parsed.
  */
  parse(value) {
    return $6c7bd7858deea686$var$getNumberParserImpl(this.locale, this.options, value).parse(value);
  }
  /**
  * Returns whether the given string could potentially be a valid number. This should be used to
  * validate user input as the user types. If a `minValue` or `maxValue` is provided, the validity
  * of the minus/plus sign characters can be checked.
  */
  isValidPartialNumber(value, minValue, maxValue) {
    return $6c7bd7858deea686$var$getNumberParserImpl(this.locale, this.options, value).isValidPartialNumber(value, minValue, maxValue);
  }
  /**
  * Returns a numbering system for which the given string is valid in the current locale.
  * If no numbering system could be detected, the default numbering system for the current
  * locale is returned.
  */
  getNumberingSystem(value) {
    return $6c7bd7858deea686$var$getNumberParserImpl(this.locale, this.options, value).options.numberingSystem;
  }
  constructor(locale, options = {}) {
    this.locale = locale;
    this.options = options;
  }
}
const $6c7bd7858deea686$var$numberParserCache = /* @__PURE__ */ new Map();
function $6c7bd7858deea686$var$getNumberParserImpl(locale, options, value) {
  let defaultParser = $6c7bd7858deea686$var$getCachedNumberParser(locale, options);
  if (!locale.includes("-nu-") && !defaultParser.isValidPartialNumber(value)) {
    for (let numberingSystem of $6c7bd7858deea686$var$NUMBERING_SYSTEMS) if (numberingSystem !== defaultParser.options.numberingSystem) {
      let parser = $6c7bd7858deea686$var$getCachedNumberParser(locale + (locale.includes("-u-") ? "-nu-" : "-u-nu-") + numberingSystem, options);
      if (parser.isValidPartialNumber(value)) return parser;
    }
  }
  return defaultParser;
}
function $6c7bd7858deea686$var$getCachedNumberParser(locale, options) {
  let cacheKey = locale + (options ? Object.entries(options).sort((a, b) => a[0] < b[0] ? -1 : 1).join() : "");
  let parser = $6c7bd7858deea686$var$numberParserCache.get(cacheKey);
  if (!parser) {
    parser = new $6c7bd7858deea686$var$NumberParserImpl(locale, options);
    $6c7bd7858deea686$var$numberParserCache.set(cacheKey, parser);
  }
  return parser;
}
class $6c7bd7858deea686$var$NumberParserImpl {
  parse(value) {
    let fullySanitizedValue = this.sanitize(value);
    if (this.symbols.group)
      fullySanitizedValue = $6c7bd7858deea686$var$replaceAll(fullySanitizedValue, this.symbols.group, "");
    if (this.symbols.decimal) fullySanitizedValue = fullySanitizedValue.replace(this.symbols.decimal, ".");
    if (this.symbols.minusSign) fullySanitizedValue = fullySanitizedValue.replace(this.symbols.minusSign, "-");
    fullySanitizedValue = fullySanitizedValue.replace(this.symbols.numeral, this.symbols.index);
    if (this.options.style === "percent") {
      let isNegative = fullySanitizedValue.indexOf("-");
      fullySanitizedValue = fullySanitizedValue.replace("-", "");
      fullySanitizedValue = fullySanitizedValue.replace("+", "");
      let index = fullySanitizedValue.indexOf(".");
      if (index === -1) index = fullySanitizedValue.length;
      fullySanitizedValue = fullySanitizedValue.replace(".", "");
      if (index - 2 === 0) fullySanitizedValue = `0.${fullySanitizedValue}`;
      else if (index - 2 === -1) fullySanitizedValue = `0.0${fullySanitizedValue}`;
      else if (index - 2 === -2) fullySanitizedValue = "0.00";
      else fullySanitizedValue = `${fullySanitizedValue.slice(0, index - 2)}.${fullySanitizedValue.slice(index - 2)}`;
      if (isNegative > -1) fullySanitizedValue = `-${fullySanitizedValue}`;
    }
    let newValue = fullySanitizedValue ? +fullySanitizedValue : NaN;
    if (isNaN(newValue)) return NaN;
    if (this.options.style === "percent") {
      var _this_options_minimumFractionDigits, _this_options_maximumFractionDigits;
      let options = {
        ...this.options,
        style: "decimal",
        minimumFractionDigits: Math.min(((_this_options_minimumFractionDigits = this.options.minimumFractionDigits) !== null && _this_options_minimumFractionDigits !== void 0 ? _this_options_minimumFractionDigits : 0) + 2, 20),
        maximumFractionDigits: Math.min(((_this_options_maximumFractionDigits = this.options.maximumFractionDigits) !== null && _this_options_maximumFractionDigits !== void 0 ? _this_options_maximumFractionDigits : 0) + 2, 20)
      };
      return new $6c7bd7858deea686$export$cd11ab140839f11d(this.locale, options).parse(new $488c6ddbf4ef74c2$export$cc77c4ff7e8673c5(this.locale, options).format(newValue));
    }
    if (this.options.currencySign === "accounting" && $6c7bd7858deea686$var$CURRENCY_SIGN_REGEX.test(value)) newValue = -1 * newValue;
    return newValue;
  }
  sanitize(value) {
    value = value.replace(this.symbols.literals, "");
    if (this.symbols.minusSign) value = value.replace("-", this.symbols.minusSign);
    if (this.options.numberingSystem === "arab") {
      if (this.symbols.decimal) {
        value = value.replace(",", this.symbols.decimal);
        value = value.replace(String.fromCharCode(1548), this.symbols.decimal);
      }
      if (this.symbols.group) value = $6c7bd7858deea686$var$replaceAll(value, ".", this.symbols.group);
    }
    if (this.symbols.group === "’" && value.includes("'")) value = $6c7bd7858deea686$var$replaceAll(value, "'", this.symbols.group);
    if (this.options.locale === "fr-FR" && this.symbols.group) {
      value = $6c7bd7858deea686$var$replaceAll(value, " ", this.symbols.group);
      value = $6c7bd7858deea686$var$replaceAll(value, /\u00A0/g, this.symbols.group);
    }
    return value;
  }
  isValidPartialNumber(value, minValue = -Infinity, maxValue = Infinity) {
    value = this.sanitize(value);
    if (this.symbols.minusSign && value.startsWith(this.symbols.minusSign) && minValue < 0) value = value.slice(this.symbols.minusSign.length);
    else if (this.symbols.plusSign && value.startsWith(this.symbols.plusSign) && maxValue > 0) value = value.slice(this.symbols.plusSign.length);
    if (this.symbols.group && value.startsWith(this.symbols.group)) return false;
    if (this.symbols.decimal && value.indexOf(this.symbols.decimal) > -1 && this.options.maximumFractionDigits === 0) return false;
    if (this.symbols.group) value = $6c7bd7858deea686$var$replaceAll(value, this.symbols.group, "");
    value = value.replace(this.symbols.numeral, "");
    if (this.symbols.decimal) value = value.replace(this.symbols.decimal, "");
    return value.length === 0;
  }
  constructor(locale, options = {}) {
    this.locale = locale;
    if (options.roundingIncrement !== 1 && options.roundingIncrement != null) {
      if (options.maximumFractionDigits == null && options.minimumFractionDigits == null) {
        options.maximumFractionDigits = 0;
        options.minimumFractionDigits = 0;
      } else if (options.maximumFractionDigits == null) options.maximumFractionDigits = options.minimumFractionDigits;
      else if (options.minimumFractionDigits == null) options.minimumFractionDigits = options.maximumFractionDigits;
    }
    this.formatter = new Intl.NumberFormat(locale, options);
    this.options = this.formatter.resolvedOptions();
    this.symbols = $6c7bd7858deea686$var$getSymbols(locale, this.formatter, this.options, options);
    var _this_options_minimumFractionDigits, _this_options_maximumFractionDigits;
    if (this.options.style === "percent" && (((_this_options_minimumFractionDigits = this.options.minimumFractionDigits) !== null && _this_options_minimumFractionDigits !== void 0 ? _this_options_minimumFractionDigits : 0) > 18 || ((_this_options_maximumFractionDigits = this.options.maximumFractionDigits) !== null && _this_options_maximumFractionDigits !== void 0 ? _this_options_maximumFractionDigits : 0) > 18)) console.warn("NumberParser cannot handle percentages with greater than 18 decimal places, please reduce the number in your options.");
  }
}
const $6c7bd7858deea686$var$nonLiteralParts = /* @__PURE__ */ new Set([
  "decimal",
  "fraction",
  "integer",
  "minusSign",
  "plusSign",
  "group"
]);
const $6c7bd7858deea686$var$pluralNumbers = [
  0,
  4,
  2,
  1,
  11,
  20,
  3,
  7,
  100,
  21,
  0.1,
  1.1
];
function $6c7bd7858deea686$var$getSymbols(locale, formatter, intlOptions, originalOptions) {
  var _allParts_find, _posAllParts_find, _decimalParts_find, _allParts_find1;
  let symbolFormatter = new Intl.NumberFormat(locale, {
    ...intlOptions,
    // Resets so we get the full range of symbols
    minimumSignificantDigits: 1,
    maximumSignificantDigits: 21,
    roundingIncrement: 1,
    roundingPriority: "auto",
    roundingMode: "halfExpand"
  });
  let allParts = symbolFormatter.formatToParts(-10000.111);
  let posAllParts = symbolFormatter.formatToParts(10000.111);
  let pluralParts = $6c7bd7858deea686$var$pluralNumbers.map((n) => symbolFormatter.formatToParts(n));
  var _allParts_find_value;
  let minusSign = (_allParts_find_value = (_allParts_find = allParts.find((p) => p.type === "minusSign")) === null || _allParts_find === void 0 ? void 0 : _allParts_find.value) !== null && _allParts_find_value !== void 0 ? _allParts_find_value : "-";
  let plusSign = (_posAllParts_find = posAllParts.find((p) => p.type === "plusSign")) === null || _posAllParts_find === void 0 ? void 0 : _posAllParts_find.value;
  if (!plusSign && ((originalOptions === null || originalOptions === void 0 ? void 0 : originalOptions.signDisplay) === "exceptZero" || (originalOptions === null || originalOptions === void 0 ? void 0 : originalOptions.signDisplay) === "always")) plusSign = "+";
  let decimalParts = new Intl.NumberFormat(locale, {
    ...intlOptions,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).formatToParts(1e-3);
  let decimal = (_decimalParts_find = decimalParts.find((p) => p.type === "decimal")) === null || _decimalParts_find === void 0 ? void 0 : _decimalParts_find.value;
  let group = (_allParts_find1 = allParts.find((p) => p.type === "group")) === null || _allParts_find1 === void 0 ? void 0 : _allParts_find1.value;
  let allPartsLiterals = allParts.filter((p) => !$6c7bd7858deea686$var$nonLiteralParts.has(p.type)).map((p) => $6c7bd7858deea686$var$escapeRegex(p.value));
  let pluralPartsLiterals = pluralParts.flatMap((p) => p.filter((p2) => !$6c7bd7858deea686$var$nonLiteralParts.has(p2.type)).map((p2) => $6c7bd7858deea686$var$escapeRegex(p2.value)));
  let sortedLiterals = [
    .../* @__PURE__ */ new Set([
      ...allPartsLiterals,
      ...pluralPartsLiterals
    ])
  ].sort((a, b) => b.length - a.length);
  let literals = sortedLiterals.length === 0 ? new RegExp("[\\p{White_Space}]", "gu") : new RegExp(`${sortedLiterals.join("|")}|[\\p{White_Space}]`, "gu");
  let numerals = [
    ...new Intl.NumberFormat(intlOptions.locale, {
      useGrouping: false
    }).format(9876543210)
  ].reverse();
  let indexes = new Map(numerals.map((d, i) => [
    d,
    i
  ]));
  let numeral = new RegExp(`[${numerals.join("")}]`, "g");
  let index = (d) => String(indexes.get(d));
  return {
    minusSign,
    plusSign,
    decimal,
    group,
    literals,
    numeral,
    index
  };
}
function $6c7bd7858deea686$var$replaceAll(str, find, replace) {
  if (str.replaceAll) return str.replaceAll(find, replace);
  return str.split(find).join(replace);
}
function $6c7bd7858deea686$var$escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function usePressedHold(options) {
  const { disabled } = options;
  vueExports.ref();
  const triggerHook = createEventHook();
  const isPressed = vueExports.ref(false);
  vueExports.computed(() => unrefElement(options.target));
  return {
    isPressed,
    onTrigger: triggerHook.on
  };
}
function useNumberFormatter(locale, options = vueExports.ref({})) {
  return reactiveComputed$1(() => new $488c6ddbf4ef74c2$export$cc77c4ff7e8673c5(locale.value, options.value));
}
function useNumberParser(locale, options = vueExports.ref({})) {
  return reactiveComputed$1(() => new $6c7bd7858deea686$export$cd11ab140839f11d(locale.value, options.value));
}
function handleDecimalOperation(operator, value1, value2) {
  let result = operator === "+" ? value1 + value2 : value1 - value2;
  if (value1 % 1 !== 0 || value2 % 1 !== 0) {
    const value1Decimal = value1.toString().split(".");
    const value2Decimal = value2.toString().split(".");
    const value1DecimalLength = value1Decimal[1] && value1Decimal[1].length || 0;
    const value2DecimalLength = value2Decimal[1] && value2Decimal[1].length || 0;
    const multiplier = 10 ** Math.max(value1DecimalLength, value2DecimalLength);
    value1 = Math.round(value1 * multiplier);
    value2 = Math.round(value2 * multiplier);
    result = operator === "+" ? value1 + value2 : value1 - value2;
    result /= multiplier;
  }
  return result;
}
const [injectNumberFieldRootContext, provideNumberFieldRootContext] = createContext("NumberFieldRoot");
var NumberFieldRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "NumberFieldRoot",
  props: {
    defaultValue: {
      type: Number,
      required: false,
      default: void 0
    },
    modelValue: {
      type: [Number, null],
      required: false
    },
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    },
    step: {
      type: Number,
      required: false,
      default: 1
    },
    stepSnapping: {
      type: Boolean,
      required: false,
      default: true
    },
    formatOptions: {
      type: null,
      required: false
    },
    locale: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    readonly: {
      type: Boolean,
      required: false
    },
    disableWheelChange: {
      type: Boolean,
      required: false
    },
    invertWheelChange: {
      type: Boolean,
      required: false
    },
    id: {
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
      default: "div"
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
    const emits = __emit;
    const { disabled, readonly, disableWheelChange, invertWheelChange, min, max, step, stepSnapping, formatOptions, id, locale: propLocale } = vueExports.toRefs(props);
    const modelValue = useVModel$1(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === void 0
    });
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const locale = useLocale(propLocale);
    const isFormControl = useFormControl(currentElement);
    const inputEl = vueExports.ref();
    const isDecreaseDisabled = vueExports.computed(() => !isNullish(modelValue.value) && (clampInputValue(modelValue.value) === min.value || min.value && !isNaN(modelValue.value) ? handleDecimalOperation("-", modelValue.value, step.value) < min.value : false));
    const isIncreaseDisabled = vueExports.computed(() => !isNullish(modelValue.value) && (clampInputValue(modelValue.value) === max.value || max.value && !isNaN(modelValue.value) ? handleDecimalOperation("+", modelValue.value, step.value) > max.value : false));
    function handleChangingValue(type, multiplier = 1) {
      inputEl.value?.focus();
      if (props.disabled || props.readonly) return;
      const currentInputValue = numberParser.parse(inputEl.value?.value ?? "");
      if (isNaN(currentInputValue)) modelValue.value = min.value ?? 0;
      else if (type === "increase") modelValue.value = clampInputValue(currentInputValue + (step.value ?? 1) * multiplier);
      else modelValue.value = clampInputValue(currentInputValue - (step.value ?? 1) * multiplier);
    }
    function handleIncrease(multiplier = 1) {
      handleChangingValue("increase", multiplier);
    }
    function handleDecrease(multiplier = 1) {
      handleChangingValue("decrease", multiplier);
    }
    function handleMinMaxValue(type) {
      if (type === "min" && min.value !== void 0) modelValue.value = clampInputValue(min.value);
      else if (type === "max" && max.value !== void 0) modelValue.value = clampInputValue(max.value);
    }
    const numberFormatter = useNumberFormatter(locale, formatOptions);
    const numberParser = useNumberParser(locale, formatOptions);
    const inputMode = vueExports.computed(() => {
      const hasDecimals = numberFormatter.resolvedOptions().maximumFractionDigits > 0;
      return hasDecimals ? "decimal" : "numeric";
    });
    const textValueFormatter = useNumberFormatter(locale, formatOptions);
    const textValue = vueExports.computed(() => isNullish(modelValue.value) || isNaN(modelValue.value) ? "" : textValueFormatter.format(modelValue.value));
    function validate(val) {
      return numberParser.isValidPartialNumber(val, min.value, max.value);
    }
    function setInputValue(val) {
      if (inputEl.value) inputEl.value.value = val;
    }
    function clampInputValue(val) {
      let clampedValue;
      if (step.value === void 0 || isNaN(step.value) || !stepSnapping.value) clampedValue = clamp(val, min.value, max.value);
      else clampedValue = snapValueToStep(val, min.value, max.value, step.value);
      clampedValue = numberParser.parse(numberFormatter.format(clampedValue));
      return clampedValue;
    }
    function applyInputValue(val) {
      const parsedValue = numberParser.parse(val);
      modelValue.value = isNaN(parsedValue) ? void 0 : clampInputValue(parsedValue);
      if (!val.length) return setInputValue(val);
      if (isNaN(parsedValue)) return setInputValue(textValue.value);
      return setInputValue(textValue.value);
    }
    provideNumberFieldRootContext({
      modelValue,
      handleDecrease,
      handleIncrease,
      handleMinMaxValue,
      inputMode,
      inputEl,
      onInputElement: (el) => inputEl.value = el,
      textValue,
      validate,
      applyInputValue,
      disabled,
      readonly,
      disableWheelChange,
      invertWheelChange,
      max,
      min,
      isDecreaseDisabled,
      isIncreaseDisabled,
      id
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(_ctx.$attrs, {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        role: "group",
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-disabled": vueExports.unref(disabled) ? "" : void 0,
        "data-readonly": vueExports.unref(readonly) ? "" : void 0
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
          modelValue: vueExports.unref(modelValue),
          textValue: textValue.value
        }), vueExports.unref(isFormControl) && _ctx.name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHiddenInput_default), {
          key: 0,
          type: "text",
          value: vueExports.unref(modelValue),
          name: _ctx.name,
          disabled: vueExports.unref(disabled),
          readonly: vueExports.unref(readonly),
          required: _ctx.required
        }, null, 8, [
          "value",
          "name",
          "disabled",
          "readonly",
          "required"
        ])) : vueExports.createCommentVNode("v-if", true)]),
        _: 3
      }, 16, [
        "as",
        "as-child",
        "data-disabled",
        "data-readonly"
      ]);
    };
  }
});
var NumberFieldRoot_default = NumberFieldRoot_vue_vue_type_script_setup_true_lang_default;
var NumberFieldDecrement_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NumberFieldDecrement",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
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
    const rootContext = injectNumberFieldRootContext();
    const isDisabled = vueExports.computed(() => rootContext.disabled?.value || rootContext.readonly.value || props.disabled || rootContext.isDecreaseDisabled.value);
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const { isPressed, onTrigger } = usePressedHold({
      target: currentElement,
      disabled: isDisabled
    });
    onTrigger(() => {
      rootContext.handleDecrease();
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        tabindex: "-1",
        "aria-label": "Decrease",
        type: _ctx.as === "button" ? "button" : void 0,
        style: { userSelect: vueExports.unref(isPressed) ? "none" : void 0 },
        disabled: isDisabled.value ? "" : void 0,
        "data-disabled": isDisabled.value ? "" : void 0,
        "data-pressed": vueExports.unref(isPressed) ? "true" : void 0,
        onContextmenu: _cache[0] || (_cache[0] = vueExports.withModifiers(() => {
        }, ["prevent"]))
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "type",
        "style",
        "disabled",
        "data-disabled",
        "data-pressed"
      ]);
    };
  }
});
var NumberFieldDecrement_default = NumberFieldDecrement_vue_vue_type_script_setup_true_lang_default;
var NumberFieldIncrement_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NumberFieldIncrement",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
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
    const rootContext = injectNumberFieldRootContext();
    const isDisabled = vueExports.computed(() => rootContext.disabled?.value || rootContext.readonly.value || props.disabled || rootContext.isIncreaseDisabled.value);
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const { isPressed, onTrigger } = usePressedHold({
      target: currentElement,
      disabled: isDisabled
    });
    onTrigger(() => {
      rootContext.handleIncrease();
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        tabindex: "-1",
        "aria-label": "Increase",
        type: _ctx.as === "button" ? "button" : void 0,
        style: { userSelect: vueExports.unref(isPressed) ? "none" : void 0 },
        disabled: isDisabled.value ? "" : void 0,
        "data-disabled": isDisabled.value ? "" : void 0,
        "data-pressed": vueExports.unref(isPressed) ? "true" : void 0,
        onContextmenu: _cache[0] || (_cache[0] = vueExports.withModifiers(() => {
        }, ["prevent"]))
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "type",
        "style",
        "disabled",
        "data-disabled",
        "data-pressed"
      ]);
    };
  }
});
var NumberFieldIncrement_default = NumberFieldIncrement_vue_vue_type_script_setup_true_lang_default;
var NumberFieldInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NumberFieldInput",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "input"
    }
  },
  setup(__props) {
    const props = __props;
    const { primitiveElement } = usePrimitiveElement();
    const rootContext = injectNumberFieldRootContext();
    function handleWheelEvent(event) {
      if (rootContext.disableWheelChange.value) return;
      if (event.target !== getActiveElement()) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      if (event.deltaY > 0) rootContext.invertWheelChange.value ? rootContext.handleDecrease() : rootContext.handleIncrease();
      else if (event.deltaY < 0) rootContext.invertWheelChange.value ? rootContext.handleIncrease() : rootContext.handleDecrease();
    }
    const inputValue = vueExports.ref(rootContext.textValue.value);
    vueExports.watch(() => rootContext.textValue.value, () => {
      inputValue.value = rootContext.textValue.value;
    }, {
      immediate: true,
      deep: true
    });
    function handleChange() {
      requestAnimationFrame(() => {
        inputValue.value = rootContext.textValue.value;
      });
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, {
        id: vueExports.unref(rootContext).id.value,
        ref_key: "primitiveElement",
        ref: primitiveElement,
        value: inputValue.value,
        role: "spinbutton",
        type: "text",
        tabindex: "0",
        inputmode: vueExports.unref(rootContext).inputMode.value,
        disabled: vueExports.unref(rootContext).disabled.value ? "" : void 0,
        "data-disabled": vueExports.unref(rootContext).disabled.value ? "" : void 0,
        readonly: vueExports.unref(rootContext).readonly.value ? "" : void 0,
        "data-readonly": vueExports.unref(rootContext).readonly.value ? "" : void 0,
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: "false",
        "aria-roledescription": "Number field",
        "aria-valuenow": vueExports.unref(rootContext).modelValue.value,
        "aria-valuemin": vueExports.unref(rootContext).min.value,
        "aria-valuemax": vueExports.unref(rootContext).max.value,
        onKeydown: [
          _cache[0] || (_cache[0] = vueExports.withKeys(vueExports.withModifiers(($event) => vueExports.unref(rootContext).handleIncrease(), ["prevent"]), ["up"])),
          _cache[1] || (_cache[1] = vueExports.withKeys(vueExports.withModifiers(($event) => vueExports.unref(rootContext).handleDecrease(), ["prevent"]), ["down"])),
          _cache[2] || (_cache[2] = vueExports.withKeys(vueExports.withModifiers(($event) => vueExports.unref(rootContext).handleIncrease(10), ["prevent"]), ["page-up"])),
          _cache[3] || (_cache[3] = vueExports.withKeys(vueExports.withModifiers(($event) => vueExports.unref(rootContext).handleDecrease(10), ["prevent"]), ["page-down"])),
          _cache[4] || (_cache[4] = vueExports.withKeys(vueExports.withModifiers(($event) => vueExports.unref(rootContext).handleMinMaxValue("min"), ["prevent"]), ["home"])),
          _cache[5] || (_cache[5] = vueExports.withKeys(vueExports.withModifiers(($event) => vueExports.unref(rootContext).handleMinMaxValue("max"), ["prevent"]), ["end"])),
          _cache[8] || (_cache[8] = vueExports.withKeys(($event) => vueExports.unref(rootContext).applyInputValue($event.target?.value), ["enter"]))
        ],
        onWheel: handleWheelEvent,
        onBeforeinput: _cache[6] || (_cache[6] = (event) => {
          const target = event.target;
          let nextValue = target.value.slice(0, target.selectionStart ?? void 0) + (event.data ?? "") + target.value.slice(target.selectionEnd ?? void 0);
          if (!vueExports.unref(rootContext).validate(nextValue)) event.preventDefault();
        }),
        onInput: _cache[7] || (_cache[7] = (event) => {
          const target = event.target;
          inputValue.value = target.value;
        }),
        onChange: handleChange,
        onBlur: _cache[9] || (_cache[9] = ($event) => vueExports.unref(rootContext).applyInputValue($event.target?.value))
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "value",
        "inputmode",
        "disabled",
        "data-disabled",
        "readonly",
        "data-readonly",
        "aria-valuenow",
        "aria-valuemin",
        "aria-valuemax"
      ]);
    };
  }
});
var NumberFieldInput_default = NumberFieldInput_vue_vue_type_script_setup_true_lang_default;
const [injectTagsInputRootContext, provideTagsInputRootContext] = createContext("TagsInputRoot");
var TagsInputRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputRoot",
  props: {
    modelValue: {
      type: [Array, null],
      required: false
    },
    defaultValue: {
      type: Array,
      required: false,
      default: () => []
    },
    addOnPaste: {
      type: Boolean,
      required: false
    },
    addOnTab: {
      type: Boolean,
      required: false
    },
    addOnBlur: {
      type: Boolean,
      required: false
    },
    duplicate: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    delimiter: {
      type: null,
      required: false,
      default: ","
    },
    dir: {
      type: String,
      required: false
    },
    max: {
      type: Number,
      required: false,
      default: 0
    },
    id: {
      type: String,
      required: false
    },
    convertValue: {
      type: Function,
      required: false
    },
    displayValue: {
      type: Function,
      required: false,
      default: (value) => value.toString()
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
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
  emits: [
    "update:modelValue",
    "invalid",
    "addTag",
    "removeTag"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { addOnPaste, disabled, delimiter, max, id, dir: propDir, addOnBlur, addOnTab } = vueExports.toRefs(props);
    const dir = useDirection(propDir);
    const modelValue = useVModel$1(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: true,
      deep: true
    });
    const { forwardRef, currentElement } = useForwardExpose();
    const { focused } = useFocusWithin(currentElement);
    const isFormControl = useFormControl(currentElement);
    const { getItems, CollectionSlot } = useCollection({ isProvider: true });
    const selectedElement = vueExports.ref();
    const isInvalidInput = vueExports.ref(false);
    const currentModelValue = vueExports.computed(() => Array.isArray(modelValue.value) ? [...modelValue.value] : []);
    function handleRemoveTag(index) {
      if (index !== -1) {
        const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
        modelValue.value = modelValue.value.filter((_2, i) => i !== index);
        emits("removeTag", collection[index].value);
      }
    }
    provideTagsInputRootContext({
      modelValue,
      onAddValue: (_payload) => {
        const array = [...currentModelValue.value];
        const modelValueIsObject = array.length > 0 && typeof array[0] === "object";
        const defaultValueIsObject = array.length > 0 && typeof props.defaultValue[0] === "object";
        if ((modelValueIsObject || defaultValueIsObject) && typeof props.convertValue !== "function") throw new Error("You must provide a `convertValue` function when using objects as values.");
        const payload = props.convertValue ? props.convertValue(_payload) : _payload;
        if (array.length >= max.value && !!max.value) {
          emits("invalid", payload);
          return false;
        }
        if (props.duplicate) {
          modelValue.value = [...array, payload];
          emits("addTag", payload);
          return true;
        } else {
          const exist = array.includes(payload);
          if (!exist) {
            modelValue.value = [...array, payload];
            emits("addTag", payload);
            return true;
          } else isInvalidInput.value = true;
        }
        emits("invalid", payload);
        return false;
      },
      onRemoveValue: handleRemoveTag,
      onInputKeydown: (event) => {
        const target = event.target;
        const collection = getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
        if (!collection.length) return;
        const lastTag = collection.at(-1);
        switch (event.key) {
          case "Delete":
          case "Backspace": {
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break;
            if (selectedElement.value) {
              const index = collection.findIndex((i) => i === selectedElement.value);
              handleRemoveTag(index);
              selectedElement.value = selectedElement.value === lastTag ? collection.at(index - 1) : collection.at(index + 1);
              event.preventDefault();
            } else if (event.key === "Backspace") {
              selectedElement.value = lastTag;
              event.preventDefault();
            }
            break;
          }
          case "Home":
          case "End":
          case "ArrowRight":
          case "ArrowLeft": {
            const isArrowRight = event.key === "ArrowRight" && dir.value === "ltr" || event.key === "ArrowLeft" && dir.value === "rtl";
            const isArrowLeft = !isArrowRight;
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break;
            if (isArrowLeft && !selectedElement.value) {
              selectedElement.value = lastTag;
              event.preventDefault();
            } else if (isArrowRight && lastTag && selectedElement.value === lastTag) {
              selectedElement.value = void 0;
              event.preventDefault();
            } else if (selectedElement.value) {
              const el = useArrowNavigation(event, selectedElement.value, void 0, {
                itemsArray: collection,
                loop: false,
                dir: dir.value
              });
              if (el) selectedElement.value = el;
              event.preventDefault();
            }
            break;
          }
          case "ArrowUp":
          case "ArrowDown": {
            if (selectedElement.value) event.preventDefault();
            break;
          }
          default:
            selectedElement.value = void 0;
        }
      },
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnBlur,
      addOnTab,
      dir,
      disabled,
      delimiter,
      max,
      id,
      displayValue: props.displayValue
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionSlot), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          dir: vueExports.unref(dir),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-invalid": isInvalidInput.value ? "" : void 0,
          "data-disabled": vueExports.unref(disabled) ? "" : void 0,
          "data-focused": vueExports.unref(focused) ? "" : void 0
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { modelValue: vueExports.unref(modelValue) }), vueExports.unref(isFormControl) && _ctx.name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHiddenInput_default), {
            key: 0,
            name: _ctx.name,
            value: vueExports.unref(modelValue),
            required: _ctx.required,
            disabled: vueExports.unref(disabled)
          }, null, 8, [
            "name",
            "value",
            "required",
            "disabled"
          ])) : vueExports.createCommentVNode("v-if", true)]),
          _: 3
        }, 8, [
          "dir",
          "as",
          "as-child",
          "data-invalid",
          "data-disabled",
          "data-focused"
        ])]),
        _: 3
      });
    };
  }
});
var TagsInputRoot_default = TagsInputRoot_vue_vue_type_script_setup_true_lang_default;
var TagsInputInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputInput",
  props: {
    placeholder: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
    },
    maxLength: {
      type: Number,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "input"
    }
  },
  setup(__props) {
    const context = injectTagsInputRootContext();
    const { forwardRef } = useForwardExpose();
    function handleBlur(event) {
      context.selectedElement.value = void 0;
      if (!context.addOnBlur.value) return;
      const target = event.target;
      if (!target.value) return;
      const isAdded = context.onAddValue(target.value);
      if (isAdded) target.value = "";
    }
    function handleTab(event) {
      if (!context.addOnTab.value) return;
      handleCustomKeydown(event);
    }
    const isComposing = vueExports.ref(false);
    function onCompositionStart() {
      isComposing.value = true;
    }
    function onCompositionEnd() {
      vueExports.nextTick(() => {
        isComposing.value = false;
      });
    }
    async function handleCustomKeydown(event) {
      if (isComposing.value) return;
      await vueExports.nextTick();
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!target.value) return;
      const isAdded = context.onAddValue(target.value);
      if (isAdded) target.value = "";
      event.preventDefault();
    }
    function handleInput(event) {
      context.isInvalidInput.value = false;
      if (event.data === null) return;
      const delimiter = context.delimiter.value;
      const matchesDelimiter = delimiter === event.data || delimiter instanceof RegExp && delimiter.test(event.data);
      if (matchesDelimiter) {
        const target = event.target;
        target.value = target.value.replace(delimiter, "");
        if (target.value.trim() === "") {
          target.value = "";
          return;
        }
        const isAdded = context.onAddValue(target.value);
        if (isAdded) target.value = "";
      }
    }
    function handlePaste(event) {
      if (context.addOnPaste.value) {
        event.preventDefault();
        const clipboardData = event.clipboardData;
        if (!clipboardData) return;
        const value = clipboardData.getData("text");
        if (context.delimiter.value) {
          const splitValue = value.split(context.delimiter.value);
          splitValue.forEach((v) => {
            context.onAddValue(v);
          });
        } else context.onAddValue(value);
      }
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        id: vueExports.unref(context).id?.value,
        ref: vueExports.unref(forwardRef),
        type: "text",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        as: _ctx.as,
        "as-child": _ctx.asChild,
        maxlength: _ctx.maxLength,
        placeholder: _ctx.placeholder,
        disabled: vueExports.unref(context).disabled.value,
        "data-invalid": vueExports.unref(context).isInvalidInput.value ? "" : void 0,
        onInput: handleInput,
        onKeydown: [
          vueExports.withKeys(handleCustomKeydown, ["enter"]),
          vueExports.withKeys(handleTab, ["tab"]),
          vueExports.unref(context).onInputKeydown
        ],
        onBlur: handleBlur,
        onCompositionstart: onCompositionStart,
        onCompositionend: onCompositionEnd,
        onPaste: handlePaste
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "as",
        "as-child",
        "maxlength",
        "placeholder",
        "disabled",
        "data-invalid",
        "onKeydown"
      ]);
    };
  }
});
var TagsInputInput_default = TagsInputInput_vue_vue_type_script_setup_true_lang_default;
const [injectTagsInputItemContext, provideTagsInputItemContext] = createContext("TagsInputItem");
var TagsInputItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
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
    const props = __props;
    const { value } = vueExports.toRefs(props);
    const context = injectTagsInputRootContext();
    const { forwardRef, currentElement } = useForwardExpose();
    const { CollectionItem } = useCollection();
    const isSelected = vueExports.computed(() => context.selectedElement.value === currentElement.value);
    const disabled = vueExports.computed(() => props.disabled || context.disabled.value);
    const itemContext = provideTagsInputItemContext({
      value,
      isSelected,
      disabled,
      textId: "",
      displayValue: vueExports.computed(() => context.displayValue(value.value))
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionItem), { value: vueExports.unref(value) }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "aria-labelledby": vueExports.unref(itemContext).textId,
          "aria-current": isSelected.value,
          "data-disabled": disabled.value ? "" : void 0,
          "data-state": isSelected.value ? "active" : "inactive"
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "aria-labelledby",
          "aria-current",
          "data-disabled",
          "data-state"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var TagsInputItem_default = TagsInputItem_vue_vue_type_script_setup_true_lang_default;
var TagsInputItemDelete_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputItemDelete",
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
    const context = injectTagsInputRootContext();
    const itemContext = injectTagsInputItemContext();
    const disabled = vueExports.computed(() => itemContext.disabled?.value || context.disabled.value);
    function handleDelete() {
      if (disabled.value) return;
      const index = context.modelValue.value.findIndex((i) => isEqual(i, itemContext.value.value));
      context.onRemoveValue(index);
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps({ tabindex: "-1" }, props, {
        "aria-labelledby": vueExports.unref(itemContext).textId,
        "aria-current": vueExports.unref(itemContext).isSelected.value,
        "data-state": vueExports.unref(itemContext).isSelected.value ? "active" : "inactive",
        "data-disabled": disabled.value ? "" : void 0,
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: handleDelete
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "aria-labelledby",
        "aria-current",
        "data-state",
        "data-disabled",
        "type"
      ]);
    };
  }
});
var TagsInputItemDelete_default = TagsInputItemDelete_vue_vue_type_script_setup_true_lang_default;
var TagsInputItemText_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputItemText",
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
    const props = __props;
    const itemContext = injectTagsInputItemContext();
    useForwardExpose();
    itemContext.textId ||= useId(void 0, "reka-tags-input-item-text");
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(itemContext).textId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {}, () => [vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(itemContext).displayValue.value), 1)])]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var TagsInputItemText_default = TagsInputItemText_vue_vue_type_script_setup_true_lang_default;
(function() {
  try {
    var a;
    if ("undefined" < "u") ;
  } catch (r) {
    console.error("vite-plugin-css-injected-by-js", r);
  }
})();
const rt = "undefined" < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const ut = (e) => typeof e < "u";
function st(e) {
  return JSON.parse(JSON.stringify(e));
}
function $e(e, n, s, i = {}) {
  var t, w, d;
  const {
    clone: v = false,
    passive: D = false,
    eventName: $,
    deep: T = false,
    defaultValue: r,
    shouldEmit: l
  } = i, h = vueExports.getCurrentInstance(), m = s || (h == null ? void 0 : h.emit) || ((t = h == null ? void 0 : h.$emit) == null ? void 0 : t.bind(h)) || ((d = (w = h == null ? void 0 : h.proxy) == null ? void 0 : w.$emit) == null ? void 0 : d.bind(h == null ? void 0 : h.proxy));
  let u = $;
  n || (n = "modelValue"), u = u || `update:${n.toString()}`;
  const L = (a) => v ? typeof v == "function" ? v(a) : st(a) : a, H = () => ut(e[n]) ? L(e[n]) : r, p = (a) => {
    l ? l(a) && m(u, a) : m(u, a);
  };
  if (D) {
    const a = H(), c = vueExports.ref(a);
    let f = false;
    return vueExports.watch(
      () => e[n],
      (y) => {
        f || (f = true, c.value = L(y), vueExports.nextTick(() => f = false));
      }
    ), vueExports.watch(
      c,
      (y) => {
        !f && (y !== e[n] || T) && p(y);
      },
      { deep: T }
    ), c;
  } else
    return vueExports.computed({
      get() {
        return H();
      },
      set(a) {
        p(a);
      }
    });
}
const [ee, ct] = createContext("DrawerRoot"), Ee = /* @__PURE__ */ new WeakMap();
function C(e, n, s = false) {
  if (!e || !(e instanceof HTMLElement) || !n)
    return;
  const i = {};
  Object.entries(n).forEach(([t, w]) => {
    if (t.startsWith("--")) {
      e.style.setProperty(t, w);
      return;
    }
    i[t] = e.style[t], e.style[t] = w;
  }), !s && Ee.set(e, i);
}
function ie(e, n) {
  const s = (void 0).getComputedStyle(e), i = s.transform || s.webkitTransform || s.mozTransform;
  let t = i.match(/^matrix3d\((.+)\)$/);
  return t ? Number.parseFloat(t[1].split(", ")[_(n) ? 13 : 12]) : (t = i.match(/^matrix\((.+)\)$/), t ? Number.parseFloat(t[1].split(", ")[_(n) ? 5 : 4]) : null);
}
function vt(e) {
  return 8 * (Math.log(e + 1) - 2);
}
function _(e) {
  switch (e) {
    case "top":
    case "bottom":
      return true;
    case "left":
    case "right":
      return false;
    default:
      return e;
  }
}
function de(e, n) {
  if (!e)
    return () => {
    };
  const s = e.style.cssText;
  return Object.assign(e.style, n), () => {
    e.style.cssText = s;
  };
}
function ft(...e) {
  return (...n) => {
    for (const s of e)
      typeof s == "function" && s(...n);
  };
}
const O = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
}, _e = 0.4, pt = 0.25, gt = 100, Be = 8, re = 16, Ce = 26, Oe = "vaul-dragging";
function mt({
  activeSnapPoint: e,
  snapPoints: n,
  drawerRef: s,
  overlayRef: i,
  fadeFromIndex: t,
  onSnapPointChange: w,
  direction: d
}) {
  const v = vueExports.ref(void 0);
  const $ = vueExports.computed(
    () => (n.value && e.value === n.value[n.value.length - 1]) ?? null
  ), T = vueExports.computed(
    () => n.value && n.value.length > 0 && ((t == null ? void 0 : t.value) || (t == null ? void 0 : t.value) === 0) && !Number.isNaN(t == null ? void 0 : t.value) && n.value[(t == null ? void 0 : t.value) ?? -1] === e.value || !n.value
  ), r = vueExports.computed(
    () => {
      var p;
      return ((p = n.value) == null ? void 0 : p.findIndex((a) => a === e.value)) ?? null;
    }
  ), l = vueExports.computed(
    () => {
      var p;
      return ((p = n.value) == null ? void 0 : p.map((a) => {
        const c = typeof a == "string";
        let f = 0;
        if (c && (f = Number.parseInt(a, 10)), _(d.value)) {
          const P = c ? f : v.value ? a * v.value.innerHeight : 0;
          return v.value ? d.value === "bottom" ? v.value.innerHeight - P : -v.value.innerHeight + P : P;
        }
        const y = c ? f : v.value ? a * v.value.innerWidth : 0;
        return v.value ? d.value === "right" ? v.value.innerWidth - y : -v.value.innerWidth + y : y;
      })) ?? [];
    }
  ), h = vueExports.computed(
    () => {
      var p;
      return r.value !== null ? (p = l.value) == null ? void 0 : p[r.value] : null;
    }
  ), m = (p) => {
    var c, f, y, P;
    const a = ((c = l.value) == null ? void 0 : c.findIndex((x) => x === p)) ?? null;
    vueExports.nextTick(() => {
      var x;
      w(a, l.value), C((x = s.value) == null ? void 0 : x.$el, {
        transition: `transform ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`,
        transform: _(d.value) ? `translate3d(0, ${p}px, 0)` : `translate3d(${p}px, 0, 0)`
      });
    }), l.value && a !== l.value.length - 1 && a !== (t == null ? void 0 : t.value) ? C((f = i.value) == null ? void 0 : f.$el, {
      transition: `opacity ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`,
      opacity: "0"
    }) : C((y = i.value) == null ? void 0 : y.$el, {
      transition: `opacity ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`,
      opacity: "1"
    }), e.value = a !== null ? ((P = n.value) == null ? void 0 : P[a]) ?? null : null;
  };
  vueExports.watch(
    [e, l, n],
    () => {
      var p;
      if (e.value) {
        const a = ((p = n.value) == null ? void 0 : p.findIndex((c) => c === e.value)) ?? -1;
        l.value && a !== -1 && typeof l.value[a] == "number" && m(l.value[a]);
      }
    },
    {
      immediate: true
      // if you want to run the effect immediately as well
    }
  );
  function u({
    draggedDistance: p,
    closeDrawer: a,
    velocity: c,
    dismissible: f
  }) {
    var j, G, z;
    if (t.value === void 0)
      return;
    const y = d.value === "bottom" || d.value === "right" ? (h.value ?? 0) - p : (h.value ?? 0) + p, P = r.value === t.value - 1, x = r.value === 0, W = p > 0;
    if (P && C((j = i.value) == null ? void 0 : j.$el, {
      transition: `opacity ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`
    }), c > 2 && !W) {
      f ? a() : m(l.value[0]);
      return;
    }
    if (c > 2 && W && l && n.value) {
      m(l.value[n.value.length - 1]);
      return;
    }
    const te = (G = l.value) == null ? void 0 : G.reduce((M, g) => typeof M != "number" || typeof g != "number" ? M : Math.abs(g - y) < Math.abs(M - y) ? g : M), V = _(d.value) ? (void 0).innerHeight : (void 0).innerWidth;
    if (c > _e && Math.abs(p) < V * 0.4) {
      const M = W ? 1 : -1;
      if (M > 0 && $) {
        m(l.value[(((z = n.value) == null ? void 0 : z.length) ?? 0) - 1]);
        return;
      }
      if (x && M < 0 && f && a(), r.value === null)
        return;
      m(l.value[r.value + M]);
      return;
    }
    m(te);
  }
  function L({ draggedDistance: p }) {
    var c;
    if (h.value === null)
      return;
    const a = d.value === "bottom" || d.value === "right" ? h.value - p : h.value + p;
    (d.value === "bottom" || d.value === "right") && a < l.value[l.value.length - 1] || (d.value === "top" || d.value === "left") && a > l.value[l.value.length - 1] || C((c = s.value) == null ? void 0 : c.$el, {
      transform: _(d.value) ? `translate3d(0, ${a}px, 0)` : `translate3d(${a}px, 0, 0)`
    });
  }
  function H(p, a) {
    if (!n.value || typeof r.value != "number" || !l.value || t.value === void 0)
      return null;
    const c = r.value === t.value - 1;
    if (r.value >= t.value && a)
      return 0;
    if (c && !a)
      return 1;
    if (!T.value && !c)
      return null;
    const y = c ? r.value + 1 : r.value - 1, P = c ? l.value[y] - l.value[y - 1] : l.value[y + 1] - l.value[y], x = p / Math.abs(P);
    return c ? 1 - x : x;
  }
  return {
    isLastSnapPoint: $,
    shouldFade: T,
    getPercentageDragged: H,
    activeSnapPointIndex: r,
    onRelease: u,
    onDrag: L,
    snapPointsOffset: l
  };
}
function Te() {
  return /^((?!chrome|android).)*safari/i.test((void 0).userAgent);
}
let Q = null;
function wt(e) {
  const { isOpen: n, modal: s, nested: i, hasBeenOpened: t, preventScrollRestoration: w, noBodyStyles: d } = e, v = vueExports.ref(""), D = vueExports.ref(0);
  function $() {
    if (Te() && Q === null && n.value && !d.value) {
      Q = {
        position: (void 0).body.style.position,
        top: (void 0).body.style.top,
        left: (void 0).body.style.left,
        height: (void 0).body.style.height
      };
      const { scrollX: r, innerHeight: l } = void 0;
      (void 0).body.style.setProperty("position", "fixed", "important"), Object.assign((void 0).body.style, {
        top: `${-D.value}px`,
        left: `${-r}px`,
        right: "0px",
        height: "auto"
      }), setTimeout(() => {
        requestAnimationFrame(() => {
          const h = l - (void 0).innerHeight;
          h && D.value >= l && ((void 0).body.style.top = `-${D.value + h}px`);
        });
      }, 300);
    }
  }
  function T() {
    if (Te() && Q !== null && !d.value) {
      const r = -Number.parseInt((void 0).body.style.top, 10), l = -Number.parseInt((void 0).body.style.left, 10);
      Object.assign((void 0).body.style, Q), (void 0).requestAnimationFrame(() => {
        if (w.value && v.value !== (void 0).location.href) {
          v.value = (void 0).location.href;
          return;
        }
        (void 0).scrollTo(l, r);
      }), Q = null;
    }
  }
  return vueExports.watch([n, t, v], () => {
    i.value || !t.value || (n.value ? ((void 0).matchMedia("(display-mode: standalone)").matches || $(), s.value || setTimeout(() => {
      T();
    }, 500)) : T());
  }), { restorePositionSetting: T };
}
function ht(e, n) {
  return e && e.value ? e : n;
}
function yt(e) {
  const {
    emitDrag: n,
    emitRelease: s,
    emitClose: i,
    emitOpenChange: t,
    open: w,
    dismissible: d,
    nested: v,
    modal: D,
    shouldScaleBackground: $,
    setBackgroundColorOnScale: T,
    scrollLockTimeout: r,
    closeThreshold: l,
    activeSnapPoint: h,
    fadeFromIndex: m,
    direction: u,
    noBodyStyles: L,
    handleOnly: H,
    preventScrollRestoration: p
  } = e, a = vueExports.ref(w.value ?? false), c = vueExports.ref(false), f = vueExports.ref(false), y = vueExports.ref(false), P = vueExports.ref(null), x = vueExports.ref(null), W = vueExports.ref(null), te = vueExports.ref(null), V = vueExports.ref(null), j = vueExports.ref(false), G = vueExports.ref(null), z = vueExports.ref(0), M = vueExports.ref(false);
  vueExports.ref(0);
  const g = vueExports.ref(null);
  vueExports.ref(0);
  const pe = vueExports.computed(() => {
    var o;
    return ((o = g.value) == null ? void 0 : o.$el.getBoundingClientRect().height) || 0;
  }), U = ht(
    e.snapPoints,
    vueExports.ref(void 0)
  ), Ne = vueExports.computed(() => {
    var o;
    return U && (((o = U.value) == null ? void 0 : o.length) ?? 0) > 0;
  }), Ae = vueExports.ref(null), {
    activeSnapPointIndex: ge,
    onRelease: xe,
    snapPointsOffset: He,
    onDrag: Ue,
    shouldFade: me,
    getPercentageDragged: Le
  } = mt({
    snapPoints: U,
    activeSnapPoint: h,
    drawerRef: g,
    fadeFromIndex: m,
    overlayRef: P,
    onSnapPointChange: Me,
    direction: u
  });
  function Me(o, R) {
    U.value && o === R.length - 1 && (x.value = /* @__PURE__ */ new Date());
  }
  wt({
    isOpen: a,
    modal: D,
    nested: v,
    hasBeenOpened: c,
    noBodyStyles: L,
    preventScrollRestoration: p
  });
  function ne() {
    return ((void 0).innerWidth - Ce) / (void 0).innerWidth;
  }
  function we(o, R) {
    var k;
    if (!o)
      return false;
    let b = o;
    const B = (k = (void 0).getSelection()) == null ? void 0 : k.toString(), E = g.value ? ie(g.value.$el, u.value) : null, A = /* @__PURE__ */ new Date();
    if (b.hasAttribute("data-vaul-no-drag") || b.closest("[data-vaul-no-drag]"))
      return false;
    if (u.value === "right" || u.value === "left")
      return true;
    if (x.value && A.getTime() - x.value.getTime() < 500)
      return false;
    if (E !== null && (u.value === "bottom" ? E > 0 : E < 0))
      return true;
    if (B && B.length > 0)
      return false;
    if (V.value && A.getTime() - V.value.getTime() < r.value && E === 0 || R)
      return V.value = A, false;
    for (; b; ) {
      if (b.scrollHeight > b.clientHeight) {
        if (b.scrollTop !== 0)
          return V.value = /* @__PURE__ */ new Date(), false;
        if (b.getAttribute("role") === "dialog")
          return true;
      }
      b = b.parentNode;
    }
    return true;
  }
  function ke(o) {
    !d.value && !U.value || g.value && !g.value.$el.contains(o.target) || (f.value = true, W.value = /* @__PURE__ */ new Date(), o.target.setPointerCapture(o.pointerId), z.value = _(u.value) ? o.clientY : o.clientX);
  }
  function Ie(o) {
    var R, b, B, E, A, k;
    if (g.value && f.value) {
      const X = u.value === "bottom" || u.value === "right" ? 1 : -1, ae = (z.value - (_(u.value) ? o.clientY : o.clientX)) * X, le = ae > 0, ye = U.value && !d.value && !le;
      if (ye && ge.value === 0)
        return;
      const ce = Math.abs(ae), Se = (void 0).querySelector("[data-vaul-drawer-wrapper]") || (void 0).querySelector("[vaul-drawer-wrapper]");
      let q = ce / pe.value;
      const De = Le(ce, le);
      if (De !== null && (q = De), ye && q >= 1 || !j.value && !we(o.target, le))
        return;
      if ((R = g == null ? void 0 : g.value) == null || R.$el.classList.add(Oe), j.value = true, C((b = g.value) == null ? void 0 : b.$el, {
        transition: "none"
      }), C((B = P.value) == null ? void 0 : B.$el, {
        transition: "none"
      }), U.value && Ue({ draggedDistance: ae }), le && !U.value) {
        const Y = vt(ae), oe = Math.min(Y * -1, 0) * X;
        C((E = g.value) == null ? void 0 : E.$el, {
          transform: _(u.value) ? `translate3d(0, ${oe}px, 0)` : `translate3d(${oe}px, 0, 0)`
        });
        return;
      }
      const qe = 1 - q;
      if ((me.value || m.value && ge.value === m.value - 1) && (n(q), C(
        (A = P.value) == null ? void 0 : A.$el,
        {
          opacity: `${qe}`,
          transition: "none"
        },
        true
      )), Se && P.value && $.value) {
        const Y = Math.min(ne() + q * (1 - ne()), 1), oe = 8 - q * 8, be = Math.max(0, 14 - q * 14);
        C(
          Se,
          {
            borderRadius: `${oe}px`,
            transform: _(u.value) ? `scale(${Y}) translate3d(0, ${be}px, 0)` : `scale(${Y}) translate3d(${be}px, 0, 0)`,
            transition: "none"
          },
          true
        );
      }
      if (!U.value) {
        const Y = ce * X;
        C((k = g.value) == null ? void 0 : k.$el, {
          transform: _(u.value) ? `translate3d(0, ${Y}px, 0)` : `translate3d(${Y}px, 0, 0)`
        });
      }
    }
  }
  function he() {
    var b;
    if (!g.value)
      return;
    const o = (void 0).querySelector("[data-vaul-drawer-wrapper]") || (void 0).querySelector("[vaul-drawer-wrapper]"), R = ie(g.value.$el, u.value);
    C(g.value.$el, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`
    }), C((b = P.value) == null ? void 0 : b.$el, {
      transition: `opacity ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`,
      opacity: "1"
    }), $.value && R && R > 0 && a.value && C(
      o,
      {
        borderRadius: `${Be}px`,
        overflow: "hidden",
        ..._(u.value) ? {
          transform: `scale(${ne()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${ne()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${O.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${O.EASE.join(",")})`
      },
      true
    );
  }
  function K(o) {
    g.value && (i(), o || (a.value = false), (void 0).setTimeout(() => {
      U.value && (h.value = U.value[0]);
    }, O.DURATION * 1e3));
  }
  vueExports.watchEffect(() => {
    if (!a.value && $.value && rt) ;
  }), vueExports.watch(w, () => {
    a.value = w.value, w.value || K();
  });
  function We(o) {
    if (!f.value || !g.value)
      return;
    g.value.$el.classList.remove(Oe), j.value = false, f.value = false, te.value = /* @__PURE__ */ new Date();
    const R = ie(g.value.$el, u.value);
    if (!we(o.target, false) || !R || Number.isNaN(R) || W.value === null)
      return;
    const b = te.value.getTime() - W.value.getTime(), B = z.value - (_(u.value) ? o.clientY : o.clientX), E = Math.abs(B) / b;
    if (E > 0.05 && (y.value = true, (void 0).setTimeout(() => {
      y.value = false;
    }, 200)), U.value) {
      const k = u.value === "bottom" || u.value === "right" ? 1 : -1;
      xe({
        draggedDistance: B * k,
        closeDrawer: K,
        velocity: E,
        dismissible: d.value
      }), s(true);
      return;
    }
    if (u.value === "bottom" || u.value === "right" ? B > 0 : B < 0) {
      he(), s(true);
      return;
    }
    if (E > _e) {
      K(), s(false);
      return;
    }
    const A = Math.min(
      g.value.$el.getBoundingClientRect().height ?? 0,
      (void 0).innerHeight
    );
    if (R >= A * l.value) {
      K(), s(false);
      return;
    }
    s(true), he();
  }
  vueExports.watch(a, (o) => {
    o && (x.value = /* @__PURE__ */ new Date()), t(o);
  }, { immediate: true });
  function Ve(o) {
    var B, E;
    const R = o ? ((void 0).innerWidth - re) / (void 0).innerWidth : 1, b = o ? -16 : 0;
    G.value && (void 0).clearTimeout(G.value), C((B = g.value) == null ? void 0 : B.$el, {
      transition: `transform ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`,
      transform: `scale(${R}) translate3d(0, ${b}px, 0)`
    }), !o && ((E = g.value) != null && E.$el) && (G.value = (void 0).setTimeout(() => {
      var k, X;
      const A = ie((k = g.value) == null ? void 0 : k.$el, u.value);
      C((X = g.value) == null ? void 0 : X.$el, {
        transition: "none",
        transform: _(u.value) ? `translate3d(0, ${A}px, 0)` : `translate3d(${A}px, 0, 0)`
      });
    }, 500));
  }
  function je(o) {
    var A;
    if (o < 0)
      return;
    const R = _(u.value) ? (void 0).innerHeight : (void 0).innerWidth, b = (R - re) / R, B = b + o * (1 - b), E = -16 + o * re;
    C((A = g.value) == null ? void 0 : A.$el, {
      transform: _(u.value) ? `scale(${B}) translate3d(0, ${E}px, 0)` : `scale(${B}) translate3d(${E}px, 0, 0)`,
      transition: "none"
    });
  }
  function ze(o) {
    var E;
    const R = _(u.value) ? (void 0).innerHeight : (void 0).innerWidth, b = o ? (R - re) / R : 1, B = o ? -16 : 0;
    o && C((E = g.value) == null ? void 0 : E.$el, {
      transition: `transform ${O.DURATION}s cubic-bezier(${O.EASE.join(",")})`,
      transform: _(u.value) ? `scale(${b}) translate3d(0, ${B}px, 0)` : `scale(${b}) translate3d(${B}px, 0, 0)`
    });
  }
  return {
    open: w,
    isOpen: a,
    modal: D,
    keyboardIsOpen: M,
    hasBeenOpened: c,
    drawerRef: g,
    drawerHeightRef: pe,
    overlayRef: P,
    handleRef: Ae,
    isDragging: f,
    dragStartTime: W,
    isAllowedToDrag: j,
    snapPoints: U,
    activeSnapPoint: h,
    hasSnapPoints: Ne,
    pointerStart: z,
    dismissible: d,
    snapPointsOffset: He,
    direction: u,
    shouldFade: me,
    fadeFromIndex: m,
    shouldScaleBackground: $,
    setBackgroundColorOnScale: T,
    onPress: ke,
    onDrag: Ie,
    onRelease: We,
    closeDrawer: K,
    onNestedDrag: je,
    onNestedRelease: ze,
    onNestedOpenChange: Ve,
    emitClose: i,
    emitDrag: n,
    emitRelease: s,
    emitOpenChange: t,
    nested: v,
    handleOnly: H,
    noBodyStyles: L
  };
}
const St = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DrawerRoot",
  props: {
    activeSnapPoint: { default: void 0 },
    closeThreshold: { default: pt },
    shouldScaleBackground: { type: Boolean, default: void 0 },
    setBackgroundColorOnScale: { type: Boolean, default: true },
    scrollLockTimeout: { default: gt },
    fixed: { type: Boolean, default: void 0 },
    dismissible: { type: Boolean, default: true },
    modal: { type: Boolean, default: true },
    open: { type: Boolean, default: void 0 },
    defaultOpen: { type: Boolean, default: void 0 },
    nested: { type: Boolean, default: false },
    direction: { default: "bottom" },
    noBodyStyles: { type: Boolean },
    handleOnly: { type: Boolean, default: false },
    preventScrollRestoration: { type: Boolean },
    snapPoints: { default: void 0 },
    fadeFromIndex: { default: void 0 }
  },
  emits: ["drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"],
  setup(e, { expose: n, emit: s }) {
    const i = e, t = s;
    vueExports.useSlots();
    const w = vueExports.computed(() => i.fadeFromIndex ?? (i.snapPoints && i.snapPoints.length - 1)), d = $e(i, "open", t, {
      defaultValue: i.defaultOpen,
      passive: i.open === void 0
    }), v = $e(i, "activeSnapPoint", t, {
      passive: i.activeSnapPoint === void 0
    }), D = {
      emitDrag: (m) => t("drag", m),
      emitRelease: (m) => t("release", m),
      emitClose: () => t("close"),
      emitOpenChange: (m) => {
        t("update:open", m), setTimeout(() => {
          t("animationEnd", m);
        }, O.DURATION * 1e3);
      }
    }, { closeDrawer: $, hasBeenOpened: T, modal: r, isOpen: l } = ct(
      yt({
        ...D,
        ...vueExports.toRefs(i),
        activeSnapPoint: v,
        fadeFromIndex: w,
        open: d
      })
    );
    function h(m) {
      if (d.value !== void 0) {
        D.emitOpenChange(m);
        return;
      }
      l.value = m, m ? T.value = true : $();
    }
    return n({
      open: l
    }), (m, u) => (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogRoot_default), {
      open: vueExports.unref(l),
      modal: vueExports.unref(r),
      "onUpdate:open": h
    }, {
      default: vueExports.withCtx(() => [
        vueExports.renderSlot(m.$slots, "default", { open: vueExports.unref(l) })
      ]),
      _: 3
    }, 8, ["open", "modal"]));
  }
}), _t = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DrawerRootNested",
  props: {
    activeSnapPoint: {},
    closeThreshold: {},
    shouldScaleBackground: { type: Boolean },
    setBackgroundColorOnScale: { type: Boolean },
    scrollLockTimeout: {},
    fixed: { type: Boolean },
    dismissible: { type: Boolean },
    modal: { type: Boolean },
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    nested: { type: Boolean },
    direction: {},
    noBodyStyles: { type: Boolean },
    handleOnly: { type: Boolean },
    preventScrollRestoration: { type: Boolean },
    snapPoints: {},
    fadeFromIndex: {}
  },
  emits: ["drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"],
  setup(e, { emit: n }) {
    const s = e, i = n, { onNestedDrag: t, onNestedOpenChange: w, onNestedRelease: d } = ee();
    function v() {
      w(false);
    }
    function D(r) {
      t(r);
    }
    function $(r) {
      r && w(r), i("update:open", r);
    }
    const T = useForwardPropsEmits(s, i);
    return (r, l) => (vueExports.openBlock(), vueExports.createBlock(St, vueExports.mergeProps(vueExports.unref(T), {
      nested: "",
      onClose: v,
      onDrag: D,
      onRelease: vueExports.unref(d),
      "onUpdate:open": $
    }), {
      default: vueExports.withCtx(() => [
        vueExports.renderSlot(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["onRelease"]));
  }
}), Bt = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DrawerOverlay",
  setup(e) {
    const { overlayRef: n, hasSnapPoints: s, isOpen: i, shouldFade: t } = ee();
    return (w, d) => (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogOverlay_default), {
      ref_key: "overlayRef",
      ref: n,
      "data-vaul-overlay": "",
      "data-vaul-snap-points": vueExports.unref(i) && vueExports.unref(s) ? "true" : "false",
      "data-vaul-snap-points-overlay": vueExports.unref(i) && vueExports.unref(t) ? "true" : "false"
    }, null, 8, ["data-vaul-snap-points", "data-vaul-snap-points-overlay"]));
  }
}), Dt = () => () => {
};
function bt() {
  const { direction: e, isOpen: n, shouldScaleBackground: s, setBackgroundColorOnScale: i, noBodyStyles: t } = ee(), w = vueExports.ref(null), d = vueExports.ref((void 0).body.style.backgroundColor);
  function v() {
    return ((void 0).innerWidth - Ce) / (void 0).innerWidth;
  }
  vueExports.watchEffect((D) => {
    if (n.value && s.value) {
      w.value && clearTimeout(w.value);
      const $ = (void 0).querySelector("[data-vaul-drawer-wrapper]") || (void 0).querySelector("[vaul-drawer-wrapper]");
      if (!$)
        return;
      ft(
        i.value && !t.value ? de((void 0).body, { background: "black" }) : Dt,
        de($, {
          transformOrigin: _(e.value) ? "top" : "left",
          transitionProperty: "transform, border-radius",
          transitionDuration: `${O.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${O.EASE.join(",")})`
        })
      );
      const T = de($, {
        borderRadius: `${Be}px`,
        overflow: "hidden",
        ..._(e.value) ? {
          transform: `scale(${v()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`
        } : {
          transform: `scale(${v()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`
        }
      });
      D(() => {
        T(), w.value = (void 0).setTimeout(() => {
          d.value ? (void 0).body.style.background = d.value : (void 0).body.style.removeProperty("background");
        }, O.DURATION * 1e3);
      });
    }
  }, { flush: "pre" });
}
const Ct = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DrawerContent",
  setup(e) {
    const {
      open: n,
      isOpen: s,
      snapPointsOffset: i,
      hasSnapPoints: t,
      drawerRef: w,
      onPress: d,
      onDrag: v,
      onRelease: D,
      modal: $,
      emitOpenChange: T,
      dismissible: r,
      keyboardIsOpen: l,
      closeDrawer: h,
      direction: m,
      handleOnly: u
    } = ee();
    bt();
    const L = vueExports.ref(false), H = vueExports.computed(() => i.value && i.value.length > 0 ? `${i.value[0]}px` : "0");
    function p(f) {
      if (!$.value || f.defaultPrevented) {
        f.preventDefault();
        return;
      }
      l.value && (l.value = false), r.value ? T(false) : f.preventDefault();
    }
    function a(f) {
      u.value || d(f);
    }
    function c(f) {
      u.value || v(f);
    }
    return vueExports.watchEffect(() => {
      t.value && (void 0).requestAnimationFrame(() => {
        L.value = true;
      });
    }), (f, y) => (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogContent_default), {
      ref_key: "drawerRef",
      ref: w,
      "data-vaul-drawer": "",
      "data-vaul-drawer-direction": vueExports.unref(m),
      "data-vaul-delayed-snap-points": L.value ? "true" : "false",
      "data-vaul-snap-points": vueExports.unref(s) && vueExports.unref(t) ? "true" : "false",
      style: vueExports.normalizeStyle({ "--snap-point-height": H.value }),
      onPointerdown: a,
      onPointermove: c,
      onPointerup: vueExports.unref(D),
      onPointerDownOutside: p,
      onOpenAutoFocus: y[0] || (y[0] = vueExports.withModifiers(() => {
      }, ["prevent"])),
      onEscapeKeyDown: y[1] || (y[1] = (P) => {
        vueExports.unref(r) || P.preventDefault();
      })
    }, {
      default: vueExports.withCtx(() => [
        vueExports.renderSlot(f.$slots, "default")
      ]),
      _: 3
    }, 8, ["data-vaul-drawer-direction", "data-vaul-delayed-snap-points", "data-vaul-snap-points", "style", "onPointerup"]));
  }
}), $t = ["data-vaul-drawer-visible"], Ot = {
  "data-vaul-handle-hitarea": "",
  "aria-hidden": "true"
}, Tt = 250, Pt = 120, Nt = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DrawerHandle",
  props: {
    preventCycle: { type: Boolean, default: false }
  },
  setup(e) {
    const n = e, { onPress: s, onDrag: i, handleRef: t, handleOnly: w, isOpen: d, snapPoints: v, activeSnapPoint: D, isDragging: $, dismissible: T, closeDrawer: r } = ee(), l = vueExports.ref(null), h = vueExports.ref(false);
    function m() {
      if (h.value) {
        H();
        return;
      }
      (void 0).setTimeout(() => {
        u();
      }, Pt);
    }
    function u() {
      if ($.value || n.preventCycle || h.value) {
        H();
        return;
      }
      if (H(), !v.value || v.value.length === 0) {
        T.value || r();
        return;
      }
      const c = D.value === v.value[v.value.length - 1];
      if (c && T.value) {
        r();
        return;
      }
      const f = v.value.findIndex((P) => P === D.value);
      if (f === -1)
        return;
      const y = c ? 0 : f + 1;
      D.value = v.value[y];
    }
    function L() {
      l.value = (void 0).setTimeout(() => {
        h.value = true;
      }, Tt);
    }
    function H() {
      l.value && (void 0).clearTimeout(l.value), h.value = false;
    }
    function p(c) {
      w.value && s(c), L();
    }
    function a(c) {
      w.value && i(c);
    }
    return (c, f) => (vueExports.openBlock(), vueExports.createElementBlock("div", {
      ref_key: "handleRef",
      ref: t,
      "data-vaul-drawer-visible": vueExports.unref(d) ? "true" : "false",
      "data-vaul-handle": "",
      "aria-hidden": "true",
      onClick: m,
      onPointercancel: H,
      onPointerdown: p,
      onPointermove: a
    }, [
      vueExports.createElementVNode("span", Ot, [
        vueExports.renderSlot(c.$slots, "default")
      ])
    ], 40, $t));
  }
});
const theme$3 = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default ring ring-default flex focus:outline-none",
    "handle": [
      "shrink-0 !bg-accented",
      "transition-opacity"
    ],
    "container": "w-full flex flex-col gap-4 p-4 overflow-y-auto",
    "header": "",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "body": "flex-1",
    "footer": "flex flex-col gap-1.5"
  },
  "variants": {
    "direction": {
      "top": {
        "content": "mb-24 flex-col-reverse",
        "handle": "mb-4"
      },
      "right": {
        "content": "flex-row",
        "handle": "!ml-4"
      },
      "bottom": {
        "content": "mt-24 flex-col",
        "handle": "mt-4"
      },
      "left": {
        "content": "flex-row-reverse",
        "handle": "!mr-4"
      }
    },
    "inset": {
      "true": {
        "content": "rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]"
      }
    },
    "snapPoints": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "direction": [
        "top",
        "bottom"
      ],
      "class": {
        "content": "h-auto max-h-[96%]",
        "handle": "!w-12 !h-1.5 mx-auto"
      }
    },
    {
      "direction": [
        "top",
        "bottom"
      ],
      "snapPoints": true,
      "class": {
        "content": "h-full"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "class": {
        "content": "w-auto max-w-[calc(100%-2rem)]",
        "handle": "!h-12 !w-1.5 mt-auto mb-auto"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "snapPoints": true,
      "class": {
        "content": "w-full"
      }
    },
    {
      "direction": "top",
      "inset": true,
      "class": {
        "content": "inset-x-4 top-4"
      }
    },
    {
      "direction": "top",
      "inset": false,
      "class": {
        "content": "inset-x-0 top-0 rounded-b-lg"
      }
    },
    {
      "direction": "bottom",
      "inset": true,
      "class": {
        "content": "inset-x-4 bottom-4"
      }
    },
    {
      "direction": "bottom",
      "inset": false,
      "class": {
        "content": "inset-x-0 bottom-0 rounded-t-lg"
      }
    },
    {
      "direction": "left",
      "inset": true,
      "class": {
        "content": "inset-y-4 left-4"
      }
    },
    {
      "direction": "left",
      "inset": false,
      "class": {
        "content": "inset-y-0 left-0 rounded-r-lg"
      }
    },
    {
      "direction": "right",
      "inset": true,
      "class": {
        "content": "inset-y-4 right-4"
      }
    },
    {
      "direction": "right",
      "inset": false,
      "class": {
        "content": "inset-y-0 right-0 rounded-l-lg"
      }
    }
  ]
};
const _sfc_main$3 = {
  __name: "UDrawer",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    inset: { type: Boolean, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    handle: { type: Boolean, required: false, default: true },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    nested: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    activeSnapPoint: { type: [Number, String, null], required: false },
    closeThreshold: { type: Number, required: false },
    shouldScaleBackground: { type: Boolean, required: false },
    setBackgroundColorOnScale: { type: Boolean, required: false },
    scrollLockTimeout: { type: Number, required: false },
    fixed: { type: Boolean, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    modal: { type: Boolean, required: false, default: true },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    direction: { type: String, required: false, default: "bottom" },
    noBodyStyles: { type: Boolean, required: false },
    handleOnly: { type: Boolean, required: false },
    preventScrollRestoration: { type: Boolean, required: false },
    snapPoints: { type: Array, required: false }
  },
  emits: ["close:prevent", "drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
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
      return {};
    });
    const ui = vueExports.computed(() => tv({ extend: tv(theme$3), ...appConfig.ui?.drawer || {} })({
      direction: props.direction,
      inset: props.inset,
      snapPoints: props.snapPoints && props.snapPoints.length > 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      serverRenderer_cjs_prodExports.ssrRenderVNode(_push, vueExports.createVNode(vueExports.resolveDynamicComponent(__props.nested ? vueExports.unref(_t) : vueExports.unref(St)), vueExports.mergeProps(vueExports.unref(rootProps), _attrs), {
        default: vueExports.withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogTrigger_default), {
                "as-child": "",
                class: props.class
              }, {
                default: vueExports.withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "default")
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogPortal_default), vueExports.unref(portalProps), {
              default: vueExports.withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.overlay) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Bt), {
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Ct), vueExports.mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, vueExports.toHandlers(contentEvents.value)), {
                    default: vueExports.withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.handle) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Nt), {
                            "data-slot": "handle",
                            class: ui.value.handle({ class: props.ui?.handle })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (!!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description))) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(VisuallyHidden_default), null, {
                            default: vueExports.withCtx((_5, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.title || !!slots.title) {
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogTitle_default), null, {
                                    default: vueExports.withCtx((_6, _push6, _parent6, _scopeId5) => {
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
                                    _: 3
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.description || !!slots.description) {
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogDescription_default), null, {
                                    default: vueExports.withCtx((_6, _push6, _parent6, _scopeId5) => {
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
                                    _: 3
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
                            _: 3
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                          _push4(`<div data-slot="container" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.container({ class: props.ui?.container }))}"${_scopeId3}>`);
                          if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description)) {
                            _push4(`<div data-slot="header" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId3}>`);
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "header", {}, () => {
                              if (__props.title || !!slots.title) {
                                _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogTitle_default), {
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: vueExports.withCtx((_5, _push5, _parent5, _scopeId4) => {
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
                                  _: 3
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              if (__props.description || !!slots.description) {
                                _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(DialogDescription_default), {
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: vueExports.withCtx((_5, _push5, _parent5, _scopeId4) => {
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
                                  _: 3
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
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "body", {}, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.footer) {
                            _push4(`<div data-slot="footer" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.footer({ class: props.ui?.footer }))}"${_scopeId3}>`);
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          __props.handle ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Nt), {
                            key: 0,
                            "data-slot": "handle",
                            class: ui.value.handle({ class: props.ui?.handle })
                          }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                          !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { key: 1 }, {
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
                          vueExports.renderSlot(_ctx.$slots, "content", {}, () => [
                            vueExports.createVNode("div", {
                              "data-slot": "container",
                              class: ui.value.container({ class: props.ui?.container })
                            }, [
                              !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                key: 0,
                                "data-slot": "header",
                                class: ui.value.header({ class: props.ui?.header })
                              }, [
                                vueExports.renderSlot(_ctx.$slots, "header", {}, () => [
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
                                ])
                              ], 2)) : vueExports.createCommentVNode("", true),
                              !!slots.body ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                key: 1,
                                "data-slot": "body",
                                class: ui.value.body({ class: props.ui?.body })
                              }, [
                                vueExports.renderSlot(_ctx.$slots, "body")
                              ], 2)) : vueExports.createCommentVNode("", true),
                              !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                key: 2,
                                "data-slot": "footer",
                                class: ui.value.footer({ class: props.ui?.footer })
                              }, [
                                vueExports.renderSlot(_ctx.$slots, "footer")
                              ], 2)) : vueExports.createCommentVNode("", true)
                            ], 2)
                          ])
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    __props.overlay ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Bt), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(vueExports.unref(Ct), vueExports.mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, contentProps.value, vueExports.toHandlers(contentEvents.value)), {
                      default: vueExports.withCtx(() => [
                        __props.handle ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Nt), {
                          key: 0,
                          "data-slot": "handle",
                          class: ui.value.handle({ class: props.ui?.handle })
                        }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { key: 1 }, {
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
                        vueExports.renderSlot(_ctx.$slots, "content", {}, () => [
                          vueExports.createVNode("div", {
                            "data-slot": "container",
                            class: ui.value.container({ class: props.ui?.container })
                          }, [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 0,
                              "data-slot": "header",
                              class: ui.value.header({ class: props.ui?.header })
                            }, [
                              vueExports.renderSlot(_ctx.$slots, "header", {}, () => [
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
                              ])
                            ], 2)) : vueExports.createCommentVNode("", true),
                            !!slots.body ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 1,
                              "data-slot": "body",
                              class: ui.value.body({ class: props.ui?.body })
                            }, [
                              vueExports.renderSlot(_ctx.$slots, "body")
                            ], 2)) : vueExports.createCommentVNode("", true),
                            !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 2,
                              "data-slot": "footer",
                              class: ui.value.footer({ class: props.ui?.footer })
                            }, [
                              vueExports.renderSlot(_ctx.$slots, "footer")
                            ], 2)) : vueExports.createCommentVNode("", true)
                          ], 2)
                        ])
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DialogTrigger_default), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 8, ["class"])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(vueExports.unref(DialogPortal_default), vueExports.unref(portalProps), {
                default: vueExports.withCtx(() => [
                  __props.overlay ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Bt), {
                    key: 0,
                    "data-slot": "overlay",
                    class: ui.value.overlay({ class: props.ui?.overlay })
                  }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(vueExports.unref(Ct), vueExports.mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, vueExports.toHandlers(contentEvents.value)), {
                    default: vueExports.withCtx(() => [
                      __props.handle ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Nt), {
                        key: 0,
                        "data-slot": "handle",
                        class: ui.value.handle({ class: props.ui?.handle })
                      }, null, 8, ["class"])) : vueExports.createCommentVNode("", true),
                      !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { key: 1 }, {
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
                      vueExports.renderSlot(_ctx.$slots, "content", {}, () => [
                        vueExports.createVNode("div", {
                          "data-slot": "container",
                          class: ui.value.container({ class: props.ui?.container })
                        }, [
                          !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            "data-slot": "header",
                            class: ui.value.header({ class: props.ui?.header })
                          }, [
                            vueExports.renderSlot(_ctx.$slots, "header", {}, () => [
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
                            ])
                          ], 2)) : vueExports.createCommentVNode("", true),
                          !!slots.body ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 1,
                            "data-slot": "body",
                            class: ui.value.body({ class: props.ui?.body })
                          }, [
                            vueExports.renderSlot(_ctx.$slots, "body")
                          ], 2)) : vueExports.createCommentVNode("", true),
                          !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 2,
                            "data-slot": "footer",
                            class: ui.value.footer({ class: props.ui?.footer })
                          }, [
                            vueExports.renderSlot(_ctx.$slots, "footer")
                          ], 2)) : vueExports.createCommentVNode("", true)
                        ], 2)
                      ])
                    ]),
                    _: 3
                  }, 16, ["class"])
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const theme$2 = {
  "slots": {
    "root": "relative inline-flex items-center",
    "base": [
      "w-full rounded-md border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "leading": "absolute start-0 flex items-start",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute end-0 flex items-start",
    "trailingIcon": "shrink-0 text-dimmed"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
      },
      "vertical": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
      }
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2 inset-y-1",
        "trailing": "pe-2 inset-y-1",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5 inset-y-1.5",
        "trailing": "pe-2.5 inset-y-1.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5 inset-y-1.5",
        "trailing": "pe-2.5 inset-y-1.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3 inset-y-2",
        "trailing": "pe-3 inset-y-2",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3 inset-y-2",
        "trailing": "pe-3 inset-y-2",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
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
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    },
    "autoresize": {
      "true": {
        "base": "resize-none"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$2 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UTextarea",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    placeholder: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    autoresize: { type: Boolean, required: false },
    autoresizeDelay: { type: Number, required: false, default: 0 },
    disabled: { type: Boolean, required: false },
    rows: { type: Number, required: false, default: 3 },
    maxrows: { type: Number, required: false, default: 0 },
    highlight: { type: Boolean, required: false },
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelModifiers: { type: Object, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  },
  emits: ["update:modelValue", "blur", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
    const appConfig = useAppConfig();
    const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props, { deferInputValidation: true });
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const ui = vueExports.computed(() => tv({ extend: tv(theme$2), ...appConfig.ui?.textarea || {} })({
      color: color.value,
      variant: props.variant,
      size: size?.value,
      loading: props.loading,
      highlight: highlight.value,
      autoresize: props.autoresize,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing
    }));
    const textareaRef = vueExports.useTemplateRef("textareaRef");
    function updateInput(value) {
      if (props.modelModifiers?.trim) {
        value = value?.trim() ?? null;
      }
      if (props.modelModifiers?.number) {
        value = looseToNumber(value);
      }
      if (props.modelModifiers?.nullable) {
        value ||= null;
      }
      if (props.modelModifiers?.optional) {
        value ||= void 0;
      }
      modelValue.value = value;
      emitFormInput();
    }
    function onInput(event) {
      autoResize();
      if (!props.modelModifiers?.lazy) {
        updateInput(event.target.value);
      }
    }
    function onChange(event) {
      const value = event.target.value;
      if (props.modelModifiers?.lazy) {
        updateInput(value);
      }
      if (props.modelModifiers?.trim) {
        event.target.value = value.trim();
      }
      emitFormChange();
      emits("change", event);
    }
    function onBlur(event) {
      emitFormBlur();
      emits("blur", event);
    }
    function autoResize() {
      if (props.autoresize && textareaRef.value) {
        textareaRef.value.rows = props.rows;
        const overflow = textareaRef.value.style.overflow;
        textareaRef.value.style.overflow = "hidden";
        const styles = (void 0).getComputedStyle(textareaRef.value);
        const paddingTop = Number.parseInt(styles.paddingTop);
        const paddingBottom = Number.parseInt(styles.paddingBottom);
        const padding = paddingTop + paddingBottom;
        const lineHeight = Number.parseInt(styles.lineHeight);
        const { scrollHeight } = textareaRef.value;
        const newRows = (scrollHeight - padding) / lineHeight;
        if (newRows > props.rows) {
          textareaRef.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
        }
        textareaRef.value.style.overflow = overflow;
      }
    }
    vueExports.watch(modelValue, () => {
      vueExports.nextTick(autoResize);
    });
    __expose({
      textareaRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        as: __props.as,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<textarea${serverRenderer_cjs_prodExports.ssrRenderAttrs(_temp0 = vueExports.mergeProps({
              id: vueExports.unref(id),
              ref_key: "textareaRef",
              ref: textareaRef,
              value: vueExports.unref(modelValue),
              name: vueExports.unref(name),
              rows: __props.rows,
              placeholder: __props.placeholder,
              "data-slot": "base",
              class: ui.value.base({ class: props.ui?.base }),
              disabled: vueExports.unref(disabled),
              required: __props.required
            }, { ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }), "textarea")}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, null, _push2, _parent2, _scopeId);
            if (vueExports.unref(isLeading) || !!__props.avatar || !!slots.leading) {
              _push2(`<span data-slot="leading" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.leading({ class: props.ui?.leading }))}"${_scopeId}>`);
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
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(isTrailing) || !!slots.trailing) {
              _push2(`<span data-slot="trailing" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.trailing({ class: props.ui?.trailing }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
                if (vueExports.unref(trailingIconName)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                    name: vueExports.unref(trailingIconName),
                    "data-slot": "trailingIcon",
                    class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode("textarea", vueExports.mergeProps({
                id: vueExports.unref(id),
                ref_key: "textareaRef",
                ref: textareaRef,
                value: vueExports.unref(modelValue),
                name: vueExports.unref(name),
                rows: __props.rows,
                placeholder: __props.placeholder,
                "data-slot": "base",
                class: ui.value.base({ class: props.ui?.base }),
                disabled: vueExports.unref(disabled),
                required: __props.required
              }, { ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
                onInput,
                onBlur,
                onChange,
                onFocus: vueExports.unref(emitFormFocus)
              }), null, 16, ["id", "value", "name", "rows", "placeholder", "disabled", "required", "onFocus"]),
              vueExports.renderSlot(_ctx.$slots, "default", { ui: ui.value }),
              vueExports.unref(isLeading) || !!__props.avatar || !!slots.leading ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 0,
                "data-slot": "leading",
                class: ui.value.leading({ class: props.ui?.leading })
              }, [
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
                ])
              ], 2)) : vueExports.createCommentVNode("", true),
              vueExports.unref(isTrailing) || !!slots.trailing ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                "data-slot": "trailing",
                class: ui.value.trailing({ class: props.ui?.trailing })
              }, [
                vueExports.renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [
                  vueExports.unref(trailingIconName) ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                    key: 0,
                    name: vueExports.unref(trailingIconName),
                    "data-slot": "trailingIcon",
                    class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                  }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
                ])
              ], 2)) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const theme$1 = {
  "slots": {
    "root": "relative inline-flex items-center",
    "base": [
      "w-full rounded-md border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "increment": "absolute flex items-center",
    "decrement": "absolute flex items-center"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
      },
      "vertical": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
      }
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
    "size": {
      "xs": "px-2 py-1 text-xs gap-1",
      "sm": "px-2.5 py-1.5 text-xs gap-1.5",
      "md": "px-2.5 py-1.5 text-sm gap-1.5",
      "lg": "px-3 py-2 text-sm gap-2",
      "xl": "px-3 py-2 text-base gap-2"
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "disabled": {
      "true": {
        "increment": "opacity-75 cursor-not-allowed",
        "decrement": "opacity-75 cursor-not-allowed"
      }
    },
    "orientation": {
      "horizontal": {
        "base": "text-center",
        "increment": "inset-y-0 end-0 pe-1",
        "decrement": "inset-y-0 start-0 ps-1"
      },
      "vertical": {
        "increment": "top-0 end-0 pe-1 [&>button]:py-0 scale-80",
        "decrement": "bottom-0 end-0 pe-1 [&>button]:py-0 scale-80"
      }
    },
    "highlight": {
      "true": ""
    },
    "increment": {
      "false": ""
    },
    "decrement": {
      "false": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "orientation": "horizontal",
      "decrement": false,
      "class": "text-start"
    },
    {
      "decrement": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "decrement": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "decrement": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "decrement": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "decrement": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "increment": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "increment": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "increment": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "increment": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "increment": true,
      "size": "xl",
      "class": "pe-11"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UInputNumber",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    placeholder: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    highlight: { type: Boolean, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    increment: { type: [Boolean, Object], required: false, default: true },
    incrementIcon: { type: null, required: false },
    incrementDisabled: { type: Boolean, required: false },
    decrement: { type: [Boolean, Object], required: false, default: true },
    decrementIcon: { type: null, required: false },
    decrementDisabled: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false },
    modelModifiers: { type: Object, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    modelValue: { type: [Number, null], required: false },
    defaultValue: { type: Number, required: false },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    stepSnapping: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    required: { type: Boolean, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    formatOptions: { type: null, required: false },
    disableWheelChange: { type: Boolean, required: false },
    invertWheelChange: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false }
  },
  emits: ["update:modelValue", "blur", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
    const { t } = useLocale$1();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultValue", "min", "max", "step", "stepSnapping", "formatOptions", "disableWheelChange", "invertWheelChange", "readonly"), emits);
    const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const inputSize = vueExports.computed(() => fieldGroupSize.value || formGroupSize.value);
    const ui = vueExports.computed(() => tv({ extend: tv(theme$1), ...appConfig.ui?.inputNumber || {} })({
      color: color.value,
      variant: props.variant,
      size: inputSize.value,
      highlight: highlight.value,
      orientation: props.orientation,
      fieldGroup: orientation.value,
      increment: props.orientation === "vertical" ? !!props.increment || !!props.decrement : !!props.increment,
      decrement: props.orientation === "vertical" ? false : !!props.decrement
    }));
    const incrementIcon = vueExports.computed(() => props.incrementIcon || (props.orientation === "horizontal" ? appConfig.ui.icons.plus : appConfig.ui.icons.chevronUp));
    const decrementIcon = vueExports.computed(() => props.decrementIcon || (props.orientation === "horizontal" ? appConfig.ui.icons.minus : appConfig.ui.icons.chevronDown));
    const inputRef = vueExports.useTemplateRef("inputRef");
    function onUpdate(value) {
      if (props.modelModifiers?.optional) {
        value = value ?? void 0;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    function onBlur(event) {
      emitFormBlur();
      emits("blur", event);
    }
    __expose({
      inputRef: vueExports.toRef(() => inputRef.value?.$el)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(NumberFieldRoot_default), vueExports.mergeProps(vueExports.unref(rootProps), {
        id: vueExports.unref(id),
        "model-value": vueExports.unref(modelValue),
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        name: vueExports.unref(name),
        disabled: vueExports.unref(disabled),
        "onUpdate:modelValue": onUpdate
      }, _attrs), {
        default: vueExports.withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(NumberFieldInput_default), vueExports.mergeProps({ ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
              ref_key: "inputRef",
              ref: inputRef,
              placeholder: __props.placeholder,
              required: __props.required,
              "data-slot": "base",
              class: ui.value.base({ class: props.ui?.base }),
              onBlur,
              onFocus: vueExports.unref(emitFormFocus)
            }), null, _parent2, _scopeId));
            if (!!__props.increment) {
              _push2(`<div data-slot="increment" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.increment({ class: props.ui?.increment }))}"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(NumberFieldIncrement_default), {
                "as-child": "",
                disabled: vueExports.unref(disabled) || __props.incrementDisabled
              }, {
                default: vueExports.withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "increment", {}, () => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$9, vueExports.mergeProps({
                        icon: incrementIcon.value,
                        color: vueExports.unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": vueExports.unref(t)("inputNumber.increment")
                      }, typeof __props.increment === "object" ? __props.increment : void 0), null, _parent3, _scopeId2));
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "increment", {}, () => [
                        vueExports.createVNode(_sfc_main$9, vueExports.mergeProps({
                          icon: incrementIcon.value,
                          color: vueExports.unref(color),
                          size: __props.size,
                          variant: "link",
                          "aria-label": vueExports.unref(t)("inputNumber.increment")
                        }, typeof __props.increment === "object" ? __props.increment : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!!__props.decrement) {
              _push2(`<div data-slot="decrement" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.decrement({ class: props.ui?.decrement }))}"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(NumberFieldDecrement_default), {
                "as-child": "",
                disabled: vueExports.unref(disabled) || __props.decrementDisabled
              }, {
                default: vueExports.withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "decrement", {}, () => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$9, vueExports.mergeProps({
                        icon: decrementIcon.value,
                        color: vueExports.unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": vueExports.unref(t)("inputNumber.decrement")
                      }, typeof __props.decrement === "object" ? __props.decrement : void 0), null, _parent3, _scopeId2));
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "decrement", {}, () => [
                        vueExports.createVNode(_sfc_main$9, vueExports.mergeProps({
                          icon: decrementIcon.value,
                          color: vueExports.unref(color),
                          size: __props.size,
                          variant: "link",
                          "aria-label": vueExports.unref(t)("inputNumber.decrement")
                        }, typeof __props.decrement === "object" ? __props.decrement : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode(vueExports.unref(NumberFieldInput_default), vueExports.mergeProps({ ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
                ref_key: "inputRef",
                ref: inputRef,
                placeholder: __props.placeholder,
                required: __props.required,
                "data-slot": "base",
                class: ui.value.base({ class: props.ui?.base }),
                onBlur,
                onFocus: vueExports.unref(emitFormFocus)
              }), null, 16, ["placeholder", "required", "class", "onFocus"]),
              !!__props.increment ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                "data-slot": "increment",
                class: ui.value.increment({ class: props.ui?.increment })
              }, [
                vueExports.createVNode(vueExports.unref(NumberFieldIncrement_default), {
                  "as-child": "",
                  disabled: vueExports.unref(disabled) || __props.incrementDisabled
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.renderSlot(_ctx.$slots, "increment", {}, () => [
                      vueExports.createVNode(_sfc_main$9, vueExports.mergeProps({
                        icon: incrementIcon.value,
                        color: vueExports.unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": vueExports.unref(t)("inputNumber.increment")
                      }, typeof __props.increment === "object" ? __props.increment : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                    ])
                  ]),
                  _: 3
                }, 8, ["disabled"])
              ], 2)) : vueExports.createCommentVNode("", true),
              !!__props.decrement ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                "data-slot": "decrement",
                class: ui.value.decrement({ class: props.ui?.decrement })
              }, [
                vueExports.createVNode(vueExports.unref(NumberFieldDecrement_default), {
                  "as-child": "",
                  disabled: vueExports.unref(disabled) || __props.decrementDisabled
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.renderSlot(_ctx.$slots, "decrement", {}, () => [
                      vueExports.createVNode(_sfc_main$9, vueExports.mergeProps({
                        icon: decrementIcon.value,
                        color: vueExports.unref(color),
                        size: __props.size,
                        variant: "link",
                        "aria-label": vueExports.unref(t)("inputNumber.decrement")
                      }, typeof __props.decrement === "object" ? __props.decrement : void 0), null, 16, ["icon", "color", "size", "aria-label"])
                    ])
                  ]),
                  _: 3
                }, 8, ["disabled"])
              ], 2)) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/InputNumber.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "root": [
      "relative inline-flex items-center",
      "flex-wrap"
    ],
    "base": [
      "rounded-md",
      "transition-colors"
    ],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed",
    "item": 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-accented bg-elevated text-default data-disabled:cursor-not-allowed data-disabled:opacity-75 wrap-anywhere data-[state="active"]:bg-accented',
    "itemText": "",
    "itemDelete": [
      "inline-flex items-center rounded-xs text-dimmed hover:text-default hover:bg-accented/75 disabled:pointer-events-none",
      "transition-colors"
    ],
    "itemDeleteIcon": "shrink-0",
    "input": "flex-1 border-0 bg-transparent placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
      },
      "vertical": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
      }
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "item": "text-[10px]/3",
        "itemDeleteIcon": "size-3"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "item": "text-[10px]/3",
        "itemDeleteIcon": "size-3"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "item": "text-xs",
        "itemDeleteIcon": "size-3.5"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "item": "text-xs",
        "itemDeleteIcon": "size-3.5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6",
        "item": "text-sm",
        "itemDeleteIcon": "size-4"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated has-focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated has-focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
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
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UInputTags",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    placeholder: { type: String, required: false },
    maxLength: { type: Number, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    deleteIcon: { type: null, required: false },
    highlight: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    modelValue: { type: [Array, null], required: false },
    defaultValue: { type: Array, required: false },
    addOnPaste: { type: Boolean, required: false },
    addOnTab: { type: Boolean, required: false },
    addOnBlur: { type: Boolean, required: false },
    duplicate: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    delimiter: { type: null, required: false },
    max: { type: Number, required: false },
    id: { type: String, required: false },
    convertValue: { type: Function, required: false },
    displayValue: { type: Function, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  },
  emits: ["change", "blur", "focus", "update:modelValue", "invalid", "addTag", "removeTag"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "addOnPaste", "addOnTab", "addOnBlur", "duplicate", "delimiter", "max", "convertValue", "displayValue", "required"), emits);
    const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const inputSize = vueExports.computed(() => fieldGroupSize.value || formGroupSize.value);
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputTags || {} })({
      color: color.value,
      variant: props.variant,
      size: inputSize?.value,
      loading: props.loading,
      highlight: highlight.value,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing,
      fieldGroup: orientation.value
    }));
    const inputRef = vueExports.useTemplateRef("inputRef");
    function onUpdate(value) {
      if (vueExports.toRaw(props.modelValue) === value) {
        return;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    function onBlur(event) {
      emits("blur", event);
      emitFormBlur();
    }
    function onFocus(event) {
      emits("focus", event);
      emitFormFocus();
    }
    __expose({
      inputRef: vueExports.toRef(() => inputRef.value?.$el)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TagsInputRoot_default), vueExports.mergeProps({
        id: vueExports.unref(id),
        "model-value": __props.modelValue,
        "default-value": __props.defaultValue,
        "data-slot": "root",
        class: ui.value.root({ class: [ui.value.base({ class: props.ui?.base }), props.ui?.root, props.class] })
      }, vueExports.unref(rootProps), {
        name: vueExports.unref(name),
        disabled: vueExports.unref(disabled),
        "onUpdate:modelValue": onUpdate
      }, _attrs), {
        default: vueExports.withCtx(({ modelValue: tags }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(tags, (item, index) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TagsInputItem_default), {
                key: index,
                value: item,
                "data-slot": "item",
                class: ui.value.item({ class: [props.ui?.item] })
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TagsInputItemText_default), {
                      "data-slot": "itemText",
                      class: ui.value.itemText({ class: [props.ui?.itemText] })
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (!!slots["item-text"]) {
                            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "item-text", {
                              item,
                              index,
                              ui: ui.value
                            }, null, _push4, _parent4, _scopeId3);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            !!slots["item-text"] ? vueExports.renderSlot(_ctx.$slots, "item-text", {
                              key: 0,
                              item,
                              index,
                              ui: ui.value
                            }) : vueExports.createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TagsInputItemDelete_default), {
                      "data-slot": "itemDelete",
                      class: ui.value.itemDelete({ class: [props.ui?.itemDelete] }),
                      disabled: vueExports.unref(disabled)
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "item-delete", {
                            item,
                            index,
                            ui: ui.value
                          }, () => {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                              name: __props.deleteIcon || vueExports.unref(appConfig).ui.icons.close,
                              "data-slot": "itemDeleteIcon",
                              class: ui.value.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            vueExports.renderSlot(_ctx.$slots, "item-delete", {
                              item,
                              index,
                              ui: ui.value
                            }, () => [
                              vueExports.createVNode(_sfc_main$f, {
                                name: __props.deleteIcon || vueExports.unref(appConfig).ui.icons.close,
                                "data-slot": "itemDeleteIcon",
                                class: ui.value.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })
                              }, null, 8, ["name", "class"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(vueExports.unref(TagsInputItemText_default), {
                        "data-slot": "itemText",
                        class: ui.value.itemText({ class: [props.ui?.itemText] })
                      }, {
                        default: vueExports.withCtx(() => [
                          !!slots["item-text"] ? vueExports.renderSlot(_ctx.$slots, "item-text", {
                            key: 0,
                            item,
                            index,
                            ui: ui.value
                          }) : vueExports.createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1032, ["class"]),
                      vueExports.createVNode(vueExports.unref(TagsInputItemDelete_default), {
                        "data-slot": "itemDelete",
                        class: ui.value.itemDelete({ class: [props.ui?.itemDelete] }),
                        disabled: vueExports.unref(disabled)
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.renderSlot(_ctx.$slots, "item-delete", {
                            item,
                            index,
                            ui: ui.value
                          }, () => [
                            vueExports.createVNode(_sfc_main$f, {
                              name: __props.deleteIcon || vueExports.unref(appConfig).ui.icons.close,
                              "data-slot": "itemDeleteIcon",
                              class: ui.value.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })
                            }, null, 8, ["name", "class"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["class", "disabled"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TagsInputInput_default), vueExports.mergeProps({
              ref_key: "inputRef",
              ref: inputRef
            }, { ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
              placeholder: __props.placeholder,
              "max-length": __props.maxLength,
              "data-slot": "input",
              class: ui.value.input({ class: props.ui?.input }),
              onBlur,
              onFocus
            }), null, _parent2, _scopeId));
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, null, _push2, _parent2, _scopeId);
            if (vueExports.unref(isLeading) || !!__props.avatar || !!slots.leading) {
              _push2(`<span data-slot="leading" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.leading({ class: props.ui?.leading }))}"${_scopeId}>`);
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
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(isTrailing) || !!slots.trailing) {
              _push2(`<span data-slot="trailing" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.trailing({ class: props.ui?.trailing }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
                if (vueExports.unref(trailingIconName)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, {
                    name: vueExports.unref(trailingIconName),
                    "data-slot": "trailingIcon",
                    class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(tags, (item, index) => {
                return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(TagsInputItem_default), {
                  key: index,
                  value: item,
                  "data-slot": "item",
                  class: ui.value.item({ class: [props.ui?.item] })
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(vueExports.unref(TagsInputItemText_default), {
                      "data-slot": "itemText",
                      class: ui.value.itemText({ class: [props.ui?.itemText] })
                    }, {
                      default: vueExports.withCtx(() => [
                        !!slots["item-text"] ? vueExports.renderSlot(_ctx.$slots, "item-text", {
                          key: 0,
                          item,
                          index,
                          ui: ui.value
                        }) : vueExports.createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["class"]),
                    vueExports.createVNode(vueExports.unref(TagsInputItemDelete_default), {
                      "data-slot": "itemDelete",
                      class: ui.value.itemDelete({ class: [props.ui?.itemDelete] }),
                      disabled: vueExports.unref(disabled)
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.renderSlot(_ctx.$slots, "item-delete", {
                          item,
                          index,
                          ui: ui.value
                        }, () => [
                          vueExports.createVNode(_sfc_main$f, {
                            name: __props.deleteIcon || vueExports.unref(appConfig).ui.icons.close,
                            "data-slot": "itemDeleteIcon",
                            class: ui.value.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })
                          }, null, 8, ["name", "class"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class", "disabled"])
                  ]),
                  _: 2
                }, 1032, ["value", "class"]);
              }), 128)),
              vueExports.createVNode(vueExports.unref(TagsInputInput_default), vueExports.mergeProps({
                ref_key: "inputRef",
                ref: inputRef
              }, { ..._ctx.$attrs, ...vueExports.unref(ariaAttrs) }, {
                placeholder: __props.placeholder,
                "max-length": __props.maxLength,
                "data-slot": "input",
                class: ui.value.input({ class: props.ui?.input }),
                onBlur,
                onFocus
              }), null, 16, ["placeholder", "max-length", "class"]),
              vueExports.renderSlot(_ctx.$slots, "default", { ui: ui.value }),
              vueExports.unref(isLeading) || !!__props.avatar || !!slots.leading ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 0,
                "data-slot": "leading",
                class: ui.value.leading({ class: props.ui?.leading })
              }, [
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
                ])
              ], 2)) : vueExports.createCommentVNode("", true),
              vueExports.unref(isTrailing) || !!slots.trailing ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                "data-slot": "trailing",
                class: ui.value.trailing({ class: props.ui?.trailing })
              }, [
                vueExports.renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [
                  vueExports.unref(trailingIconName) ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, {
                    key: 0,
                    name: vueExports.unref(trailingIconName),
                    "data-slot": "trailingIcon",
                    class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                  }, null, 8, ["name", "class"])) : vueExports.createCommentVNode("", true)
                ])
              ], 2)) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/@nuxt+ui@4.4.0+f82f54294f7645c1/node_modules/@nuxt/ui/dist/runtime/components/InputTags.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$3 as _, _sfc_main$2 as a, _sfc_main$1 as b, _sfc_main as c };
//# sourceMappingURL=InputTags-rlTKzWvK.mjs.map
