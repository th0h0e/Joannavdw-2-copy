<template>
  <div class="admin-layout bg-default min-h-screen">
    <slot />
  </div>
</template>

<style scoped>
.admin-layout {
  font-size: 16px;
}

.admin-layout :deep(input),
.admin-layout :deep(textarea),
.admin-layout :deep(select) {
  font-size: 16px;
}
</style>
