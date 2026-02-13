<script setup lang="ts">
import type { About } from '~/plugins/pocketbase.client'
import Asset7Logo from '~/assets/logo svg/Asset 7.svg'
import Asset11Logo from '~/assets/logo svg/Asset 11.svg'
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

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
    <button
      v-if="isVisible"
      class="popup-backdrop fixed inset-0 z-40"
      aria-label="Close popup"
      @click="emit('close')"
    />
  </Transition>

  <!-- Popup -->
  <Transition name="popup">
    <div
      v-if="isVisible"
      class="popup-container z-50"
    >
      <div class="relative">
        <img
          :src="ProjectCardSVG"
          alt="About Card"
          class="popup-card-image w-full h-auto"
        >

        <!-- About Content Overlay -->
        <div class="absolute inset-0 flex flex-col justify-between px-4 py-8">
          <!-- Top Logo -->
          <div class="flex justify-center">
            <img
              :src="Asset7Logo"
              alt="Joanna Logo"
              class="popup-logo-top"
            >
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col justify-center">
            <h2 class="popup-text popup-title text-black uppercase">
              {{ aboutData?.Portfolio_Title || 'Story Driven Strategy' }}
            </h2>
            <p class="popup-text popup-title text-black">
              {{ aboutData?.About_Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit, eu porta ligula mattis. Phasellus mattis rutrum elit, sed cursus risus tempus quis. Mauris sed ante et lectus consectetur aliquet. Sed in orci a metus aliquam porttitor.' }}
            </p>

            <h3 class="popup-text popup-title text-black uppercase">
              {{ aboutData?.Expertise_Title || 'Expertise' }}
            </h3>
            <p class="popup-text popup-title text-black">
              {{ aboutData?.Expertise_Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit.' }}
            </p>

            <h3 class="popup-text popup-title text-black uppercase">
              {{ aboutData?.Selected_Clients_Title || 'Selected Clients' }}
            </h3>
            <p class="popup-text popup-title text-black">
              {{ (aboutData?.Client_List_Json || aboutData?.Client_List)?.join(', ') || 'Ipsum, Dolor, Sit Amet, Consectetur, Adipiscing, Aenean, Mattis, Blandit.' }}
            </p>

            <button
              class="popup-text popup-contact-button text-black"
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
              class="popup-logo-bottom"
            >
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Component-specific styles */
.popup-backdrop {
  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: left;
}

.popup-logo-top {
  width: 4.5rem;
  height: auto;
  filter: brightness(0);
}

.popup-logo-bottom {
  width: 8rem;
  height: auto;
  filter: brightness(0);
}

.popup-contact-button {
  text-decoration: underline;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.3s;
}

.popup-contact-button:hover {
  opacity: 0.7;
}

/* Component-specific transition styles */
.popup-enter-active,
.popup-leave-active {
  transition:
    --scale 0.3s ease-out,
    opacity 0.3s ease-out;
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
