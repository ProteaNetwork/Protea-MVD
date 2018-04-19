import { drizzleConnect } from 'drizzle-react'
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

        // Addresses
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        // Contracts
        this.conferenceContract = context.drizzle.contracts[this.props.conference];
        // Request Key
        this.adminKey = this.conferenceContract.methods.isAdmin.cacheCall(this.props.accounts[0],{from: this.props.accounts[0]});
        this.isEndedKey = this.conferenceContract.methods.ended.cacheCall();

        const abi = this.conferenceContract.abi;
        this.inputs = [];
        var initialState = {};
    
        // Iterate over abi for correct function.
        for (var i = 0; i < abi.length; i++) {
            if (abi[i].name === "attend") {
                this.inputs = abi[i].inputs;
    
                for (var i = 0; i < this.inputs.length; i++) {
                    initialState[this.inputs[i].name] = '';
                }
    
                break;
            }
        }
        this.state = initialState;

        // Drizzle cant send address arrays
        this.web3 = context.drizzle.web3;
        this.findTransferAbi();
         
    }


    EndEvent(){
      this.conferenceContract.methods.payback.cacheSend();
    }

    CancelEvent(){
        this.conferenceContract.methods.cancel.cacheSend();

    }

    handleSubmit() {
        const list = this.state._addresses.split(',');
        const encodedCall = this.web3.eth.abi.encodeFunctionCall(
            this.transferAbi, [
                list
            ]
        )
        this.web3.eth.sendTransaction({
            from: this.props.accounts[0],
            to: this.conferenceContract._address,
            data: encodedCall,
            value: 0
        })
    }
    
    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    findTransferAbi(){
        for(let i in this.conferenceContract.abi){
            if(this.conferenceContract.abi[i].name === "attend"){
                this.transferAbi = this.conferenceContract.abi[i];
            }
        }
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
                <form>
                    <input key="_addresses" type="text" name="_addresses" value={this.state["_addresses"]} placeholder="Addresses" onChange={this.handleInputChange} /> 
                    <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Submit</button>
                </form>
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