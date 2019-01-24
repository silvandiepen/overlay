<template>
  <div
    class="dropzone"
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
    <div class="dropzone__urloverlay">
      <input
        type="text"
        v-model="image.url"
        placeholder="Image url..."
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDragging: false,
      isDropped: false
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
    }
  },
  methods: {
    /* eslint-disable */
    changeFile(e) {
      const _this = this;
      if (!_this.isDropped) {
        _this.uploadImage(e.srcElement.files[0]);
      }
    },
    getImageSize() {
      const _this = this;
      const img = new Image();
      img.src = this.$store.state.image.url;
      img.onload = function() {
       _this.$store.commit("setImage", {
          width: this.width,
          height: this.height
        });
        _this.$store.commit("setCurrent", { size: [this.width, this.height] });
        _this.$store.dispatch("setScaling", this);
      };
    },

    uploadImage(file) {
      const _this = this;
      this.$store.commit("setImage", {
        url: URL.createObjectURL(file)
      });
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
  }
};
</script>

<style lang="scss">
@import "~henris";
.dropzone {
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
    .dropzone__urloverlay {
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
}
</style>
