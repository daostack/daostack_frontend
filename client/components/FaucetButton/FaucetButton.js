import React, { Component, PropTypes } from 'react'
import EthereumTx from 'ethereumjs-tx'

export default class FaucetButton extends Component {
  static propTypes = {
    web3: PropTypes.object,
    usrAddrss: PropTypes.string,
    fillFaucet: PropTypes.bool,
  }

  state = (() => {
    return {
      ethGot: 0,
      privateKey: Buffer.from('e331b6d69882b4cb4ea581d81e0b604039a3de5967688d3dcffdd22a0c0fd109', 'hex'),
      faucetAddrss: '0x0C7d5acCF24B1747D5A84780346337BBceD06288',
      getEthSuccessMessage: null,
      getEthErrorMessage: null,
      ethBalance: null,
    }
  })()

  render () {
    return (
      <div>
        { this.renderGetEthButton() }
        { this.renderFillFaucetButton() }
      </div>
    )
  }

  renderGetEthButton () {
    if (this.props.fillFaucet) { return }
    const { getEthSuccessMessage, getEthErrorMessage } = this.state
    if (getEthSuccessMessage) { return (<div>{ getEthSuccessMessage }</div>) }
    if (getEthErrorMessage) { return (<div>{ getEthErrorMessage }</div>) }
    return (
      <button type='button' className='btn btn-primary' onClick={ this.getEth }>Send me some ETH please</button>
    )
  }

  renderFillFaucetButton () {
    if (!this.props.fillFaucet) { return }
    return (
      <button type='button' className='btn btn-secondary' onClick={ this.sendToFaucet }>Click here</button>
    )
  }

  sendToFaucet = () => {
    const web3 = this.props.web3
    const faucetAddrss = this.state.faucetAddrss
    const defAddrss = web3.eth.accounts[0]
    const amountInWei = web3.toWei(0.1, 'ether')
    web3.eth.sendTransaction({ to: faucetAddrss, from: defAddrss, value: amountInWei }, () => {
      web3.eth.getBalance(this.props.usrAddrss, (err, res) => {
        if (!err) {
          this.setState({
            getEthSuccessMessage: '0.1 ETH sent successfully',
            ethBalance: Number(web3.fromWei(res)),
          })
        } else {
          this.setState({ getEthErrorMessage: err })
        }
      })
    })
  }

  getEth = () => {
    const web3 = this.props.web3
    const amount = '0x6F05B59D3B20000' // 0.5 Ether in hex
    web3.eth.getTransactionCount(this.state.faucetAddrss, (err, txCnt) => {
      if (err) {
        this.setState({ getEthErrorMessage: err })
        return
      }
      web3.eth.getGasPrice((err, gasPrice) => {
        if (err) {
          this.setState({ getEthErrorMessage: err })
          return
        }
        const rawTx = {
          nonce: txCnt,
          gasPrice: 100000000000, // Number(gasPrice),
          gasLimit: 50000,
          to: this.props.usrAddrss,
          value: amount,
        }
        const tx = new EthereumTx(rawTx)
        tx.sign(this.state.privateKey)
        const serializedTx = tx.serialize()
        const tx4sending = '0x' + serializedTx.toString('hex')
        web3.eth.sendRawTransaction(tx4sending, { from: this.state.faucetAddrss }, (err, hash) => {
          if (err) {
            this.setState({ getEthErrorMessage: err })
            return
          }
          this.setState({ getEthSuccessMessage: '0.5 ETH sent successfully' })
        })
      })
    })
  }
}
