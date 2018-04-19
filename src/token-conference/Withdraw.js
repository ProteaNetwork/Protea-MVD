import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * @title: Withdraw component
 * Allows registered users to withdraw their funds after the event has ended or canceled
 * 
 * TODO: Update component on on RPC response still not functioning dynamically
 */

class Withdraw extends Component {
    constructor(props, context) {
        super(props);
        this.props = props;

        // Addresses
        this.handleSubmit = this.handleSubmit.bind(this);
        
        // Contracts
        this.conferenceContract = context.drizzle.contracts[this.props.conference];
        // Request Key
        this.isEndedKey = this.conferenceContract.methods.ended.cacheCall();
        this.isRegisteredKey = this.conferenceContract.methods.isRegistered.cacheCall(this.props.accounts[0],{from: this.props.accounts[0]});
        this.isPaidKey = this.conferenceContract.methods.isPaid.cacheCall(this.props.accounts[0]);

    
    }

    handleSubmit() {
        this.conferenceContract.methods.withdraw.cacheSend();
    }

    render() {
        // Contract is not yet intialized.
        if(!this.props.contracts[this.props.conference].initialized) {
            return (
                <span>Initializing...</span>
            )
        }

        // Check if event active
        if(!(this.isEndedKey in this.props.contracts[this.props.conference].ended)){
           
            return (
                <span>
                    Checking if event is active...
                </span>
            )
        }else if(!this.props.contracts[this.props.conference].ended[this.isEndedKey].value){
            return(
                <span>
                    This event is still active
                </span>
            )
        }

        // Check if registered active
        if(!(this.isRegisteredKey in this.props.contracts[this.props.conference].isRegistered)){
            return (
                <span>
                    Checking if user is registered...
                </span>
            )
        }else if(!this.props.contracts[this.props.conference].isRegistered[this.isRegisteredKey].value){
            return(
                <span>
                    User not registered
                </span>
            )
        }


        // Check if user has been paid
        if(!(this.isPaidKey in this.props.contracts[this.props.conference].isPaid)){
            return (
                <span>
                    Checking if user paid...
                </span>
            )
        }else if(this.props.contracts[this.props.conference].isPaid[this.isPaidKey].value){
            return(
                <span>
                    User has been paid
                </span>
            )
        }
        console.log(this.props.contracts[this.props.conference].isPaid[this.isPaidKey].value)
        return (
            <div className="pure-form pure-form-stacked">
                <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Withdraw Stake</button>
            </div>
           
        )
    }
}

Withdraw.contextTypes = {
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

export default drizzleConnect(Withdraw, mapStateToProps)