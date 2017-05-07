import React, { Component, PropTypes } from 'react'
import FaucetButton from '../../components/FaucetButton'
import { CURRENT_CHAIN } from '../../constants/constants'

export default class Faucet extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
  }

  state = (() => {
    const { web3 } = this.props.route
    return {
      userAddress: web3.eth.accounts[0],
    }
  })()

  render () {
    const { web3 } = this.props.route
    const { userAddress } = this.state
    return (
      <div>
        <h1>Get some ETH</h1>
        <p>Before you can do anything you need some ETH. It is the only way can pay for the gas to perform transactions on the ethereum blockchain.</p>
        <p>This version of DAOstack is currently running on the <strong>{ CURRENT_CHAIN }</strong> ethereum network. Therefor you need to get some ETH in this network.</p>
        <p>Luckily we have prepared an ETH faucet to give you some.</p>
        <p>We ask only that you take as much as you need :)</p>
        <FaucetButton web3={ web3 } usrAddrss={ userAddress } />
        <br />
        <br />
        <p>If you would like to send back your remaining ETH to the faucet <FaucetButton web3={ web3 } usrAddrss={ userAddress } fillFaucet /></p>
      </div>
    )
  }
}
