import React, { Component, PropTypes } from 'react'
import EtherscanLink from '../../components/EtherscanLink'

export default class EthBalance extends Component {
  static propTypes = {
    web3: PropTypes.object,
  }

  state = (() => {
    return {
      ethBalance: '',
      ethAddress: this.props.web3.eth.accounts[0],
    }
  })()

  componentWillMount () { this.readBalance() }

  render () {
    const { ethAddress, ethBalance } = this.state
    return (
      <div>
        <EtherscanLink address={ ethAddress } >{ ethBalance } ETH</EtherscanLink>
      </div>
    )
  }

  readBalance = () => {
    const web3 = this.props.web3
    web3.eth.getBalance(this.state.ethAddress, (error, res) => {
      if (error) { return }
      this.setState({ ethBalance: Number(web3.fromWei(res)).toFixed(2) })
    })
    web3.eth.filter({}, () => {
      web3.eth.getBalance(this.state.ethAddress, (error, res) => {
        if (error) { return }
        this.setState({ ethBalance: Number(web3.fromWei(res)).toFixed(2) })
      })
    })
  }
}
