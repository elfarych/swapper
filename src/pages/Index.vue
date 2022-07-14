<template>
  <q-page class="">
    <iframe src="https://www.caduceus.foundation/" :width="iframeStyle.width" :height="iframeStyle.height">
    </iframe>
    <app-dialog />
    <wallet-connect />
  </q-page>
</template>

<script>
import AppDialog from 'components/app-dialog'
import WalletConnect from 'components/wallet/wallet-connect'
export default {
  name: 'PageIndex',
  components: { WalletConnect, AppDialog },
  computed: {
    iframeStyle () {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
}
</script>
