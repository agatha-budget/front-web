<template>
  <div class="loader-container">
    <div class="image-spinner">
      <img src="@/assets/logo_round.png"/>
      <div class="spin spinner"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoaderCmpt'
})
</script>
