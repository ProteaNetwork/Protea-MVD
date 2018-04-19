import { drizzleConnect } from 'drizzle-react'
import { ContractForm } from 'drizzle-react-components'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * @title: Admin component
 * Allows Admin's to end or cancel event
 * 
 * TODO: Update component on on RPC response still not functioning dynamically
 */

class AdminControls extends Component {
    constructor(props, context) {
        super(props);
        this.endEvent = this.EndEvent.bind(this);
        this.cancelEvent = this.CancelEvent.bind(this);

        this.balance = -1;

        this.props = props;

        
        // Contracts
        this.conferenceContract = context.drizzle.contracts[this.props.conference];

        // Request Key
        this.adminKey = this.conferenceContract.methods.isAdmin.cacheCall(this.props.accounts[0],{from: this.props.accounts[0]});
        console.log(this.conferenceContract.methods);
        this.isEndedKey = this.conferenceContract.methods.ended.cacheCall();
    }


    EndEvent(){
      
    }

    CancelEvent(){

    }

    render() {
        // Contract is not yet intialized.
        if(!this.props.contracts[this.props.conference].initialized) {
            return (
                <span>Initializing...</span>
            )
        }
        // Check if registered
        if(!(this.adminKey in this.props.contracts[this.props.conference].isAdmin)){
            return (
                <span>
                    Checking if admin...
                </span>
            )
        }else if(!this.props.contracts[this.props.conference].isAdmin[this.adminKey].value){
            return(
                <span>
                    You are not an admin of this event
                </span>
            )
        }

        // Check if event active
        if(!(this.isEndedKey in this.props.contracts[this.props.conference].ended)){
           
            return (
                <span>
                    Checking if event is active...
                </span>
            )
        }else if(this.props.contracts[this.props.conference].ended[this.isEndedKey].value){
            return(
                <span>
                    This event has ended
                </span>
            )
        }
        return (
            <div className="pure-form pure-form-stacked">
                <button key="endEvent" className="pure-button" type="button" onClick={this.endEvent}>End Event</button>
                <br />
                <br />
                <button key="cancelEvent" className="pure-button" type="button" onClick={this.cancelEvent}>Cancel Event</button>
                <br />
                <br />
                <span>
                    Register Attendees
                </span>
                <div>
                    <ContractForm contract="TokenConference" method="attend" labels={["Addresses"]}/>
                </div>
            </div>
           
        )
    }
}

AdminControls.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        contracts: state.contracts,
    }
}

export default drizzleConnect(AdminControls, mapStateToProps)