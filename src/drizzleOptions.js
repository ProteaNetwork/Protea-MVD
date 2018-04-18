import TokenConference from './../build/contracts/TokenConference.json'
import ERC223StandardToken from './../build/contracts/ERC223StandardToken.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545'
    }
  },
  contracts: [
    TokenConference,
    ERC223StandardToken
  ],
  events: {
    ERC223StandardToken: ['Approval','TokensIssued','Transfer'],
    TokenConference: ['RegisterEvent','AttendEvent','PaybackEvent',
    'WithdrawEvent','CancelEvent','ClearEvent']  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions