<template>
  <div class="beneficiaries">
    <v-card>
      <v-card-title>
        Beneficiaries
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
        :items="getBeneficiaries"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
        >
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.address"
            small
            @click="topup(item)"
            >Top Up</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-card
      class="d-flex justify-center my-6"
      color="grey lighten-2"
    >
    <v-card
     class='my-6 mx-12 py-1 px-3'
      max-width="450"
    >
      <v-text-field
        :label="`Top up amount (${ TOKEN_SYMBOL })`"
        placeholder="amount"
        :rules="rules"
        clearable
        v-model="topupAmount"
      >
      </v-text-field>
    </v-card>
    </v-card>
    <v-dialog
      v-model="qrdialog"
      max-width="380"
    >
      <v-card>
        <v-card-title class="headline">
          Top Up
        </v-card-title>
        <v-card-text>
          Scan this code with the wallet to
          send <strong>{{topupAmount}} {{TOKEN_SYMBOL}}</strong>
          to <code>{{topupRecepient}}</code>
        </v-card-text>
        <v-card-text>
          <img :src="qrCode" alt="QRCode" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="qrdialog = false"
            >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script charset="utf-8">
import QRious from 'qrious'
import {mapState, mapActions, mapGetters} from 'vuex'
export default {
  name: 'Beneficiaries',
  data: () => ({
    qrdialog: false,
    search: "",
    currItem: null,
    topupAmount: 1,
    topupRecepient: null,
    rules: [
      value => !!value || 'Required.',
      value => !isNaN(+value) || 'Must be a number.',
      value => +value > 0 || 'Must be positive.',
    ],
    headers: [
      { text: 'id', value: 'id' },
      {
        text: 'Name',
        value: 'name',
      },
      { text: 'Address', value: 'address' },
      { text: 'Balance', value: 'balance' },
      { text: 'TX Activity', value: 'tx' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]
  }),
  methods: {
    topup(item) {
      if(!isNaN(+this.topupAmount) && this.topupAmount > 0) {
        this.topupRecepient = item.address
        this.qrdialog = true
        this.currItem = item
      } else {
        alert('Please enter a positive number in the "top up" input field below.')
      }
    },
    ...mapActions(['loadBeneficiaries'])
  },
  mounted() {
    this.loadBeneficiaries()
  },
  computed: {
    qrCode() {
      // This implements
      // https://hackmd.io/lYwbDvRlTyScdoEFQ9mDeg?view#2-Executing-a-transaction
      //
      // EIP 681 would have been a better option.
      // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-681.md
      // const link = `ethereum:${this.TOKEN_CONTRACT}/transfer?address=${this.topupRecepient}&uint256=${this.topupAmount}`

      const link = `${this.WALLET_URL}/tx?to=${this.topupRecepient}&token=${this.TOKEN_SYMBOL}&amount=${this.topupAmount}`
      const q = new QRious({
        size: 330,
        value: link
      })
      return q.toDataURL()
    },
    ...mapGetters([
      'getBeneficiaries'
    ]),
    ...mapState([
      'WALLET_URL',
      'TOKEN_SYMBOL',
      'loading'
    ],
)
  }
}
</script>
