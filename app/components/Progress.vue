<script lang="ts">
interface ProgressProps {
  modelValue?: number | null
  max?: number
  status?: boolean
  inverted?: boolean
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'
  orientation?: 'horizontal' | 'vertical'
  animation?: 'carousel' | 'carousel-inverse' | 'swing' | 'elastic'
  class?: any
}

interface ProgressSlots {
  status: (props: { percent?: number }) => any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ProgressProps>(), {
  modelValue: null,
  max: 100,
  inverted: false,
  size: 'md',
  color: 'primary',
  orientation: 'horizontal',
  animation: 'carousel',
})

defineSlots<ProgressSlots>()

const isIndeterminate = computed(() => props.modelValue === null)

const percent = computed(() => {
  if (isIndeterminate.value)
    return undefined

  const value = props.modelValue!
  if (value < 0)
    return 0
  if (value > props.max)
    return 100
  return Math.round((value / props.max) * 100)
})

const indicatorStyle = computed(() => {
  if (percent.value === undefined)
    return undefined

  if (props.orientation === 'vertical') {
    return { transform: `translateY(${props.inverted ? '' : '-'}${100 - percent.value}%)` }
  }

  return { transform: `translateX(${props.inverted ? '' : '-'}${100 - percent.value}%)` }
})

const statusStyle = computed(() => {
  const value = `${Math.max(percent.value ?? 0, 0)}%`
  return props.orientation === 'vertical' ? { height: value } : { width: value }
})

const ui = computed(() => {
  const sizeMap: Record<string, { status: string, base: string }> = {
    '2xs': { status: 'text-xs', base: 'h-1' },
    'xs': { status: 'text-xs', base: 'h-1.5' },
    'sm': { status: 'text-sm', base: 'h-2' },
    'md': { status: 'text-sm', base: 'h-2.5' },
    'lg': { status: 'text-base', base: 'h-3' },
    'xl': { status: 'text-base', base: 'h-4' },
    '2xl': { status: 'text-lg', base: 'h-5' },
  }

  const colorMap: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-info',
    neutral: 'bg-inverted',
  }

  const animationMap: Record<string, string> = {
    'carousel': 'animate-[carousel_2s_ease-in-out_infinite]',
    'carousel-inverse': 'animate-[carousel-inverse_2s_ease-in-out_infinite]',
    'swing': 'animate-[swing_1.5s_ease-in-out_infinite]',
    'elastic': 'animate-[elastic_1s_ease-in-out_infinite]',
  }

  const size = sizeMap[props.size]
  const isVertical = props.orientation === 'vertical'

  return {
    root: ['gap-2', isVertical ? 'h-full flex flex-row-reverse' : 'w-full flex flex-col'],
    status: [
      'flex text-dimmed transition-[width,height] duration-200',
      size.status,
      isVertical ? 'flex-col justify-end min-h-fit' : 'flex-row items-center justify-end min-w-fit',
      props.inverted && 'self-end',
    ],
    base: [
      'relative overflow-hidden rounded-full bg-accented',
      size.base,
      isVertical ? 'h-full' : 'w-full',
    ],
    indicator: [
      'rounded-full size-full transition-transform duration-200 ease-out',
      colorMap[props.color],
      isIndeterminate.value && animationMap[props.animation],
    ],
  }
})
</script>

<template>
  <div
    :data-orientation="orientation"
    :class="[ui.root, props.class]"
  >
    <div
      v-if="!isIndeterminate && status"
      :class="ui.status"
      :style="statusStyle"
    >
      <slot
        name="status"
        :percent="percent"
      >
        {{ percent }}%
      </slot>
    </div>

    <div
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="isIndeterminate ? undefined : modelValue ?? undefined"
      :class="ui.base"
      style="transform: translateZ(0)"
    >
      <div
        :class="ui.indicator"
        :style="indicatorStyle"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes carousel {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes carousel-inverse {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes swing {
  0%,
  100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

@keyframes elastic {
  0% {
    transform: translateX(-100%) scaleX(0.5);
  }
  50% {
    transform: translateX(100%) scaleX(1);
  }
  100% {
    transform: translateX(-100%) scaleX(0.5);
  }
}
</style>
