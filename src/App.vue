<template>
  <div id="app">
    <overlay></overlay>
    <section class="background--yellow">
      <div class="container content">
        <h2>Overlay</h2>
        <p>Overlay is a little tool, that helps you check if a website is identical to the design.</p>
        <p>Give the url to the website, upload the image of your design and see the overlay.</p>
      </div>
    </section>
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
