import React, { Component, PropTypes } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import pcoContData from '../../data/contracts/PreCoinOffering.json'

export default class InvestPCO extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    return {
      defAddrss: myDefAddrss,
      pcoAddrss: '0xc802B8F4a1C8d983CE85071D33a6D06899CdD51E',
    }
  })()

  render () {
    const { defAddrss, TXaddrss, TXstatus, pcoAddrss, genAddrss, voteStatus } = this.state
    return (
      <div>
        <h1>Deploy a new PCO</h1>
        <h3>Orgnization details</h3>
        <div>Default address (Orgnization owner): { defAddrss ? this.renderEtherscanLink(defAddrss, 'addrss') : '' }</div>
        <div>Genesis address: { genAddrss ? this.renderEtherscanLink(genAddrss, 'addrss') : '' }</div>
        <button onClick={ this.estimateGasAndDeploy }>Deploy</button>
        <div>{ TXstatus }</div>
        <div>{ TXaddrss }</div>
        <div>{ pcoAddrss }</div>
        <div>{ voteStatus }</div>
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

  deploy = () => {
    const { defAddrss, gasReq, genAddrss } = this.state
    const price = 500

    // Handel PCO contract:
    const byteCode = pcoContData.unlinked_binary
    const abi = pcoContData.abi
    const myPcoCont = this.props.route.web3.eth.contract(abi)

    // Deploy:
    myPcoCont.new(genAddrss, defAddrss, price,
      { from: defAddrss, data: byteCode, gas: 1000000/* gasReq */ }, (error, myContract) => {
        if (!error) {
          if (!myContract.address) {
            this.setState({ TXstatus: 'PCO deploy TX was transmitted',
              TXaddrss: this.renderEtherscanLink(myContract.transactionHash, 'tx'),
              pcoAddrss: 'Waiting for contract address' })
          } else {
            this.setState({ TXstatus: 'PCO was successfully deployed',
              pcoAddrss: this.renderEtherscanLink(myContract.address, 'addrss') })
            this.openProposal(genAddrss, myContract.address)
          }
        }
      }
    )
  }

  // Vote to add it to controller:
  openProposal = (genAddrss, pcoAddrss) => {
    const genContract = this.props.route.web3.eth.contract(genContData.abi)
    const genInst = genContract.at(genAddrss)

    this.setState({ voteStatus: 'Proposing to add the new scheme' })
    genInst.proposeScheme(pcoAddrss, { from: this.state.defAddrss }, (error, res) => {
      if (!error) {
        this.setState({ voteStatus: 'Proposed schem, trying to vote' })
        this.voteScheme(genInst, pcoAddrss)
      }
    }
    )
  }

  voteScheme = (genInst, pcoAddrss) => {
    genInst.voteScheme(pcoAddrss, true, { from: this.state.defAddrss }, (error, res) => {
      if (!error) {
        this.setState({ voteStatus: 'Proposal voted successfully' })
      }
    }
    )
  }

  estimateGasAndDeploy = () => {
    const byteCodeGasComp = pcoContData.unlinked_binary
    return this.props.route.web3.eth.estimateGas({ data: byteCodeGasComp }, (error, gasEstimate) => {
      if (!error) {
        this.setState({ gasReq: gasEstimate })
        this.deploy()
      }
    })
  }

  onVoteAddrssChange = evt => {
    this.setState({ genAddrss: evt.target.value })
  }
}
