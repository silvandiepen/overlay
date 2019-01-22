<template>
  <div id="app">
    <overlay></overlay>
    <sil-footer></sil-footer>
  </div>
</template>

<script>
import Overlay from "./components/overlay.vue";
import silFooter from "./components/footer.vue";

export default {
  name: "app",
  components: {
    Overlay,
    silFooter
  }
};
</script>

<style lang="scss">
@import "~@sil/base-style/src/scss/index.full";
</style>
