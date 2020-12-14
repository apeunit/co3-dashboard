<template>
  <div class="home">
      <h1>Dashboard</h1>
      <div v-if="isAuthenticated">
        <p>
          You are logged in as:
          <strong>{{ profile.blockchain_public_key}}</strong>
        </p>
        <v-btn @click='logout'>Logout</v-btn>
      </div>
      <div v-else>
        <p>
          You are not logged in or your session expired.
          Please log in.
        </p>
        <v-btn @click='login'>Login</v-btn>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src

import {mapMutations, mapActions, mapState} from 'vuex'
export default {
  name: 'Home',
  components: {
  },
  computed: {
    ...mapState(['isAuthenticated']),
    ...mapState(['profile'])
  },
  methods: {
    ...mapActions([
      'login',
      'logout'
    ]),
    ...mapMutations({
      setAuthToken: 'SET_AUTH_TOKEN'
    })
  },
  mounted() {
    if('access_token' in this.$route.query) {
      this.setAuthToken(this.$route.query.access_token)
    }
    // else {
    // TODO: Better handeling of
    // }
  }
}
</script>
