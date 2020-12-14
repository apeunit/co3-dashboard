<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
     {{ PROJECT_NAME }}
      <v-spacer></v-spacer>
      <div v-if="supply ">
        Total Supply:
        {{ supply }}
        {{ TOKEN_SYMBOL }}
      </div>
    </v-app-bar>

    <v-main>
      <v-tabs
        v-model="tabs"
        color="primary"
        dark
        >
        <v-tab to="/">Home</v-tab>
        <v-tab to="/beneficiaries">Beneficiaries</v-tab>
        <v-tab to="/merchants">Merchants</v-tab>
        <v-tab to="/coop-boxes">Coop Boxes</v-tab>
        <!--<v-tab to="/admins">Admins</v-tab>-->
      </v-tabs>
      <section class="container pa-4 pa-sm-6 pa-md-8 container--fluid" style="transform-origin: center top 0px;">
      <router-view/>
      </section>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState} from 'vuex'
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    tabs: null
  }),
  computed: {
    ...mapState([
      'PROJECT_NAME',
      'TOKEN_SYMBOL',
      'loading',
      'supply'
    ])
  },
  methods: {
    ...mapActions([
      'loadProfile',
      'loadSupply'
    ])
  },
  mounted() {
    this.loadProfile()
      .then(e=>console.log(e))
      .catch(e=>console.log(e))
    this.loadSupply()
      .then(e=>console.log(e))
      .catch(e=>console.log(e))
  }
};
</script>
