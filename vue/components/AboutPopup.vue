<script setup lang="ts">
import type { About } from '@/config/pocketbase'
import Asset7Logo from '@/assets/logo svg/Asset 7.svg'
import Asset11Logo from '@/assets/logo svg/Asset 11.svg'
import ProjectCardSVG from '@/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

defineProps<{
  isVisible: boolean
  aboutData: About | null
}>()

const emit = defineEmits<{
  close: []
}>()

function handleContact(aboutData: About | null) {
  const email = aboutData?.Contact_Email || 'hello@joannavanderwerf.com'
  window.location.href = `mailto:${email}`
}
</script>

<template>
  <!-- Backdrop with blur -->
  <Transition name="about-backdrop">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-40"
      :style="{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }"
      @click="emit('close')"
    />
  </Transition>

  <!-- Popup -->
  <Transition name="popup">
    <div
      v-if="isVisible"
      class="fixed z-50 popup-container"
      :style="{
        top: '50%',
        left: '50%',
        width: '280px',
        position: 'fixed',
        transform: 'translate(-50%, -50%) scale(var(--scale, 1))',
      }"
    >
      <div class="relative">
        <img
          :src="ProjectCardSVG"
          alt="About Card"
          class="w-full h-auto"
          :style="{
            width: '280px',
            height: 'auto',
            filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15))',
          }"
        >

        <!-- About Content Overlay -->
        <div class="absolute inset-0 flex flex-col justify-between px-4 py-8">
          <!-- Top Logo -->
          <div class="flex justify-center">
            <img
              :src="Asset7Logo"
              alt="Joanna Logo"
              :style="{ width: '4.5rem', height: 'auto', filter: 'brightness(0)' }"
            >
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col justify-center">
            <h2
              class="text-black uppercase text-center leading-tight"
              :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
            >
              {{ aboutData?.Portfolio_Title || 'Story Driven Strategy' }}
            </h2>
            <p
              class="text-black text-center leading-tight"
              :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
            >
              {{ aboutData?.About_Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit, eu porta ligula mattis. Phasellus mattis rutrum elit, sed cursus risus tempus quis. Mauris sed ante et lectus consectetur aliquet. Sed in orci a metus aliquam porttitor.' }}
            </p>

            <h3
              class="text-black uppercase text-center leading-tight"
              :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
            >
              {{ aboutData?.Expertise_Title || 'Expertise' }}
            </h3>
            <p
              class="text-black text-center leading-tight"
              :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
            >
              {{ aboutData?.Expertise_Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit.' }}
            </p>

            <h3
              class="text-black uppercase text-center leading-tight"
              :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
            >
              {{ aboutData?.Selected_Clients_Title || 'Selected Clients' }}
            </h3>
            <p
              class="text-black text-center leading-tight"
              :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
            >
              {{ (aboutData?.Client_List_Json || aboutData?.Client_List)?.join(', ') || 'Ipsum, Dolor, Sit Amet, Consectetur, Adipiscing, Aenean, Mattis, Blandit.' }}
            </p>

            <button
              class="text-black text-center leading-tight cursor-pointer hover:opacity-70 transition-opacity duration-300"
              :style="{
                fontFamily: 'EnduroWeb, sans-serif',
                letterSpacing: '0.03em',
                fontSize: '12px',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                width: '100%',
              }"
              @click="handleContact(aboutData)"
            >
              {{ aboutData?.Contact_Message || 'Get in touch' }}
            </button>
          </div>

          <!-- Bottom Logo -->
          <div class="flex justify-center">
            <img
              :src="Asset11Logo"
              alt="Van Der Weg Logo"
              :style="{ width: '8rem', height: 'auto', filter: 'brightness(0)' }"
            >
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@property --scale {
  syntax: '<number>';
  inherits: false;
  initial-value: 1;
}

.popup-enter-active,
.popup-leave-active {
  transition: --scale 0.3s ease-out, opacity 0.3s ease-out;
}
.popup-enter-from,
.popup-leave-to {
  --scale: 0.8;
  opacity: 0;
}
.popup-enter-to,
.popup-leave-from {
  --scale: 1;
  opacity: 1;
}

.about-backdrop-enter-active,
.about-backdrop-leave-active {
  transition: opacity 0.3s ease-out;
}
.about-backdrop-enter-from,
.about-backdrop-leave-to {
  opacity: 0;
}
</style>
