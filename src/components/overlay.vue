<template>
  <div
    class="overlay"
    ref="overlay"
  >

    <div
      class="overlay__tools"
      v-show="source.length > 0"
    >
      <div class="input-field">
        <label for="source">Url</label>
        <input
          id="source"
          v-model="url"
          @blur="setUrl"
          @keyup.enter="setUrl"
          type="text"
        />
        <span
          class="warning"
          v-show="urlError.http"
        >Unfortunately, this doesn't work with http website, the link will get converted to https, this could not work if the website doesn't support https</span>
        <span
          class="notification"
          v-show="urlError.nohttps"
        >You didn't give https:// with your url. I added it, if you need a local url. This won't work (yet).</span>
      </div>
      <div class="input-field">
        <label for="size">size</label>
        <select
          id="size"
          v-model="current.size"
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
          <option value="25">25%</option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option
            value="100"
            selected
          >100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
          <option value="200">200%</option>
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

    </div>

    <div
      class="overlay__view"
      :class="{'has-no-source' : source.length < 1}"
    >
      <div
        class="overlay__nosource"
        v-show="source.length < 1"
      >
        <div class="input-field">
          <input
            v-model="url"
            @blur="setUrl"
            @keyup.enter="setUrl"
            type="text"
            placeholder="Give a url"
          />
        </div>
      </div>
      <div
        class="overlay__frame"
        v-show="source.length > 0"
      >
        <iframe
          :src="source"
          scrolling="no"
          class="overlay__iframe"
        ></iframe>
        <div
          class="overlay__image"
          v-if="image.url && image.show"
        >
          <img
            :src="image.url"
            alt="the image preview"
          />
        </div>
      </div>
    </div>
    <div
      class="overlay__dropzone"
      :class="{'is-dragging': isDragging, 'is-dropped': isDropped}"
      :style="{ backgroundImage: 'url(' + image.url + ')' }"
    >

      <label for="dropzone-input"></label>
      <input
        @dragover="initDrag"
        @dragenter="initDrag"
        @dragend="stopDrag"
        @dragleave="stopDrag"
        @drop.prevent="dropFile"
        type="file"
        id="dropzone-input"
        @change="changeFile"
      />
      <div class="overlay__urloverlay">
        <input
          type="text"
          v-model="image.url"
          placeholder="Image url..."
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Overlay",
  props: {
    msg: String
  },
  data() {
    return {
      isDragging: false,
      isDropped: false,
      source: "",
      sizes: [
        { title: "Full HD", value: [1920, 1080], scaling: 1 },
        { title: "Desktop", value: [1440, 900], scaling: 1 },
        { title: "iPad", value: [1024, 768], scaling: 1 },
        { title: "iPhone Xs Max", value: [1242, 2688], scaling: 3 },
        { title: "iPhone Xs", value: [1125, 2436], scaling: 3 },
        { title: "iPhone 8", value: [750, 1334], scaling: 2 },
        { title: "iPhone 5", value: [640, 1136], scaling: 2 },
        { title: "iPhone 4", value: [640, 960], scaling: 2 }
      ],
      current: {
        scaling: 1,
        zoom: 100,
        size: null
      },
      tools: {
        opacity: 10
      },
      url: null,
      urlError: {
        https: false,
        nohttps: false
      },
      image: {
        file: null,
        width: 0,
        opacity: 5,
        url: null,
        show: true
      }
    };
  },
  methods: {
    /* eslint-disable */
    changeFile(e) {
      const _this = this;
      if (!_this.isDropped) {
        _this.uploadImage(e.srcElement.files[0]);
      }
    },
    setError(error) {
      const _this = this;
      _this.urlError[error] = true;
      setTimeout(() => {
        _this.urlError[error] = false;
      }, 1000);
    },
    setUrl() {
      if (this.url.indexOf("https://") > -1) {
        this.source = this.url + "";
      } else if (this.url.indexOf("http://") > -1) {
        this.setError("https");
        this.source = this.url.replace("http://", "https://");
      } else {
        this.setError("nohttps");
        this.source = "https://" + this.url;
      }
    },
    getImageSize() {
      const _this = this;
      const img = new Image();
      img.src = this.image.url;
      img.onload = function() {
        _this.image.width = this.width;
        _this.image.height = this.height;
        _this.current.size = [this.width, this.height];
        _this.checkScaling(_this.image);
      };
    },
    checkScaling(image) {
      const _this = this;
      this.sizes.forEach(size => {
        console.log(
          size.value[0],
          image.width,
          "/",
          size.value[1],
          image.height
        );
        if (size.value[0] === image.width && size.value[1] === image.height) {
          console.log("I guess this is a " + size.title + " screen");
          _this.current.size = size;
          _this.current.scaling = size.scaling;
          _this.setCustomProps();
        }
      });
    },
    uploadImage(file) {
      const _this = this;
      _this.image.url = URL.createObjectURL(file);
      _this.image.url = URL.createObjectURL(file);
      _this.getImageSize();
    },
    initDrag() {
      this.isDragging = true;
    },
    stopDrag() {
      this.isDragging = false;
    },
    dropFile(e) {
      this.isDragging = false;
      this.isDropped = true;
      this.uploadImage(e.dataTransfer.files[0]);
    },
    setCustomProp(prop, value, ref = "overlay") {
      this.$refs[ref].style.setProperty(prop, value);
    },
    setCustomProps(type = null) {
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
  &__dropzone {
    position: fixed;
    left: 0;
    top: 50%;
    z-index: 100;
    display: block;
    width: 6rem;
    height: 6rem;
    margin-top: -3rem;
    background-color: color(Green);
    background-size: cover;
    background-position: center center;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background-image: linear-gradient(to right, white, white),
        linear-gradient(to right, white, white);
      background-size: 2px 1rem, 1rem 2px;
      background-position: center center, center center;
      background-repeat: no-repeat;
      pointer-events: none;
    }
    &:hover {
      background-color: color(Blue);
      .overlay__urloverlay {
        clip-path: inset(0 0 0 0);
      }
    }
    &:active {
      background-color: color(Yellow);
    }
    label {
      width: 100%;
      height: 100%;
      display: block;
    }
    input[type="file"] {
      position: absolute;
      width: 100%;
      height: 100%;
      outline: none !important;
      opacity: 0;
    }
    &.is-dragging {
      background-color: color(Yellow);
    }
    &.is-dropped {
      background-color: color(Black);
    }
  }
  &__tools {
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
  &__urloverlay {
    position: absolute;
    top: 0;
    left: 100%;
    height: 100%;
    background-color: black;
    padding: 2rem;

    clip-path: inset(0 100% 0 0);
    transition: clip-path 0.3s ease-in-out;
    input[type="text"] {
      line-height: 2rem;
      font-size: 1rem;
      color: white;
      border: none;
      border-radius: 0;
      background: none;
    }
  }
  &__view {
    display: block;
    width: 100vw;
    height: calc(var(--frame-height, 768px) + #{grid(8)});
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
  }
}
</style>
