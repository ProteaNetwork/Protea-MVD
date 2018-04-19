import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class RSVP extends Component {
    constructor(props, context) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.balance = -1;
        this.deposit = -1;

        this.props = props;
        this.contractStates = props.contracts;
        this.web3 = context.drizzle.web3;

        
        // Contracts
        this.tokenContract = context.drizzle.contracts[this.props.token];
        this.conferenceContract  = context.drizzle.contracts[this.props.conference];

        this.balanceCheckKey = this.tokenContract.methods.balanceOf.cacheCall(this.props.accounts[0],{from: this.props.accounts[0]});
        this.depositKey = this.conferenceContract.methods.deposit.cacheCall();
        // Fetch initial value from chain and return cache key for reactive updates.
        // Iterate over abi for correct function.
        this.registeredKey = this.conferenceContract.methods.isRegistered.cacheCall(this.props.accounts[0],{from: this.props.accounts[0]});
        this.findTransferAbi();
    }

    findTransferAbi(){
        for(let i in this.tokenContract.abi){
            if(this.tokenContract.abi[i].name === "transfer" && this.tokenContract.abi[i].inputs.length === 3){
                this.transferAbi = this.tokenContract.abi[i];
            }
        }
    }

    handleSubmit(){
        // ERROR: Drizzle not capable of overloaded function, manual call
        console.log("begin", this.transferAbi,  this.conferenceContract._address, 
        this.deposit, 
        this.web3.utils.toHex("0x00aaff"))
        const encodedCall = this.web3.eth.abi.encodeFunctionCall(
            this.transferAbi, [
                this.conferenceContract._address, 
                this.deposit, 
                this.web3.utils.toHex("0x00aaff")
            ]
        )
        console.log("Encoded")
        
        const txData = this.web3.eth.sendTransaction({
            from: this.props.accounts[0],
            gas: 170000,
            to: this.tokenContract._address,
            data: encodedCall,
            value: 0
        })
        console.log("sent")
        
        console.log(txData);
        // this.tokenContract.methods["transfer"].cacheSend([this.conferenceContract._address, this.deposit, this.web3.utils.toHex("0x00aaff")]);
    }

    render() {
        // Contract is not yet intialized.
        if(!this.props.contracts[this.props.token].initialized || !this.props.contracts[this.props.conference].initialized) {
            return (
                <span>Initializing...</span>
            )
        }
        // Check if registered
        if((this.registeredKey in this.props.contracts[this.props.conference].isRegistered)){
            if(this.props.contracts[this.props.conference].isRegistered[this.registeredKey].value){
                return(
                    <span>
                        You have RSVP'd for this event
                    </span>
                )
            }
        }else{
            return (
                <span>
                    Checking if registered...
                </span>
            )
        }
        // Check balance
        if(!(this.balanceCheckKey in this.props.contracts[this.props.token].balanceOf)) {
            return (
                <span>Checking Balance...</span>
            )
        }
        else{
            this.balance = parseInt(this.props.contracts[this.props.token].balanceOf[this.balanceCheckKey].value, 10);

            if(!(this.depositKey in this.props.contracts[this.props.conference].deposit)){
                return(
                    <span>
                        Checking Deposit
                    </span>
                )
            }else{
                this.deposit = parseInt(this.props.contracts[this.props.token].balanceOf[this.balanceCheckKey].value, 10);
                if(this.balance >= this.deposit){
                    return(
                        <form className="pure-form pure-form-stacked">
                            <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>RSVP for Event</button>
                        </form>
                    )
                }else{
                    return(
                        <span>
                            Not enough Protea to RSVP
                        </span>
                    )
                }
            }
        }
    }
}

RSVP.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        contracts: state.contracts
    }
}

export default drizzleConnect(RSVP, mapStateToProps)