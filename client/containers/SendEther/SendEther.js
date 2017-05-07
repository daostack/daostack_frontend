import React, { Component, PropTypes } from 'react'

export default class SendEther extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    return {
      defAddrss: myDefAddrss,
      recAddrss: '0xebDb3dF0219880286426500DB835Ff36Bb619033',
      amount: '',
    }
  })()

  render () {
    const { connected, amount, defAddrss, recAddrss, TXaddrss, TXstatus } = this.state
    return (
      <div>
        <h1>Send Ether</h1>
        <h3>Send</h3>
        <div>Default address: { defAddrss ? this.renderEtherscanLink(defAddrss, 'addrss') : '' }</div>
        <div>Reciver address: </div>
        <input value={ recAddrss } onChange={ this.onRecChange } placeholder='enter reciever address' />
        <div>Amount:</div><input value={ amount } onChange={ this.onAmountChange } placeholder='enter amount to send' />
        <button onClick={ this.sendEth }>Send</button>
        <div>{ TXstatus }</div>
        <div>{ TXaddrss }</div>
      </div>
    )
  }

  renderEtherscanLink (address, type) {
    if (type === 'tx') {
      return (
        <a href={ `https://testnet.etherscan.io/tx/${address}` } target='_blank'> { address }</a>
      )
    } else {
      return (
        <a href={ `https://testnet.etherscan.io/address/${address}` } target='_blank'> { address }</a>
      )
    }
  }

  sendEth = () => {
    const { defAddrss, recAddrss, amount } = this.state
    this.props.route.web3.eth.sendTransaction({ from: defAddrss, to: recAddrss, value: this.props.route.web3.toWei(amount, 'ether') }, (error, address) => {
      if (error) {
        this.setState({ TXstatus: 'Transaction failed' })
      } else {
        this.setState({ TXstatus: 'Transaction sent', TXaddrss: this.renderEtherscanLink(address, 'tx') })
      }
    })
    // watchBalance();
  }

  onRecChange = evt => {
    this.setState({ recAddrss: evt.target.value })
  }

  onAmountChange = evt => {
    this.setState({ amount: evt.target.value })
  }
}
