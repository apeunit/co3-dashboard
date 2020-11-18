<template>
  <div class="settings">
    <h1>Settings</h1>
    <h1>{{$route.query.access_token}}</h1>
  </div>
</template>

<script>
// @ is an alias to /src

import {mapMutations} from 'vuex'
export default {
  name: 'Settings',
  methods: {
    ...mapMutations({
      setAuthToken: 'SET_AUTH_TOKEN'
    })
  },
  mounted() {
    if('access_token' in this.$route.query) {
      this.setAuthToken(this.$route.query.access_token)
      this.$router.replace({name: 'Home'})
    } else {
      // TODO: Better handeling?
      alert('Error: "access_token" missing in query parameter.')
    }
  }
}
</script>
