<template>
<div>
  <q-dialog persistent v-model="dialog">
    <q-card style="width: 500px; max-width: 100%">
      <div class="text-subtitle1 text-bold">
        Connect wallet to continue
      </div>
      <div>
        <q-btn
          label="Connect wallet"
          icon=""
        />
      </div>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import onboard from './onboard-connect'

export default {
  name: 'wallet-connect',
  computed: {
    ...mapState('wallet', ['wallet'])
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    connectWallet () {
      onboard.connectWallet().then(wallet => {
        if (wallet && wallet.length) {
          this.setWallet(wallet)
        } else {
          this.dialog = true
        }
      })
    }
  },
  mounted () {
    if (!this.wallet.address) {
      setTimeout(() => {
        this.connectWallet()
      }, 5000)
    }
  }
}
</script>

<style scoped>

</style>
