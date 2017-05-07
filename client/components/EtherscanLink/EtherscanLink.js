import React, { Component, PropTypes } from 'react'
import { CURRENT_CHAIN } from '../../constants/constants'

export default class EtherscanLink extends Component {
  static propTypes = {
    address: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.string,
  }

  render () {
    const { address, type, children } = this.props
    if (type === 'tx') {
      return (
        <a href={ `https://${CURRENT_CHAIN}.etherscan.io/tx/${address}` } target='_blank'>{ children }</a>
      )
    } else {
      return (
        <a href={ `https://${CURRENT_CHAIN}.etherscan.io/address/${address}` } target='_blank'>{ children }</a>
      )
    }
  }
}
