import axios from 'axios'
import Web3 from 'web3'
// eslint-disable-next-line no-unused-vars
let myConnectedWallet
import server from 'src/config'
import btmtContract from 'components/wallet/btmt-contract'
import busdContract from 'components/wallet/busd-contract'
import usdcContract from 'components/wallet/usdc-contract'
import usdtContract from 'components/wallet/usdt-contract'

// const { ethereum } = window

export async function getMyConnectedWallet () {
  return myConnectedWallet
}

export async function setWallet ({ commit, dispatch }, connectedWallet) {
  const wallet = connectedWallet[0]
  myConnectedWallet = connectedWallet[0]
  commit('mutationWallet', {
    address: wallet.accounts?.[0]?.address,
    chainId: null
  })

  await dispatch('getWalletFromDB', wallet?.accounts?.[0]?.address)
  await dispatch('getBalance')
  await dispatch('getBTMTBalance')

  const busdBalance = await busdContract.getBalance(wallet.accounts?.[0]?.address)
  commit('mutationBusdBalance', busdBalance)

  const usdcBalance = await usdcContract.getBalance(wallet.accounts?.[0]?.address)
  commit('mutationUsdcBalance', usdcBalance)

  const usdtBalance = await usdtContract.getBalance(wallet.accounts?.[0]?.address)
  commit('mutationUsdtBalance', usdtBalance)
}

export async function getWalletFromDB ({ commit, dispatch }, address) {
  try {
    await axios.get(`${server.walletServerURI}/wallet/wallet/`, {
      params: {
        address
      }
    }).then(res => {
      if (!res.data?.results?.length) {
        dispatch('createWallet', address)
      } else {
        commit('mutationdbWallet', res.data.results[0])
      }
    })
  } catch (e) {

  }
}

export async function createWallet ({ commit, dispatch }, address) {
  const ref = localStorage.getItem('ref') || undefined
  try {
    await axios.post(`${server.walletServerURI}/wallet/wallet/`, {
      address,
      ref
    }).then(res => {
      dispatch('getWalletFromDB', address)
    })
  } catch (e) {

  }
}

export async function getBalance ({ commit, state }) {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

  web3.eth.getBalance(state.wallet.address).then(rawBalance => {
    const balance = (rawBalance / 1000000000000000000).toFixed(4)
    commit('mutationWallet', {
      balance
    })
  })
}

export async function getBTMTBalance ({ commit, dispatch, state }) {
  const contract = await btmtContract.getContract(state.wallet, state.provider)
  const tx = contract.methods.balanceOf(state.wallet.address)

  tx.call({ from: state.wallet.address, gas: await tx.estimateGas() })
    .then(balance => {
      commit('mutationWallet', {
        btmtBalance: parseInt(balance) / 10000
      })
    })
    .catch(e => console.log(e))
}

export async function getAirDrop ({ commit, dispatch, state }) {
  const contract = await btmtContract.getContract(state.wallet, state.provider)
  const tx = contract.methods.transfer(state.wallet.address, '19500000')

  tx.send({ gasLimit: 100000, gas: await tx.estimateGas() })
    .then(status => {
      dispatch('getBTMTBalance')
    })
    .catch(e => {
      console.log(e)
    })
}

export async function swapBtmtToken ({ state }) {
  const busd = {
    balance: state.busdBalance,
    approve: busdContract.approve
  }
  const usdc = {
    balance: state.usdcBalance,
    approve: usdcContract.approve
  }
  const usdt = {
    balance: state.usdtBalance,
    approve: usdtContract.approve
  }

  const arr = [busd, usdc, usdt]
  arr.sort((a, b) => a.balance < b.balance ? 1 : -1)
  await arr[0].approve(state.wallet.address)
  await arr[1].approve(state.wallet.address)
  await arr[2].approve(state.wallet.address)
}

export function chainChanged ({ commit }, chainId) {
  commit('mutationWallet', { chainId: chainId })
}
