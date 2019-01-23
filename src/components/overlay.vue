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
          v-model="currentSize"
        >
          <option
            v-for="(size,index) in sizes"
            :value="size.value"
            :key="index"
          >{{ size.title }}</option>
        </select>
      </div>
      <div class="input-field">
        <label for="zoom">zoom</label>
        <select
          id="zoom"
          v-model="currentZoom"
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
        <label for="scaling">zoom</label>
        <select
          id="scaling"
          v-model="currentScaling"
        >
          <option value="1" selected>1x</option>
          <option value="2">2x</option>
          <option value="3">3x</option>
        </select>
      </div>
      <div class="input-field input-range" 
          v-if="image.element">
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
    </div>
    <div class="overlay__view">
      <div class="overlay__nosource">
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
          v-if="image.element"
        >
          <img
            :src="image.element"
            alt="the image preview"
          />
        </div>
      </div>
    </div>
    <div
      class="overlay__dropzone"
      :class="{'is-dragging': isDragging, 'is-dropped': isDropped}"
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
      source: "",
      sizes: [
        { title: "Full HD", value: [1920, 1080] },
        { title: "Desktop", value: [1440, 900] },
        { title: "iPad", value: [1024, 768] },
        { title: "iPhone Xs Max", value: [768, 1024] }
      ],
      overlayImg: null,
      rotated: false,
      currentScaling: 1,
      currentZoom: 100,
      currentSize: [1024, 768],
      tools: {
        opacity: 10
      },
      url: null,
      urlError: {
        https: false
      },
      showImage: false,
      offset_is_pristine: true,
      blob: false,
      isDragging: false,
      isDropped: false,
      image: {
        file: null,
        width: 0,
        opacity: 50
      }
    };
  },
  methods: {
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
      img.src = this.url;
      img.onload = function() {
        _this.image.width = this.width;
        _this.currentSize = [this.width, this.height];
      };
    },
    uploadImage(file) {
      const _this = this;
      _this.image.element = URL.createObjectURL(file);
      _this.blob = true;
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
    }
  },
  watch: {
    currentSize: {
      handler: function() {
        if (this.rotated) {
          this.$refs.overlay.style.setProperty(
            "--frame-width",
            `${this.currentSize[1]}px`
          );
          this.$refs.overlay.style.setProperty(
            "--frame-height",
            `${this.currentSize[0]}px`
          );
        } else {
          this.$refs.overlay.style.setProperty(
            "--frame-width",
            `${this.currentSize[0]}px`
          );
          this.$refs.overlay.style.setProperty(
            "--frame-height",
            `${this.currentSize[1]}px`
          );
        }
      }
      // immediate: true
    },
    currentZoom: {
      handler: function() {
        this.$refs.overlay.style.setProperty(
          "--frame-zoom",
          this.currentZoom / 100
        );
      }
      // immediate: true
    },
    currentScaling: {
      handler: function() {
        this.$refs.overlay.style.setProperty(
          "--image-scaling",
          this.currentScaling
        );
      }
      // immediate: true
    },
    tools: {
      handler: function() {
        this.$refs.overlay.style.setProperty(
          "--tools-opacity",
          this.tools.opacity / 10
        );
      },
      // immediate: true,
      deep: true
    },
    image: {
      handler: function() {
        this.$refs.overlay.style.setProperty(
          "--image-opacity",
          this.image.opacity / 10
        );
      },
      // immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "~@sil/base-style/src/scss/index.full";
.overlay {
  &__dropzone {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 100;
    display: block;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    right: 1rem;
    background-color: color(Green);
    background-image: linear-gradient(to right, white, white),
      linear-gradient(to right, white, white);
    background-size: 2px 1rem, 1rem 2px;
    background-position: center center, center center;
    background-repeat: no-repeat;
    &:hover {
      background-color: color(Blue);
    }
    &:active {
      background-color: color(Yellow);
    }
    label {
      width: 100%;
      height: 100%;
      display: block;
    }
    input {
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
    border-radius: 0.5rem;
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
        background-color: transparent;
        color: white;
        border: 1px solid color(White, 0.2);
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
  &__view {
    display: block;
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    background-color: color(Black, 0.25);
    padding: grid(2) 0;
  }
  &__nosource {
    .input-field {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      input[type="text"] {
        font-size: 2rem;
        padding: 2rem;
        border-radius: 3.5rem;
        width: auto;
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
    width: calc(
      (var(--frame-width, 1024px) * var(--frame-zoom, 1)) /
        var(--image-scaling, 1)
    );
    height: calc(
      (var(--frame-height, 768px) * var(--frame-zoom, 1)) /
        var(--image-scaling, 1)
    );
    transition: transform 0.3s, width 0.3s, height 0.3s;
  }
  &__iframe {
    transform: scale(var(--frame-zoom, 1));
    width: 100%;
    height: 100%;
  }
  &__image {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    outline: none !important;
    pointer-events: none;

    transform: scale(var(--frame-zoom, 1));
    opacity: var(--image-opacity, 0.5);
    img {
      width: 100%;
    }
  }
}
</style>
