import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const PROJECT_NAME           = process.env.VUE_APP_PROJECT_NAME
const TOKEN_SYMBOL           = process.env.VUE_APP_TOKEN_SYMBOL
const CO3UUM_URL             = process.env.VUE_APP_CO3UUM_URL
const SSO_LOGIN_URL          = process.env.VUE_APP_SSO_LOGIN_URL
const LISTENER_URL           = process.env.VUE_APP_LISTENER_URL
const LISTENER_POLL_INTERVAL = process.env.VUE_APP_LISTENER_POLL_INTERVAL
const NODE                   = process.env.VUE_APP_NODE
const WALLET_URL             = process.env.VUE_APP_WALLET_UR
const AUTH_TOKEN_COOKIE_NAME = process.env.VUE_APP_AUTH_TOKEN_COOKIE_NAME

// Get Transaction History List
const TRANSFER_NOTIFY_QUERY = gql`
  query transferQuery($senderPk: String!, $tokenSymbol: String!, $executedOn: Date!) {
    transferNotificationMany(
      filter: {
        OR: [{ receiver_pk: $senderPk }, { sender_pk: $senderPk }],
        token_symbol: $tokenSymbol,
        executed_on: $executedOn
      }
    ) {
      _id
      receiver_pk
      token_symbol
      executed_on
      amount
      sender_pk
      purpose
      contractAddress
      owner
      decimals
    }
  }
`
// Get Tokens List of specific ethAddress (wallet owner)
const BALANCE_NOTIFY_QUERY = gql`
  query balanceNotificationMany($accountPk: String, $tokenSymbol: String) {
    balanceNotificationMany(filter: { account_pk: $accountPk, token_symbol: $tokenSymbol }) {
        _id
        name
        token_symbol
        computed_at
        amount
        purpose
        logoURL
        decimals
        contractAddress
        owner
    }
  }
`
// Get Token Supply
const BALANCE_ALL_QUERY = gql`
  query balanceNotifyQuery($token: String!) {
    balanceNotificationMany(filter: { token_symbol: $token }) {
        _id
        computed_at
        amount
        logoURL
        purpose
        contractAddress
        owner
    }
  }
`
export default new Vuex.Store({
  state: {
    PROJECT_NAME           : PROJECT_NAME,
    WALLET_URL             : WALLET_URL,
    TOKEN_SYMBOL           : TOKEN_SYMBOL,
    CO3UUM_URL             : CO3UUM_URL,
    SSO_LOGIN_URL          : SSO_LOGIN_URL,
    LISTENER_URL           : LISTENER_URL,
    LISTENER_POLL_INTERVAL : LISTENER_POLL_INTERVAL,
    NODE                   : NODE,
    profile                : {},
    merchants              : [],
    coopBoxes              : [],
    admins                 : [],
    beneficiaries          : [],
    authToken              : Cookies.get(AUTH_TOKEN_COOKIE_NAME),
    isAuthenticated        : false,
    login                  : null,
    loading                : false,
    supply                 : null
  },
  getters: {
    getBeneficiaries: state => state.beneficiaries,
    getMerchants: state => state.merchants,
    getAdmins: state => state.admins,
    getCoopBoxes: state => state.coopBoxes,
  },
  mutations: {
    SET_BENEFICIARIES (state, beneficiaries) {
      state.beneficiaries = beneficiaries
    },
    SET_ADMINS (state, admins) {
      state.admins = admins
    },
    SET_MERCHANTS (state, merchants) {
      state.merchants = merchants
    },
    SET_COOP_BOXES (state, coopBoxes) {
      state.coopBoxes = coopBoxes
    },
    SET_LOADING (state, loading) {
      state.loading = loading
    },
    SET_PROFILE (state, profile) {
      state.isAuthenticated = true
      state.profile = profile
    },
    SET_AUTH_TOKEN (state, token) {
      state.authToken = token
      Cookies.set(AUTH_TOKEN_COOKIE_NAME, token, {
        sameSite: 'strict',
        expires: 7 })
    },
    REMOVE_AUTH_TOKEN (state) {
      Vue.set(state, 'authToken', null)
      state.isAuthenticated = false
      Cookies.remove(AUTH_TOKEN_COOKIE_NAME)
    },
    REMOVE_PROFILE (state) {
      Vue.set(state, 'profile', {})
    },
    SET_ADDRESS (state, payload) {
      const {id, role, address} = payload
      const i = state.beneficiaries.findIndex((e) => e.id === id)
      Vue.set(state[role][i], 'address', address)
    },
    SET_TX (state, payload) {
      const {tx, role, address} = payload
      const i = state.beneficiaries.findIndex((e) => e.address === address)
      Vue.set(state[role][i], 'tx', tx)
    },
    SET_BALANCE (state, payload) {
      const {balance, role, address} = payload
      const i = state.beneficiaries.findIndex((e) => e.address === address)
      Vue.set(state[role][i], 'balance', balance)
    },
    SET_SUPPLY (state, supply) {
      state.supply = supply
    }
  },
  actions: {
    loadSupply({commit}) {
      Vue.apollo
      .query({
        query: BALANCE_ALL_QUERY ,
        variables: {
          token: TOKEN_SYMBOL
        },
      })
      .then(r => r.data.balanceNotificationMany)
      .then(r => {
        const sum = r
          .map(e => e.amount)
          .reduce((acc, curr) => acc+curr, 0)
        commit('SET_SUPPLY', sum)
      })
    },
    async loadMembers({state}, role) {
      return new Promise((resolve, reject) => {
        Vue.axios
          .get(`/api/1/member?access_token=${state.authToken}&role=${role}`)
          .then(r => r.data.result)
          .then(members => {
            resolve(members)
          })
          .catch(e => reject(e))
      })
    },
    loadBeneficiaries({dispatch, commit}) {
      commit('SET_LOADING', true)
      dispatch('loadMembers', 'beneficiary')
      .then(beneficiaries => {
        commit('SET_BENEFICIARIES', beneficiaries)
        commit('SET_LOADING', false)
        const ids = beneficiaries.map(b => b.id)
        ids.forEach(id => {dispatch('loadAddress', {role:'beneficiaries', id:id})})
      })
    },
    loadMerchants({dispatch, commit}) {
      //commit('SET_LOADING', true)
      dispatch('loadMembers', 'merchant')
      .then(merchants => {
        commit('SET_MERCHANTS', merchants)
        //commit('SET_LOADING', false)
        const ids = merchants.map(b => b.id)
        ids.forEach(id => {dispatch('loadAddress', {role:'merchants', id:id})})
      })
    },
    loadAdmins({dispatch, commit}) {
      commit('SET_LOADING', true)
      dispatch('loadMembers', 'administrator')
      .then(admins => {
        commit('SET_ADMINS', admins)
        commit('SET_LOADING', false)
        const ids = admins.map(b => b.id)
        ids.forEach(id => {dispatch('loadAddress', {role:'admins', id:id})})
      })
      .catch(e => console.log(e))
      .then(() => {
        commit('SET_LOADING', false)
      })
    },
    loadCoopBoxes({dispatch, commit}) {
      commit('SET_LOADING', true)
      dispatch('loadMembers', 'coop-box')
      .then(boxes => {
        commit('SET_COOP_BOXES', boxes)
        commit('SET_LOADING', false)
        const ids = boxes.map(b => b.id)
        ids.forEach(id => {dispatch('loadAddress', {role:'coopBoxes', id:id})})
      })
    },
    async loadProfile({commit, state}) {
      commit('SET_LOADING', true)
      return new Promise((resolve, reject) => {
        Vue.axios
        .get(`/api/1/profile?access_token=${state.authToken}`)
        .then(r => r.data.result)
        .catch(e => {
          reject(e)
        })
        .then(result => {
          if(result) commit('SET_PROFILE', result)
          commit('SET_LOADING', false)
          resolve()
        })

      })
    },
    loadAddress({dispatch, commit, state}, payload) {
      commit('SET_LOADING', true)
      const {role, id} = payload
      Vue.axios
      .get(`/api/1/profile?access_token=${state.authToken}&member_id=${id}`)
      .then(r => r.data.result)
      .then(result => {
        const key = "blockchain_public_key"
        if(key in result) {
          const address = result[key]
          commit('SET_ADDRESS', { role: role, id: id, address: address})
          dispatch('loadBalance', {role:role, address: address})
          dispatch('loadTransactions', {role:role,  address:address})
        }
      })
      .catch(e => console.log(e))
      .then(() => {
        commit('SET_LOADING', false)
      })
    },
    loadBalance({commit}, payload) {
      commit('SET_LOADING', true)
      const {role, address} = payload
      Vue.apollo
      .query({
        query: BALANCE_NOTIFY_QUERY ,
        variables: {
          accountPk: address,
          tokenSymbol: TOKEN_SYMBOL
        },
      })
      .then(result => result.data.balanceNotificationMany)
      .then(result => {
        const balance = result
          .map(e => e.amount)
          .reduce((acc, curr) => acc+curr, 0)
        commit('SET_BALANCE', { role: role, address: address, balance: balance})
        commit('SET_LOADING', false)
      })
      .catch(e => console.log(e))
      .then(() => {
        commit('SET_LOADING', false)
      })
    },
    loadTransactions({commit}, payload) {
      // TODO: at the moment the date filter is using today
      // maybe we should make a better range?
      console.log("loadTransactions")
      commit('SET_LOADING', true)
      const {role, address} = payload
      Vue.apollo
      .query({
        query: TRANSFER_NOTIFY_QUERY,
        variables: {
          senderPk: address,
          tokenSymbol: TOKEN_SYMBOL,
          executedOn: new Date()
        },
      })
      .then(result => result.data.transferNotificationMany)
      .then(result => {
        const tx = result.length
        commit('SET_TX', { role: role, address: address, tx: tx})
        commit('SET_LOADING', false)
      })
    },
    login() {
      window.location.assign(SSO_LOGIN_URL)
    },
    logout({commit}) {
      commit('REMOVE_AUTH_TOKEN')
      commit('REMOVE_PROFILE')
    },
  }
})
