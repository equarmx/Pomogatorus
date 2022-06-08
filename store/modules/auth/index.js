import Request from "@/services/request";
import Vue from "vue";

export default {
  state: {
    userData: {},
  },
  mutations: {
    //  AUTH
    set_user_data(state, result) {
      state.userData = []
      state.userData = result
      // if (!result.access_token)
      //   return false
      //
      // const {token, defined_ttl_minutes} = result.access_token;
      //
      // this.$cookiz.set("accessToken", token, {maxAge: defined_ttl_minutes});
    },
  },
  actions: {
    // AUTH
    async refreshTokens({commit}){
      const tokensData = await Request.post(window.location.origin + '/api/auth/refresh')
      commit('set_user_data', tokensData.data)
      return tokensData
    },
    async loginUser({commit}, objData) {
      console.log(objData)
      const tokensData = await Request.post(window.location.origin + '/api/auth/login', objData)
      commit('set_user_data', tokensData.data)

      return tokensData
    },
    async createAndAuthUserByEmail(_, objData) {
      //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
      return await Request.post(this.state.BASE_URL+'/users/create-from-only-email', objData)
    },
  },
  getters: {
    stateAuth(state){
      return Object.keys(state.userData).length !== 0
    },
    checkAdminPanel() {
      if (!process.env.VUE_APP_SERVER)
        return false

      return Boolean(process.env.VUE_APP_SERVER.match('admin'))
    },
  }
}
