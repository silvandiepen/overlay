<template>
 <div class="input-field">
      <!-- <label for="the-url">Url</label> -->
      <input
        id="the-url"
        v-model="inputUrl"
        @blur="setUrl"
        @keyup.enter="setUrl"
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
    url() {
      return this.$store.state.url;
    }
  },
  methods: {
    setUrl() {
      if (this.inputUrl.indexOf("https://") > -1) {
        this.$store.commit("setSource", this.inputUrl + "");
      } else if (this.inputUrl.indexOf("http://") > -1) {
        // this.setError("https");
        this.$store.commit(
          "setSource",
          this.inputUrl.replace("http://", "https://")
        );
      } else {
        // this.setError("nohttps");
        this.$store.commit("setSource", "https://" + this.inputUrl);
      }
    }
  },
  watch: {
    storeUrl: function() {
      /* eslint-disable */
      console.log(this.$store.state);
      this.inputUrl = this.$store.state.url;
    }
  }
};
</script>
