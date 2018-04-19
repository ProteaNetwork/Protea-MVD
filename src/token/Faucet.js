import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class Faucet extends Component {
    constructor(props, context) {
        super(props);
        this.props = props;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.contracts = context.drizzle.contracts;
        // Get the contract ABI
        const abi = this.contracts[this.props.contract].abi;

        this.balanceKey = this.contracts[this.props.contract].methods.balanceOf.cacheCall(this.props.accounts[0]);
        this.faucetKey = -1;
        // Fetch initial value from chain and return cache key for reactive updates.
        // Iterate over abi for correct function.
        for (var i = 0; i < abi.length; i++) {
            if (abi[i].name === this.props.method) {
                this.fnABI = abi[i]

                break
            }
        }
    }

    handleSubmit() {
        this.faucetKey =  this.contracts[this.props.contract].methods[this.props.method].cacheSend({from: this.props.accounts[0]});
    }

    render() {
        let balance = -1;
        // Contract is not yet intialized.
        if(!this.props.contracts[this.props.contract].initialized) {
            return (
                <span>Initializing...</span>
            )
        }
        if(this.faucetKey >= 0){
            if(!this.props.transactionStack[this.faucetKey]) {
                return (
                    <span>
                        Claiming tokens...
                    </span>
                )
            }else{
                const txKey = this.props.transactionStack[this.faucetKey];
                if(this.props.transactions[txKey].status === "success"){

                    this.faucetKey = -1;
                    this.balanceKey = this.contracts[this.props.contract].methods.balanceOf.cacheCall(this.props.accounts[0]);
                }
                
            }        
        }
        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if(!(this.balanceKey in this.props.contracts[this.props.contract].balanceOf)) {
            return (
                <span>Fetching...</span>
            )
        }
        else{
            balance = parseInt(this.props.contracts[this.props.contract].balanceOf[this.balanceKey].value, 10);
             // /* Need to check if issued*/
            if(balance === 0){
                return (
                    <form className="pure-form pure-form-stacked">
                        <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Claim Tokens</button>
                    </form>
                )
            }else if(balance > 0){
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