import React, { Component, PropTypes } from 'react'
import contract from 'truffle-contract'
import MintableToken from '../../data/contracts/MintableToken.json'

export default class TokenTicker extends Component {
  static propTypes = {
    web3: PropTypes.object,
    contAddrss: PropTypes.string,
    usrAddrss: PropTypes.string,
  }

  state = (() => {
    return {
      tknSymbol: '',
      balance: '',
    }
  })()

  componentWillMount () {
    this.readBalance()
  }

  render () {
    return (
      <div>{ this.state.balance.toLocaleString() } {this.state.tknSymbol}</div>
    )
  }

  readBalance = () => {
    const MintableTokenCont = contract(MintableToken)
    let contInst
    MintableTokenCont.setProvider(this.props.web3.currentProvider)
    MintableTokenCont.at(this.props.contAddrss).then(inst => {
      contInst = inst
      inst.symbol.call().then(res => {
        this.setState({ tknSymbol: res })
      })

      const myEvent = inst.allEvents({ fromBlock: 'latest' })
      myEvent.watch(res => {
        contInst.balanceOf(this.props.usrAddrss).then(res => {
          this.setState({ balance: Number(this.props.web3.fromWei(res)) })
        })
      })

      return (inst.balanceOf(this.props.usrAddrss))
    }).then(res => {
      this.setState({ balance: Number(this.props.web3.fromWei(res)) })
    })
  }
}
