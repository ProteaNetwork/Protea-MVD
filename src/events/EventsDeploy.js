import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Managing the deployment of Events
 */

class EventDeploy extends Component {
  constructor(props, context) {
    super(props);

  }


  render() {
    // No accounts found.
    if(Object.keys(this.props.accounts).length === 0) {
      return (
        <span>Initializing...</span>
      )
    }

  
    return(
      <div>
      </div>
    )
  }
}

EventDeploy.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    accountBalances: state.accountBalances    
  }
}

export default drizzleConnect(EventDeploy, mapStateToProps)