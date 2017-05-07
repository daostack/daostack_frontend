import React, { Component, PropTypes } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import genContData from '../../data/contracts/GenesisScheme.json'

export default class VoteSchemes extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    const orgAddress = this.props.params.orgAddress
    const abi = genContData.abi
    const myGenCont = this.props.route.web3.eth.contract(abi)
    return {
      defAddrss: myDefAddrss,
      genAddrss: orgAddress,
      genInst: myGenCont.at(orgAddress),
    }
  })()

  render () {
    const { defAddrss, TXaddrss, TXstatus, pcoAddrss, genAddrss, voteStatus } = this.state
    return (
      <div>
        <h1>Vote Schemes</h1>
        <Form>
          <FormGroup>
            <h3>Orgnization details</h3>
            <div>Default address (Orgnization owner): { defAddrss ? this.renderEtherscanLink(defAddrss, 'addrss') : '' }</div>
            <div>Genesis address: { genAddrss ? this.renderEtherscanLink(genAddrss, 'addrss') : '' }</div>
          </FormGroup>
          <FormGroup>
            <Label>Select a scheme to vote on: </Label><div>this.renderSelectSchemes()</div>
          </FormGroup>
          <button type='button' onClick={ this.voteScheme }>Deploy</button>
          <div>{ TXstatus }</div>
          <div>{ TXaddrss }</div>
          <div>{ pcoAddrss }</div>
          <div>{ voteStatus }</div>
        </Form>
      </div>
    )
  }

  renderSelectSchemes () {

    return (
      <Select>

      </Select>
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

  voteScheme = schemeAddrss => {
    const genInst = this.state
    genInst.voteScheme(schemeAddrss, true, { from: this.state.defAddrss }, (error, res) => {
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
