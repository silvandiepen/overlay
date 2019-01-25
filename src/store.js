import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: "Overlay",
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    source: "",
    current: {
      scaling: 1,
      zoom: 100,
      size: null
    },
    tools: {
      opacity: 10
    },
    url: null,
    image: {
      file: null,
      width: 0,
      opacity: 5,
      url: null,
      show: true,
      difference: false
    },
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
    zoom: [25, 50, 75, 100, 125, 150, 200, 300]
  },
  mutations: {
    setSource(state, value) {
      state.source = value;
    },
    setUrl(state, value) {
      state.url = value;
    },
    setImage(state, value) {
      state.image = Object.assign({}, state.image, value);
    },
    setTool(state, value) {
      state.tools = Object.assign({}, state.tools, value);
    },
    setCurrent(state, value) {
      state.current = Object.assign({}, state.current, value);
    }
  },
  actions: {
    setScaling($store, image) {
      /* eslint-disable */
      $store.state.sizes.forEach(size => {
        if (size.value[0] === image.width && size.value[1] === image.height) {
          $store.commit("setCurrent", {
            size: size,
            scaling: size.scaling
          });
        }
      });
      
    }
  },
  getters: {
    getSize: state => {
      return state.sizes.filter(size => size.value);
    }
  },
  plugins: [vuexLocal.plugin]
});
