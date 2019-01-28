<template>
  <div
    class="toolbar"
    v-show="source.length > 0"
  >
    <overlay-url></overlay-url>
    <div class="input-field input-select">
      <label for="size">size</label>
      <select
        id="size"
        v-model="currentSize"
      >
        <option
          v-for="(size,index) in settings.sizes"
          :value="size"
          :key="index"
        >{{ size.title }}</option>
      </select>
    </div>
    <div class="input-field input-select">
      <label for="zoom">zoom</label>
      <select
        id="zoom"
        v-model="currentZoom"
      >
        <option
          v-for="(level,index) in settings.zoomLevels"
          :value="level"
          :key="index"
        >{{level }}%</option>
      </select>
    </div>
    <div class="input-field input-select">
      <label for="scaling">scaling</label>
      <select
        id="scaling"
        v-model="currentScaling"
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
      <label for="overlay-show">overlay</label>
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
      <label for="overlay-difference">difference</label>
    </div>

    <div
      class="input-field input-switch"
      v-if="image.url"
    >
      <input
        id="overlay-grid"
        type="checkbox"
        v-model="gridActive"
      />
      <label for="overlay-grid">grid</label>
    </div>

    <div
      class="toolbar__grid"
      v-show="gridActive"
    >
      <div class="toolbar__grid-settings">

        <div class="input-field input-number">
          <label>
            Grid width
          </label>
          <input
            type="number"
            v-model="gridWidth"
          />
        </div>
        <div class="input-field input-number">
          <label>
            Total columns
          </label>
          <input
            type="number"
            v-model="gridColumns"
          />
        </div>
        <div class="input-field input-number">
          <label>
            Grid Offset
          </label>
          <input
            type="number"
            v-model="gridOffset"
            step="10"
          />
        </div>
        <div class="input-field input-select">
          <label>
            Grid type
          </label>
          <select v-model="gridType">
            <option value="lines">Lines</option>
            <option value="odd-even">Odd/Even</option>
          </select>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import overlayUrl from "@/components/overlay-url.vue";
export default {
  components: {
    overlayUrl
  },
  computed: {
    toolsOpacity: {
      get() {
        return this.$store.state.tools.opacity;
      },
      set(value) {
        this.$store.dispatch("setTools", { opacity: value });
      }
    },
    source: {
      get() {
        return this.$store.state.source;
      }
    },
    image: {
      get() {
        return this.$store.state.image;
      }
    },
    settings: {
      get() {
        return this.$store.state.settings;
      }
    },
    currentScaling: {
      get() {
        return this.$store.state.current.scaling;
      },
      set(value) {
        this.$store.dispatch("setCurrent", {
          scaling: value
        });
      }
    },
    currentZoom: {
      get() {
        return this.$store.state.current.zoom;
      },
      set(value) {
        this.$store.dispatch("setCurrent", {
          zoom: value
        });
      }
    },
    currentSize: {
      get() {
        return this.$store.state.current.size;
      },
      set(value) {
        this.$store.dispatch("setCurrent", {
          size: value
        });
      }
    },
    gridActive: {
      get() {
        return this.$store.state.grid.active;
      },
      set(value) {
        this.$store.dispatch("setGrid", { active: value });
      }
    },
    gridType: {
      get() {
        return this.$store.state.grid.type;
      },
      set(value) {
        this.$store.dispatch("setGrid", { type: value });
      }
    },
    gridWidth: {
      get() {
        return this.$store.state.grid.width;
      },
      set(value) {
        this.$store.dispatch("setGrid", { width: value });
      }
    },
    gridZoom: {
      get() {
        return this.$store.state.grid.zoom;
      },
      set(value) {
        this.$store.dispatch("setGrid", { zoom: value });
      }
    },
    gridOffset: {
      get() {
        return this.$store.state.grid.offset;
      },
      set(value) {
        this.$store.dispatch("setGrid", { offset: value });
      }
    },
    gridColumns: {
      get() {
        return this.$store.state.grid.columns;
      },
      set(value) {
        this.$store.dispatch("setGrid", { columns: value });
      }
    }
  }
};
</script>

<style lang="scss">
@import "~henris";

.toolbar {
  --border-radius: 0;
  --form-body: #{color(Black)};
  --form-body-focus: #{color(Green, 0.5)};
  --form-body-hover: #{color(Blue, 0.5)};
  --form-accent: #{color(Blue)};
  --form-text-color: white;
  --form-label-color: white;
  --form-border-width: 0;
  --form-text-color-placeholder: #{color(White, 0.25)};
  --range-track-focus-background: #{color(Blue)};
  --range-track-background: linear-gradient(
    to right,
    #{color(Dark)} 10%,
    #{color(Gray) 90%}
  );
  --range-track-focus-background: linear-gradient(
    to right,
    #{color(Dark)} 10%,
    #{color(White) 90%}
  );
  --range-thumb-background: #{color(White)};
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  display: flex;
  width: calc(100% - 2rem);
  // background-color: color(Black);
  // padding: 1rem;
  opacity: var(--tools-opacity, 1);
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
  input {
    display: block;
    outline: none !important;
  }
  &__grid {
    position: absolute;
    left: 0;
    top: 100%;
    // width: 100%;
  }
  &__grid-settings {
    display: flex;
    flex-wrap: nowrap;
    padding: 1rem 0;
  }
  .input-field.input-text,
  .input-field.input-number,
  .input-field.input-select,
  .input-field.input-range {
    position: relative;
    label {
      position: absolute;
      top: 100%;
      opacity: 0;
      transform: translateY(-1rem);
      transition: opacity $base-transition, transform $base-transition;
      font-size: 12px;
      padding: 0;
    }
    &:hover label {
      opacity: 1;
      transform: translateY(0rem);
    }
  }
  .input-field.input-number {
    input[type="number"] {
      -moz-appearance: textfield;
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        background-image: linear-gradient(
            to left bottom,
            transparent 50%,
            currentColor 50%
          ),
          linear-gradient(to right bottom, transparent 50%, currentColor 50%),
          linear-gradient(to right top, transparent 50%, currentColor 50%),
          linear-gradient(to left top, transparent 50%, currentColor 50%);
        background-repeat: no-repeat;
        background-size: 4px 4px, 4px 4px, 4px 4px, 4px 4px;
        background-position: bottom calc(50% + 6px) right calc(50% - 2px),
          bottom calc(50% + 6px) right calc(50% + 2px),
          top calc(50% + 6px) left calc(50% - 2px),
          top calc(50% + 6px) left calc(50% + 2px);
        width: 3em;
        opacity: 0.5; /* shows Spin Buttons per default (Chrome >= 39) */
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
      }
      &::-webkit-inner-spin-button:hover,
      &::-webkit-inner-spin-button:active &::-webkit-outer-spin-button:hover,
      &::-webkit-outer-spin-button:active {
        opacity: 1;
      }
      &:focus {
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          opacity: 1;
        }
      }
    }
  }

  .input-field + .input-field {
    margin: 0;
    margin-left: 1rem;
  }
  .input-field {
    position: relative;
    &.input-switch {
      input[type="checkbox"] {
        & + label {
          color: color(Gray);
        }
        &:checked + label {
          color: color(White);
        }
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
}
</style>
