<template>
<div>
  <q-dialog persistent v-model="dialog">
    <q-card style="width: 700px; max-width: 100%">
      <q-toolbar class="justify-end">
        <q-btn icon-right="close" v-close-popup dense flat color="primary"/>
      </q-toolbar>

      <q-card-section>

      </q-card-section>
    </q-card>

  </q-dialog>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app-dialog',
  computed: {
    ...mapState('wallet', ['wallet']),
    address () {
      return this.wallet.address
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  watch: {
    address (val) {
      if (val) {
        setTimeout(() => {
          this.dialog = true
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>

</style>
