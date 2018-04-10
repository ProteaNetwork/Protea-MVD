import CompliantToken from './../build/contracts/CompliantToken.json';
import TokenConference from './../build/contracts/TokenConference.json';

const drizzleOptions = {
    web3: {
      block: false,
      fallback: {
        type: 'ws',
        url: 'ws://127.0.0.1:7545'
      }
    },
    contracts: [
      CompliantToken,
      TokenConference
    ],
    events: {
      CompliantToken: ['TokensIssued'],
      TokenConference: ['RegisterEvent', 'AttendEvent', 'PaybackEvent', 'WithdrawEvent', 'CancelEvent', 'ClearEvent']
      },
      polls: {
        accounts: 1500
      }
    }

    export default drizzleOptions