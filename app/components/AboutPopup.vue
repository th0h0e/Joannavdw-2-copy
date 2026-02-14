<script setup lang="ts">
import Asset7Logo from '~/assets/logo svg/Asset 7.svg'
import Asset11Logo from '~/assets/logo svg/Asset 11.svg'
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

const { aboutData } = useAboutData()

function handleContact() {
  const email = aboutData.value?.Contact_Email || 'hello@joannavanderwerf.com'
  window.location.href = `mailto:${email}`
}
</script>

<template>
  <div class="popup-container">
    <img
      :src="ProjectCardSVG"
      alt="About Card"
      class="popup-card-image"
    >

    <div class="absolute inset-0 flex flex-col justify-between px-4 py-8">
      <div class="flex justify-center">
        <img
          :src="Asset7Logo"
          alt="Joanna Logo"
          class="w-[4.5rem] h-auto brightness-0"
        >
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <h2 class="text-popup-title">
          {{ aboutData?.Portfolio_Title || 'Story Driven Strategy' }}
        </h2>
        <p class="text-popup-body">
          {{ aboutData?.About_Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit, eu porta ligula mattis. Phasellus mattis rutrum elit, sed cursus risus tempus quis. Mauris sed ante et lectus consectetur aliquet. Sed in orci a metus aliquam porttitor.' }}
        </p>

        <h3 class="text-popup-title">
          {{ aboutData?.Expertise_Title || 'Expertise' }}
        </h3>
        <p class="text-popup-body">
          {{ aboutData?.Expertise_Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ipsum vel nulla blandit.' }}
        </p>

        <h3 class="text-popup-title">
          {{ aboutData?.Selected_Clients_Title || 'Selected Clients' }}
        </h3>
        <p class="text-popup-body">
          {{ (aboutData?.Client_List_Json || [])?.join(', ') || 'Ipsum, Dolor, Sit Amet, Consectetur, Adipiscing, Aenean, Mattis, Blandit.' }}
        </p>

        <button
          class="text-popup-link"
          @click="handleContact"
        >
          {{ aboutData?.Contact_Message || 'Get in touch' }}
        </button>
      </div>

      <div class="flex justify-center">
        <img
          :src="Asset11Logo"
          alt="Van Der Weg Logo"
          class="w-32 h-auto brightness-0"
        >
      </div>
    </div>
  </div>
</template>
