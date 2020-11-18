<template>
  <div class="coop-boxes">
    <v-card>
      <v-card-title>
        Coop Boxes
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="getCoopBoxes"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
        >
      </v-data-table>
    </v-card>
  </div>
</template>
<script charset="utf-8">
import {mapState, mapActions, mapGetters} from 'vuex'
export default {
  name: 'CoopBoxes',
  data: () => ({
    search: '',
    headers: [
      { text: 'id', value: 'id' },
      { text: 'Name', value: 'name'},
      { text: 'Address', value: 'address' },
      { text: 'Balance', value: 'balance' },
      { text: 'TX Activity', value: 'tx' },
    ]
  }),
  methods: {
    ...mapActions(['loadCoopBoxes'])
  },
  mounted() {
    this.loadCoopBoxes()
  },
  computed: {
    ...mapGetters([
      'getCoopBoxes'
    ]),
    ...mapState([
      'loading'
    ])
  }
}
</script>
