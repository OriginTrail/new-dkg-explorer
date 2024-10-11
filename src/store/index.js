import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    login({ commit }, user) {
      // Logic to log in the user
      commit("setUser", user);
    },
    logout({ commit }) {
      // Logic to log out the user
      commit("setUser", null);
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    },
  },
});

export default store;
