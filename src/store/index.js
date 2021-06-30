import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  key: "basicData",
  storage: window.localStorage,
});
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    favourites: [],
  },
  mutations: {
    setFavourites(state, value) {
      state.favourites = value;
    },
  },
  getters: {
    getFavourites(state) {
      return state.favourites;
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexLocal.plugin],
});
