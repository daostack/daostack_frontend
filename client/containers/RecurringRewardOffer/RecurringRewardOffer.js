import React, { Component, PropTypes } from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import genContData from '../../data/contracts/GenesisScheme.json'
import employeeContData from '../../data/contracts/Employee.json'

export default class RecurringRewardOffer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    const orgAddress = this.props.params.orgAddress
    return {
      defAddrss: myDefAddrss,
      genAddrss: orgAddress,
      controllerAddrss: orgAddress,
    }
  })()

  render () {
    const { collaboratorAddress, tokensPerMonth, reputationPerMonth, numberOfMonths, TXstatus, TXaddrss, employeeContAddrss, voteStatus } = this.state
    return (
      <div>
        <br />
        <h1>Propose a Monthly Recurring Reward to a Collaborator</h1>
        <Row>
          <Col>
            <br />
            <Form>
              <FormGroup row>
                <Label for='collaboratorAddress' sm={ 4 }>Collaborator Address</Label>
                <Col sm={ 8 }>
                  <Input type='text' name='collaboratorAddress' id='collaboratorAddress' value={ collaboratorAddress } onChange={ this.onTextInputChange } />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='tokensPerMonth' sm={ 4 }>Tokens Per Month</Label>
                <Col sm={ 8 }>
                  <Input type='number' name='tokensPerMonth' id='tokensPerMonth' value={ tokensPerMonth } onChange={ this.onNumberInputChange } />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='reputationPerMonth' sm={ 4 }>Reputation Per Month</Label>
                <Col sm={ 8 }>
                  <Input type='number' name='reputationPerMonth' id='reputationPerMonth' value={ reputationPerMonth } onChange={ this.onNumberInputChange } />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='numberOfMonths' sm={ 4 }>Number of Months</Label>
                <Col sm={ 8 }>
                  <Input type='number' name='numberOfMonths' id='numberOfMonths' value={ numberOfMonths } onChange={ this.onNumberInputChange } />
                </Col>
              </FormGroup>
              <FormGroup check row>
                <Col sm={ { size: 8, offset: 4 } }>
                  <Button type='button' onClick={ this.deploy }>Deploy</Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col></Col>
        </Row>
        <div>{ TXstatus }</div>
        <div>{ TXaddrss }</div>
        <div>{ employeeContAddrss }</div>
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
    const { defAddrss, genAddrss, controllerAddrss, collaboratorAddress, tokensPerMonth, reputationPerMonth, numberOfMonths } = this.state
    // Handel Employee contract:
    const byteCode = employeeContData.unlinked_binary
    const abi = employeeContData.abi
    const myEmpCont = this.props.route.web3.eth.contract(abi)

    // Deploy:
    myEmpCont.new(controllerAddrss, collaboratorAddress, Number(Date.now()), Number(numberOfMonths),
     Number(tokensPerMonth), Number(reputationPerMonth),
      { from: defAddrss, data: byteCode, gas: 1000000 }, (error, myContract) => {
        if (!error) {
          if (!myContract.address) {
            this.setState({ TXstatus: 'Employee contract deploy TX was transmitted',
              TXaddrss: this.renderEtherscanLink(myContract.transactionHash, 'tx'),
              employeeContAddrss: 'Waiting for contract address' })
          } else {
            this.setState({ TXstatus: 'Employee contract was successfully deployed',
              employeeContAddrss: this.renderEtherscanLink(myContract.address, 'addrss') })
            this.openProposal(genAddrss, myContract.address)
          }
        }
      }
    )
  }

  // Vote to add it to controller:
  openProposal = (genAddrss, proposedSchemeAddrss) => {
    const genContract = this.props.route.web3.eth.contract(genContData.abi)
    const genInst = genContract.at(genAddrss)

    this.setState({ voteStatus: 'Proposing to add the new scheme' })
    genInst.proposeScheme(proposedSchemeAddrss, { from: this.state.defAddrss }, (error, res) => {
      if (!error) {
        this.setState({ voteStatus: 'Proposed schem, trying to vote' })
        this.voteScheme(genInst, proposedSchemeAddrss)
      }
    }
    )
  }

  voteScheme = (genInst, proposedSchemeAddrss) => {
    genInst.voteScheme(proposedSchemeAddrss, true, { from: this.state.defAddrss }, (error, res) => {
      if (!error) {
        this.setState({ voteStatus: 'Proposal voted successfully' })
      }
    }
    )
  }

  onTextInputChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  onNumberInputChange = evt => {
    this.setState({ [evt.target.name]: Number(evt.target.value) })
  }

}
