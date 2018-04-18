import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../logo.png'
import  Faucet  from '../../token/Faucet.js';
import ConferenceStatus from '../../token-conference/ConferenceStatus';

class Home extends Component {
  constructor(props, context){
    super(props);
     
  }
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Protea MVP</h1>
            <p>An ERC223 token with a simple faucet facility that interacts with a<br />
            Token version of Mokoto's BlockParty</p>

            <br/><br/>
          </div>
        
          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
            Protea Balance: <ContractData contract="ERC223StandardToken"  method="balanceOf" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]} />
            <br/><br/>
          </div>
          <div className="pure-u-1-1">
            <h2>Claim complimentary tokens</h2>
            <Faucet contract="ERC223StandardToken" method="faucet" />
            <br/><br/>
          </div>
          <div className="pure-u-1-1">
            <h2>RSVP for event</h2>
              User is Admin: <ConferenceStatus contract="TokenConference"  method="isAdmin" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]} />
               <br />
              User Registered: <ConferenceStatus contract="TokenConference"  method="isRegistered" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]} />

              <br/>
              <ContractForm contract="ERC223StandardToken" method="transfer" labels={['To Address', 'Amount to Send', 'Arb data']} />
            <br/><br/>
          </div>
        </div>
      </main>
    )
  }
}

export default Home


// <div className="pure-u-1-1">
// <h2>SimpleStorage</h2>
// <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
// <p><strong>Stored Value</strong>: <ContractData contract="SimpleStorage" method="storedData" /></p>
// <ContractForm contract="SimpleStorage" method="set" />

// <br/><br/>
// </div>

// <div className="pure-u-1-1">
// <h2>TutorialToken</h2>
// <p>Here we have a form with custom, friendly labels. Also note the token symbol will not display a loading indicator. We've suppressed it with the <code>hideIndicator</code> prop because we know this variable is constant.</p>
// <p><strong>Total Supply</strong>: <ContractData contract="TutorialToken" method="totalSupply" methodArgs={[{from: this.props.accounts[0]}]} /> <ContractData contract="TutorialToken" method="symbol" hideIndicator /></p>
// <p><strong>My Balance</strong>: <ContractData contract="TutorialToken" method="balanceOf" methodArgs={[this.props.accounts[0]]} /></p>
// <h3>Send Tokens</h3>
// <ContractForm contract="TutorialToken" method="transfer" labels={['To Address', 'Amount to Send']} />
// <br/><br/>
// </div>
// <div className="pure-u-1-1">
// <h2>ComplexStorage</h2>
// <p>Finally this contract shows data types with additional considerations. Note in the code the strings below are converted from bytes to UTF-8 strings and the device data struct is iterated as a list.</p>
// <p><strong>String 1</strong>: <ContractData contract="ComplexStorage" method="string1" toUtf8 /></p>
// <p><strong>String 2</strong>: <ContractData contract="ComplexStorage" method="string2" toUtf8 /></p>
// <strong>Single Device Data</strong>: <ContractData contract="ComplexStorage" method="singleDD" />
// <br/><br/>
// </div>
// </div>
// </main>
// )
// }
// }