import React, { Component, PropTypes } from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import { VictoryLine, VictoryChart } from 'victory'
import pcoContData from '../../data/contracts/PreCoinOffering.json'
import genContData from '../../data/contracts/GenesisScheme.json'


export default class VotePCO extends Component {
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
      controllerAddrss: orgAddress,
      genAddrss: orgAddress,
      startPrice: 150,
      endPrice: 100,
      ethCap: 500,
      priceArray: [
        { price: 150, funds_raised: 0 },
        { price: 100, funds_raised: 500 },
      ],
    }
  })()

  render () {
    const { defAddrss, priceArray, startPrice, endPrice, ethCap, TXaddrss, TXstatus, pcoAddrss, genAddrss, controllerAddrss, voteStatus } = this.state
    return (
      <div>

        <h1>Deploy a new PCO</h1>
        <div>Default address (Orgnization owner): { defAddrss ? this.renderEtherscanLink(defAddrss, 'addrss') : '' }</div>
        <div>Genesis address: { genAddrss ? this.renderEtherscanLink(genAddrss, 'addrss') : '' }</div>
        <div>Controller address: { controllerAddrss ? this.renderEtherscanLink(controllerAddrss, 'addrss') : '' }</div>
        <Row>
          <Col>
            <br />
            <Form>
              <FormGroup row>
                <Label for='startPrice' sm={ 4 }>Starting Tokens Per ETH</Label>
                <Col sm={ 8 }>
                  <Input type='number' name='startPrice' id='startPrice' value={ startPrice } onChange={ this.onNumberInputChange } />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='endPrice' sm={ 4 }>End Tokens Per ETH</Label>
                <Col sm={ 8 }>
                  <Input type='number' name='endPrice' id='endPrice' value={ endPrice } onChange={ this.onNumberInputChange } />
                  </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='ethCap' sm={ 4 }>Maximum ETH Cap</Label>
                <Col sm={ 8 }>
                  <Input type='number' name='ethCap' id='ethCap' value={ ethCap } onChange={ this.onNumberInputChange } />
                </Col>
              </FormGroup>
              <FormGroup check row>
                <Col sm={ { size: 8, offset: 4 } }>
                  <Button type='button' onClick={ this.estimateGasAndDeploy }>Deploy</Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col>
            <VictoryChart>
              <VictoryLine data={ priceArray } x='funds_raised' y='price' />
            </VictoryChart>
          </Col>
        </Row>

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

  calcPriceArray () {
    const { startPrice, endPrice, ethCap } = this.state
    const newPriceArray = [
      { price: startPrice, funds_raised: 0 },
      { price: endPrice, funds_raised: ethCap },
    ]
    this.setState({ priceArray: newPriceArray })
  }

  deploy = () => {
    const { defAddrss, controllerAddrss, startPrice, endPrice, ethCap, gasReq, genAddrss } = this.state

    // Handel PCO contract:
    const byteCode = pcoContData.unlinked_binary
    const abi = pcoContData.abi
    const myPcoCont = this.props.route.web3.eth.contract(abi)
      // Deploy:
    myPcoCont.new(controllerAddrss, defAddrss, ethCap, startPrice, endPrice,
      { from: defAddrss, data: byteCode, gas: 1000000 }, (error, myContract) => {
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
        } else {
          console.error(error)
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
    this.setState({ gasReq: 1000000 })
    this.deploy()

    // const byteCode = pcoContData.unlinked_binary
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
