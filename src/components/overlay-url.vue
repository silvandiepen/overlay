<template>
 <div class="input-field">
      <!-- <label for="the-url">Url</label> -->
      <input
        id="the-url"
        v-model.lazy="source"
        type="text"
        placeholder="Give a URL"
      />
      <!-- <span
        class="warning"
        v-show="urlError.http"
      >Unfortunately, this doesn't work with http website, the link will get converted to https, this could not work if the website doesn't support https</span>
      <span
        class="notification"
        v-show="urlError.nohttps"
      >You didn't give https:// with your url. I added it, if you need a local url. This won't work (yet).</span> -->
    </div>
</template>

<script>
export default {
  data() {
    return {
      inputUrl: null
    };
  },
  computed: {
    source: {
      get() {
        return this.$store.state.source;
      },
      set(value) {
        this.$store.dispatch("setSource", value);
      }
    }
  }
};
</script>
