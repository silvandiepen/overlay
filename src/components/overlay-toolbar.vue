<template>
  <div
    class="toolbar"
    v-show="source.length > 0"
  >
    <overlay-url></overlay-url>
    <div class="input-field">
      <label for="size">size</label>
      <select
        id="size"
				v-model="inputSize"
				@change="setSize"
      >
        <option
          v-for="(size,index) in sizes"
          :value="size"
          :key="index"
        >{{ size.title }}</option>
      </select>
    </div>
    <div class="input-field">
      <label for="zoom">zoom</label>
      <select
        id="zoom"
        v-model="current.zoom"
      >
        <option
          v-for="(level,index) in zoom"
          :value="level"
          :key="index"
        >{{level }}%</option>
      </select>
    </div>
    <div class="input-field">
      <label for="scaling">scaling</label>
      <select
        id="scaling"
        v-model="current.scaling"
      >
        <option
          value="1"
          selected
        >1x</option>
        <option value="2">2x</option>
        <option value="3">3x</option>
      </select>
    </div>

    <div
      class="input-field input-range"
      v-if="image.url"
    >
      <label for="overlay-opacity">overlay opacity</label>
      <input
        id="overlay-opacity"
        type="range"
        min="0"
        max="10"
        steps="1"
        v-model="image.opacity"
      />
    </div>

    <div
      class="input-field input-switch"
      v-if="image.url"
    >
      <input
        id="overlay-show"
        type="checkbox"
        v-model="image.show"
      />
      <label for="overlay-show">show overlay</label>
    </div>


    <div
      class="input-field input-switch"
      v-if="image.url"
    >
      <input
        id="overlay-difference"
        type="checkbox"
        v-model="image.difference"
      />
      <label for="overlay-difference">show difference</label>
    </div>

  </div>
</template>

<script>
import overlayUrl from "@/components/overlay-url.vue";
export default {
  components: {
    overlayUrl
  },
  data() {
    return {
      inputUrl: null,
      inputSize: this.$store.state.current.size
    };
  },
  computed: {
    current() {
      return this.$store.state.current;
    },
    tools() {
      return this.$store.state.tools;
    },
    image() {
      return this.$store.state.image;
    },
    source() {
      return this.$store.state.source;
    },
    url() {
      return this.$store.state.url;
    },
    sizes() {
      return this.$store.state.sizes;
    },
    zoom() {
      return this.$store.state.zoom;
    }
  },
  methods: {
    setUrl() {
      this.$store.commit("setUrl", this.inputUrl);
    },
    setSize() {
      this.$store.commit("setCurrent", { size: this.inputSize });
    }
  },
  watch: {
    url: function() {
      this.inputUrl = this.$store.state.url;
    }
  }
};
</script>

<style lang="scss">
@import "~henris";
.toolbar {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  display: flex;
  width: calc(100% - 2rem);
  background-color: color(Black);
  padding: 1rem;
  opacity: var(--tools-opacity, 1);
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
  input {
    display: block;
    outline: none !important;
  }
  .input-field + .input-field {
    margin: 0;
    margin-left: 1rem;
  }
  .input-field {
    position: relative;
    label {
      display: block;
      width: 100%;
      color: color(White, 0.75);
      padding: 0.5rem;
      font-size: 14px;
      font-weight: bold;
    }
    select,
    input[type="text"] {
      color: white;
      border: none;
      border-radius: 0;
      background-color: color(White, 0.1);
      min-width: 3rem;
      &:hover {
        background-color: color(Green, 0.2);
        border: none;
      }
      &:focus {
        background-color: color(Blue, 0.2);
        border: none;
      }
    }
    .notification,
    .warning,
    .error {
      position: absolute;
      background-color: color(Yellow);
      top: 100%;
      left: 0;
      padding: 0.75rem;
      border-radius: 3px;
      font-size: 14px;
      line-height: 1.25;
    }
    .error {
      background-color: color(Red);
      color: color(White);
    }
    .warning {
      background-color: color(Orange);
    }
    .notification {
      background-color: color(White);
    }
  }
  .input-range {
    display: block;
  }
}
</style>
