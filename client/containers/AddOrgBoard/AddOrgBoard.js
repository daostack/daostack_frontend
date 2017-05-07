import React, { Component, PropTypes } from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import orgBoardContData from '../../data/contracts/OrganizationsBoard.json'
import genContData from '../../data/contracts/GenesisScheme.json'

export default class AddOrgBoard extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    return {
      defAddrss: myDefAddrss,
      genAddrss: '0x0462bbf9f0f769895183cfce9a376cfa50f38870',
      controllerAddrss: '0xed2b684711D2Bd703Eb78B59Bf7925975c3eb979',
    }
  })()

  render () {
    const { defAddrss, orgName, TXaddrss, TXstatus, orgBoardAddrss, genAddrss, controllerAddrss, voteStatus } = this.state
    return (
      <div>

        <h1>Deploy a new organizations board</h1>
        <div>Default address (Orgnization owner): { defAddrss ? this.renderEtherscanLink(defAddrss, 'addrss') : '' }</div>
        <div>Genesis address: { genAddrss ? this.renderEtherscanLink(genAddrss, 'addrss') : '' }</div>
        <div>Controller address: { controllerAddrss ? this.renderEtherscanLink(controllerAddrss, 'addrss') : '' }</div>
        <Row>
          <Col>
            <br />
            <Form>
              <FormGroup row>
                <Label for='orgName' sm={ 4 }>Organization Name: </Label>
                <Col sm={ 8 }>
                  <Input type='text' name='orgName' id='orgName' value={ orgName } onChange={ this.onTextInputChange } />
                </Col>
              </FormGroup>
              <FormGroup check row>
                <Col sm={ { size: 8, offset: 4 } }>
                  <Button type='button' onClick={ this.estimateGasAndDeploy }>Deploy</Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>

        <div>{ TXstatus }</div>
        <div>{ TXaddrss }</div>
        <div>{ orgBoardAddrss }</div>
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
    const { defAddrss, controllerAddrss, orgName, gasReq, genAddrss } = this.state

    // Handel OrgBoard contract:
    const byteCode = orgBoardContData.unlinked_binary
    const abi = orgBoardContData.abi
    const myOrgBoardCont = this.props.route.web3.eth.contract(abi)
      // Deploy:
    myOrgBoardCont.new(controllerAddrss, defAddrss, orgName,
      { from: defAddrss, data: byteCode, gas: 1000000 }, (error, myContract) => {
        if (!error) {
          if (!myContract.address) {
            this.setState({ TXstatus: 'Organizations Board deploy TX was transmitted',
              TXaddrss: this.renderEtherscanLink(myContract.transactionHash, 'tx'),
              orgBoardAddrss: 'Waiting for contract address' })
          } else {
            this.setState({ TXstatus: 'Organizations Board was successfully deployed',
              orgBoardAddrss: this.renderEtherscanLink(myContract.address, 'addrss') })
            this.openProposal(genAddrss, myContract.address)
          }
        } else {
          console.error(error)
        }
      }
    )
  }

  // Vote to add it to controller:
  openProposal = (genAddrss, schemeAddrss) => {
    const genContract = this.props.route.web3.eth.contract(genContData.abi)
    const genInst = genContract.at(genAddrss)

    this.setState({ voteStatus: 'Proposing to add the new scheme' })
    genInst.proposeScheme(schemeAddrss, { from: this.state.defAddrss }, (error, res) => {
      if (!error) {
        this.setState({ voteStatus: 'Proposed schem, trying to vote' })
        this.voteScheme(genInst, schemeAddrss)
      }
    }
    )
  }

  voteScheme = (genInst, schemeAddrss) => {
    genInst.voteScheme(schemeAddrss, 1, { from: this.state.defAddrss }, (error, res) => {
      if (!error) {
        this.setState({ voteStatus: 'Proposal voted successfully' })
      }
    }
    )
  }

  estimateGasAndDeploy = () => {
    this.setState({ gasReq: 1000000 })
    this.deploy()

    // const byteCode = orgBoardContData.unlinked_binary
    // this.props.route.web3.eth.estimateGas({ data: byteCode }, (error, gasEstimate) => {
    //   if (error) {
    //     console.error(error)
    //   } else {
    //     console.log(gasEstimate)
    //     this.setState({ gasReq: gasEstimate })
    //     // this.deploy()
    //   }
    // })
  }

  onTextInputChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
    this.calcPriceArray()
  }

  onNumberInputChange = evt => {
    this.setState({ [evt.target.name]: Number(evt.target.value) })
    this.calcPriceArray()
  }

}
