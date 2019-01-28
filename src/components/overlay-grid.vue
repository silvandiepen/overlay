<template>
  <textarea
    ref="grid"
    class="overlay__grid"
    :class="typeClass"
		v-show="grid.active"
  >
	</textarea>
</template>

<script>
export default {
  name: "Grid",
  computed: {
    grid: {
      get() {
        return this.$store.state.grid;
      }
    },
    gridType: {
      get() {
        return this.$store.state.grid.type;
      }
    },
    typeClass() {
      return "overlay__grid--" + this.gridType;
    }
  },
  watch: {
    grid: {
      handler() {
        this.updateSettings();
      },
      deep: true
    }
  },
  methods: {
    updateSettings() {
      let view = this.$refs.grid;
      view.style.setProperty(
        "--grid-width",
        this.grid.width * this.grid.zoom + "px"
      );
      view.style.setProperty("--grid-og-width", this.grid.og_width + "px");
      view.style.setProperty(
        "--grid-image-width",
        this.grid.og_width * this.grid.zoom + "px"
      );
      view.style.setProperty("--grid-columns", this.grid.columns);
      view.style.setProperty("--grid-color", this.grid.color);
      view.style.setProperty("--grid-zoom", this.grid.zoom);
      view.style.setProperty(
        "--grid-offset-left",
        this.grid.offset * this.grid.zoom + "px"
      );
    }
  }
};
</script>

<style lang="scss">
@import "~henris";
$base-transition: 0.3s;
$base-bezier: ease-in-out;
.overlay__grid {
  position: absolute;
  left: var(--grid-offset-left, 0);
  top: 0;
  display: block;
  width: var(--grid-width, 100%);
  transition: width $base-transition $base-bezier,
    left $base-transition $base-bezier;
  height: 100%;
  background-color: transparent;
  border: none;
  box-shadow: 0 0 0 calc(var(--grid-image-width) - var(--grid-width)) black,
    0 0 0 10px black;
  &--lines {
    opacity: 0.5;
    background-image: linear-gradient(
        to left top,
        color(Red),
        color(Red, 0) 50%
      ),
      linear-gradient(
        to right,
        var(--grid-color, rgb(127, 127, 127)),
        var(--grid-color, rgb(127, 127, 127)) calc(0% + 1px),
        transparent calc(0% + 1px),
        transparent
      );

    background-size: 4rem 4rem, calc(100% / var(--grid-columns, 24));
    background-repeat: no-repeat, repeat;
    background-position: bottom right, left top;
  }
  &--odd-even {
    opacity: 0.25;
    background-image: linear-gradient(
        to left top,
        color(Red),
        color(Red, 0) 50%
      ),
      linear-gradient(
        to right,
        var(--grid-color, rgb(127, 127, 127)),
        var(--grid-color, rgb(127, 127, 127)) calc(50%),
        transparent calc(50%),
        transparent
      );

    background-size: 4rem 4rem, calc(100% / ((var(--grid-columns, 24) / 2)));
    background-repeat: no-repeat, repeat;
    background-position: bottom right, left top;
  }
}
</style>
