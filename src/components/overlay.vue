<template>
  <div
    class="overlay"
    ref="overlay"
  >

    <overlay-toolbar></overlay-toolbar>

    <div
      class="overlay__view"
      :class="{'has-no-source' : source.length < 1}"
    >
      <div
        class="overlay__nosource"
        v-show="source.length < 1"
      >
        <overlay-url></overlay-url>

      </div>
  
      <overlay-frame v-show="source.length > 0"></overlay-frame>
      <overlay-img></overlay-img>
      <!-- <overlay-grid v-show="source.length > 0"></overlay-grid> -->
    </div>
    <overlay-error></overlay-error>
  </div>
</template>

<script>
const OverlayToolbar = () => import("@/components/overlay-toolbar.vue");
const OverlayUrl = () => import("@/components/overlay-url.vue");
const OverlayFrame = () => import("@/components/overlay-frame.vue");
const OverlayImg = () => import("@/components/overlay-img.vue");
// const OverlayGrid = () => import("@/components/overlay-grid.vue");
const OverlayError = () => import("@/components/overlay-error.vue");
export default {
  name: "Overlay",
  components: {
    OverlayToolbar,
    OverlayUrl,
    OverlayFrame,
    OverlayImg,
    // OverlayGrid,
    OverlayError
  },
  computed: {
    current: {
      get() {
        return this.$store.state.current;
      }
    },
    tools: {
      get() {
        return this.$store.state.tools;
      }
    },
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
  },
  methods: {
    setCustomProp(prop, value, ref = "overlay") {
      this.$refs[ref].style.setProperty(prop, value);
    },
    setCustomProps(type = null) {
      /* eslint-disable */
      console.log('current: ', this.current);
      if (type == "size" || type == null) {
        this.setCustomProp(
          "--frame-width",
          this.current.size.value[0] / this.current.scaling + "px"
        );
        this.setCustomProp(
          "--frame-height",
          this.current.size.value[1] / this.current.scaling + "px"
        );
      }
      if (type == "zoom" || type == null) {
        this.setCustomProp("--frame-zoom", this.current.zoom / 100);
      }
      if (type == "scaling" || type == null) {
        this.setCustomProp("--image-scaling", this.current.scaling);
      }
      if (type == "tools" || type == null) {
        this.setCustomProp("--tools-opacity", this.tools.opacity / 10);
      }
      if (type == "image" || type == null) {
        this.setCustomProp("--image-opacity", this.image.opacity / 10);
      }
    }
  },
  watch: {
    "current.size": function() {
      if (this.source) {
        this.setCustomProps("size");
      }
    },
    "current.zoom": function() {
      if (this.source) {
        this.setCustomProps("zoom");
      }
    },
    "current.scaling": function() {
      if (this.source) {
        this.setCustomProps("scaling");
      }
    },
    tools: {
      handler: function() {
        this.setCustomProps("tools");
      },
      deep: true
    },
    image: {
      handler: function() {
        this.setCustomProps("image");
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "~@sil/base-style/src/scss/index.full";
.overlay {
  position: relative;

  &__view {
    display: block;
    width: 100vw;
    height: calc(var(--frame-height, 768px) + #{grid(8)});
    min-height: 100vh;
    overflow: scroll;
    background-color: color(Black, 0.9);
    padding: grid(4) 0;
    @include min-(padding, 4, 160) {
      padding: 160px 0;
    }
    &.has-no-source {
      height: 100vh;
      max-height: 100vh;
    }
  }
  &__nosource {
    .input-field {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      input[type="text"] {
        font-size: 2rem;
        height: 6rem;
        line-height: 2rem;
        padding: 2rem;
        width: auto;
        border-radius: 0;
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
