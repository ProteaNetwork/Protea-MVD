import React, { Component } from 'react'
import { AccountData, ContractData } from 'drizzle-react-components'
import logo from '../../logo.png'
import  Faucet  from '../../token/Faucet.js';
import ConferenceStatus from '../../token-conference/ConferenceStatus';
import RSVP from '../../token-conference/RSVP';
import AdminControls from '../../token-conference/AdminControls';

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
               <br />
              User Registered: <ConferenceStatus contract="TokenConference"  method="isRegistered" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]} />
              <br/>
              <br/>
              <RSVP token="ERC223StandardToken" conference="TokenConference" />
              <br/>

            <br/><br/>
          </div>
          <div className="pure-u-1-1">
            <h2>
              Admin Controls
            </h2>
              User is Admin: <ConferenceStatus contract="TokenConference"  method="isAdmin" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]} />
              <br />
              <br />
              <AdminControls conference="TokenConference" />
          </div>
        </div>
      </main>
    )
  }
}

export default Home