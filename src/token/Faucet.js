import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * @title: Faucet
 * This component allows users to claim their initial tokens that match
 * the deposit amount of the event
 * 
 * TODO: Unable to update render on transaction response dynamically
 */

class Faucet extends Component {
    constructor(props, context) {
        super(props);
        this.props = props;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.contracts = context.drizzle.contracts;
        // Get the contract ABI
        // const abi = this.contracts[this.props.contract].abi;
        // This key is then used to look up responses in the context.drizzle.contracts
        // To fire off transactions, the contracts that are included in the props have those functions
        this.issuedKey = this.contracts[this.props.contract].methods.checkIssued.cacheCall(this.props.accounts[0]);
        this.faucetIndex = -1;
    }

    handleSubmit() {
        this.faucetIndex =  this.contracts[this.props.contract].methods[this.props.method].cacheSend({from: this.props.accounts[0]});
    }

    manageRequests(){
        const txKey = this.props.transactionStack[this.faucetIndex];
        if(this.props.transactions[txKey].status === "success"){
            console.log("Old IssuedKey", this.issuedKey)
            this.faucetIndex = -1;
            this.issuedKey = this.contracts[this.props.contract].methods.checkIssued.cacheCall(this.props.accounts[0]);
            console.log("New ISsuedKey", this.issuedKey)
        }
    }
    componentWillMount(){
        if(!this.props.transactionStack[this.faucetIndex] && this.faucetIndex >= 0){
            const txKey = this.props.transactionStack[this.faucetIndex];
            if(this.props.transactions[txKey].status === "success"){
                console.log("Old IssuedKey", this.issuedKey)
                this.faucetIndex = -1;
                this.issuedKey = this.contracts[this.props.contract].methods.checkIssued.cacheCall(this.props.accounts[0]);
                console.log("New ISsuedKey", this.issuedKey)
            }
        }
    }

    render() {
        console.log("Transactions: ",this.props.transactions)
        let issued = -1;
        // Contract is not yet intialized.
        if(!this.props.contracts[this.props.contract].initialized) {
            return (
                <span>Initializing...</span>
            )
        }
        if(this.faucetIndex >= 0){
            console.log("Faucet key added")
            if(!this.props.transactionStack[this.faucetIndex]) {
                return (
                    <span>
                        Claiming tokens...
                    </span>
                )
            }else{
                // this.manageRequests();
                this.forceUpdate();
            }
                
        }
        console.log("Faucet funtioncs", this.props.contracts[this.props.contract].checkIssued)
        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if(!(this.issuedKey in this.props.contracts[this.props.contract].checkIssued)) {
            return (
                <span>Fetching...</span>
            )
        }
        else{
            issued = parseInt(this.props.contracts[this.props.contract].checkIssued[this.issuedKey].value, 10);
             // /* Need to check if issued*/
            if(issued === 0){
                return (
                    <form className="pure-form pure-form-stacked">
                        <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Claim Tokens</button>
                    </form>
                )
            }else if(issued > 0){
                return (
                    <span>Tokens Issued</span>
                )
            } else{
                return (
                    <span>Checking for complimentary tokens</span>
                )
            }
        }
    }
}

Faucet.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        contracts: state.contracts,
        transactions: state.transactions,
        transactionStack : state.transactionStack
    }
}

export default drizzleConnect(Faucet, mapStateToProps)