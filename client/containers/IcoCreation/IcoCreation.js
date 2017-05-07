import React, { Component, PropTypes } from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import contract from 'truffle-contract'
import SimpleICO from '../../data/contracts/SimpleICO.json'
import Genesis from '../../data/contracts/GenesisScheme.json'
import Controller from '../../data/contracts/controller/Controller.json'

export default class IcoContainer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
      currentOrg: PropTypes.object,
    }),
  }

  state = (() => {
    const { web3 } = this.props.route
    return {
      defaultAddress: web3.eth.accounts[0],
    }
  })()

  render () {
    const { tokenPrice, cap, perionInBlocks, deployStatus, contractAddress, voteStatus } = this.state
    return (
      <div>
        <h1>Open an ICO</h1>
        <h3>ICO details</h3>
        <Form>
          <FormGroup row>
            <Label for='tokenPrice' sm={ 4 }>Tokens Per ETH</Label>
            <Col sm={ 8 }>
              <Input type='number' name='tokenPrice' id='tokenPrice' value={ tokenPrice } onChange={ this.onNumberInputChange } />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for='cap' sm={ 4 }>Cap in ETH</Label>
            <Col sm={ 8 }>
              <Input type='number' name='cap' id='cap' value={ cap } onChange={ this.onNumberInputChange } />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for='perionInBlocks' sm={ 4 }>Period in blocks</Label>
            <Col sm={ 8 }>
              <Input type='number' name='perionInBlocks' id='perionInBlocks' value={ perionInBlocks } onChange={ this.onNumberInputChange } />
            </Col>
          </FormGroup>
        </Form>
        <div>{ deployStatus }</div>
        <div>Contract address: { this.renderEtherscanLink(contractAddress) }</div>
        <div>{ voteStatus }</div>
        <Button type='button' onClick={ this.deployICO }>Offer a new ICO</Button>
      </div>
    )
  }

  renderEtherscanLink (address) {
    return (
      <a href={ `https://testnet.etherscan.io/address/${address}` } target='_blank'> { address }</a>
    )
  }

  deployICO = () => {
    const { web3, currentOrg } = this.props.route
    const { defaultAddress, cap, tokenPrice, perionInBlocks } = this.state
    const GenesisCont = contract(Genesis)
    const SimpleICOCont = contract(SimpleICO)
    const ControllerCont = contract(Controller)
    SimpleICOCont.setProvider(web3.currentProvider)
    GenesisCont.setProvider(web3.currentProvider)
    ControllerCont.setProvider(web3.currentProvider)

    SimpleICOCont.new(defaultAddress, cap, tokenPrice, perionInBlocks).then(inst => {
      this.setState({ deployStatus: 'Contract deployed successfully', contractAddress: inst.address })
      GenesisCont.at(currentOrg.genesis).then(genInst => {
        genInst.proposeScheme(this.state.contractAddress, { from: this.state.defAddrss }).then(() => {
          this.setState({ voteStatus: 'Proposed scheme for vote' })
          return genInst.voteScheme(this.state.contractAddress, 'true')
        }).then(() => {
          this.setState({ voteStatus: 'Voted for scheme. Not yet approved' })
          ControllerCont.at(currentOrg.controller).then(inst => {
            return currentOrg.schemes.call(this.state.contractAddress)
          }).then(isRegitered => {
            if (isRegitered) {
              this.setState({ voteStatus: 'Vote approved successfully' })
            }
          })
        })
      })
    })
  }

  onNumberInputChange = evt => {
    this.setState({ [evt.target.name]: Number(evt.target.value) })
    this.calcPriceArray()
  }
}
