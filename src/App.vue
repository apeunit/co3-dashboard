<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

      <div class="d-flex align-center">
        <v-btn
          text
          to='/'
        >
          <span class="mr-2">Home</span>
        </v-btn>
        <v-btn
          text
          to='/about'
        >
          <span class="mr-2">About</span>
        </v-btn>

      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
