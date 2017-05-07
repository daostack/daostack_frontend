import React, { Component } from 'react'
import { CURRENT_CHAIN } from '../../constants/constants'

export default class WrongChain extends Component {
  render () {
    return (
      <div>
        { this.renderRegularMessage() }
        { this.renderTestRpcMessage() }
      </div>
    )
  }

  renderRegularMessage () {
    if (CURRENT_CHAIN === 'testrpc') { return }
    return (
      <div>
        <h1>Good job connecting to Ethereum!</h1>
        <p>Now all you have to do is switch to the <strong>{ CURRENT_CHAIN }</strong> network and you should be good to go :)</p>
      </div>
    )
  }

  renderTestRpcMessage () {
    if (CURRENT_CHAIN !== 'testrpc') { return }
    return (
      <div>
        <h1>Turn off MetaMask!</h1>
        <p>Or switch it to port 8545 :)</p>
      </div>
    )
  }
}
