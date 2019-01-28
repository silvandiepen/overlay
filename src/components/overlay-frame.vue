<template>
  <div class="overlay__frame">
    <iframe
      :src="source"
      scrolling="no"
      class="overlay__iframe"
    ></iframe>
    <div
      class="overlay__image"
      :class="{'is-difference' : image.difference}"
      v-if="image.url && image.show"
    >
      <img
        :src="image.url"
        alt="the image preview"
      />
    </div>
		<overlay-grid></overlay-grid>

  </div>
</template>

<script>
const OverlayGrid = () => import("@/components/overlay-grid.vue");
export default {
  components: {
    OverlayGrid
  },
  computed: {
    image: {
      get() {
        return this.$store.state.image;
      }
    },
    source: {
      get() {
        return this.$store.state.source;
      }
    }
  }
};
</script>

<style lang="scss">
.overlay {
  &__frame {
    position: relative;
    display: block;
    margin: auto;
    width: calc((var(--frame-width, 1024px) * var(--frame-zoom, 1)));
    height: calc((var(--frame-height, 768px) * var(--frame-zoom, 1)));
    transform: scale(var(--frame-zoom, 1) / var(--image-scaling, 1));
    transition: transform 0.3s, width 0.3s, height 0.3s;
  }
  &__iframe {
    transform: scale(var(--frame-zoom, 1));
    width: 100%;
    height: 100%;
  }
  &__image {
    width: calc((var(--frame-width, 1024px) * var(--frame-zoom, 1)));
    height: calc((var(--frame-height, 768px) * var(--frame-zoom, 1)));
    position: absolute;
    left: 0;
    top: 0;
    outline: none !important;
    pointer-events: none;
    transform: scale(var(--frame-zoom, 1) / var(--image-scaling, 1));
    opacity: var(--image-opacity, 0.5);
    img {
      width: 100%;
    }
    &.is-difference {
      mix-blend-mode: difference;
    }
  }
}
</style>
