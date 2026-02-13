<script setup lang="ts">
import Asset7Logo from '~/assets/logo svg/Asset 7.svg'
import Asset11Logo from '~/assets/logo svg/Asset 11.svg'
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

defineProps<{
  aboutData: Record<string, unknown> | null
}>()

function handleContact(aboutData: Record<string, unknown> | null) {
  const email = (aboutData?.Contact_Email as string) || 'hello@joannavanderwerf.com'
  window.location.href = `mailto:${email}`
}
</script>

<template>
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
          {{ ((aboutData?.Client_List_Json as string[]) || (aboutData?.Client_List as string[]) || [])?.join(', ') || 'Ipsum, Dolor, Sit Amet, Consectetur, Adipiscing, Aenean, Mattis, Blandit.' }}
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
</template>

<style scoped>
.popup-card-image {
  max-width: 90vw;
  max-height: 85vh;
  width: auto;
  height: auto;
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

.popup-text {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.4;
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
</style>
