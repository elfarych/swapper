export default function () {
  return {
    busdBalance: null,
    usdcBalance: null,
    usdtBalance: null,
    provider: null,
    swapLoading: false,
    wallet: {
      address: null,
      chainId: null,
      balance: null,
      coinName: '',
      btmtBalance: null
    },
    dbWallet: null,

    gameWallet: {
      rawBalance: null,
      balance: null,
      workBalance: null,
      formattedWorkBalance: null
    }
  }
}
