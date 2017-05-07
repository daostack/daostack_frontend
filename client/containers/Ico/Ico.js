import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import contract from 'truffle-contract'
import { Row, Col, Progress, Form, Input, Button } from 'reactstrap'

import EtherscanLink from '../../components/EtherscanLink'

import SimpleICO from '../../data/contracts/SimpleICO.json'
import { CURRENT_CHAIN, CURRENT_CHAIN_ID } from '../../constants/constants'

export default class IcoContainer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
      DAOstack: PropTypes.object,
    }),
  }

  state = (() => {
    const { web3 } = this.props.route
    let blockInvtervalInSeconds = 15
    if (CURRENT_CHAIN === 'testrpc') { blockInvtervalInSeconds = 5 }
    if (CURRENT_CHAIN === 'kovan') { blockInvtervalInSeconds = 5 }
    if (CURRENT_CHAIN === 'ropsten') { blockInvtervalInSeconds = 20 }
    const simpleICOAddress = SimpleICO.networks[CURRENT_CHAIN_ID]['address']
    return {
      contributionAmount: '',
      defaultAddress: web3.eth.accounts[0],
      MyContractInst: '',
      contractAddress: simpleICOAddress,
      blockInvtervalInSeconds: blockInvtervalInSeconds,
      cap: null,
      contributionSuccessMessage: null,
    }
  })()

  componentWillMount () {
    this.loadDetails()
  }

  render () {
    return (
      <div>
        <Row>
          <Col className='col-lg-6'>
            <h1>DAOstack ICO</h1>
            <br />
            { this.renderIcoDetails() }
            <br />
            { this.renderContributionForm() }
          </Col>
        </Row>
      </div>
    )
  }

  renderIcoDetails () {
    const { cap, totalEthRaised, tokenPrice, currentBlock, endBlock, blockInvtervalInSeconds, contractAddress } = this.state
    const blocksLeft = endBlock - currentBlock
    const blocksPerMinute = 60 / blockInvtervalInSeconds
    const minutesLeft = Math.round(blocksLeft / blocksPerMinute)
    const hoursLeft = Math.round(minutesLeft / 60)
    const daysLeft = Math.round(hoursLeft / 24)

    const now = moment()
    const endDate = moment().add(daysLeft, 'days')
    const timeLeft = now.to(endDate, true)

    const icoStatus = totalEthRaised === cap ? 'Complete' : 'Running'

    const icoProgress = (totalEthRaised / cap) * 100
    let progressColor = 'info'
    if (icoProgress === 100) { progressColor = 'success' }

    if (timeLeft && cap && tokenPrice) {
      return (
        <div>
          <p><strong>Contract address:</strong> <EtherscanLink address={ contractAddress } >{ contractAddress }</EtherscanLink></p>
          <p><strong>ICO Status:</strong> { icoStatus }</p>
          <p><strong>Time left:</strong> { timeLeft }</p>
          <p><strong>Cap:</strong> { cap.toLocaleString() } ETH</p>
          <p><strong>Tokens per ETH:</strong> { tokenPrice }</p>
          <p><strong>ETH raised:</strong> { totalEthRaised }</p>
          <p><strong>ICO Progress</strong></p>
          <Progress color={ progressColor } value={ icoProgress }>{ icoProgress }%</Progress>
        </div>
      )
    } else {
      return (<div>loading ICO details...</div>)
    }
  }

  renderContributionForm () {
    const { contributionAmount, contributionSuccessMessage } = this.state
    if (contributionSuccessMessage) {
      return (
        <div>{ contributionSuccessMessage }</div>
      )
    }
    return (
      <div>
        <p>How much ETH would you like to contirbute?</p>
        <Form inline>
          <Input type='number' id='contributionAmount' value={ contributionAmount } onChange={ this.onAmountChange } name='contributionAmount' placeholder='Contribution amount' />
          <Button type='button' className='bg-primary text-white' onClick={ this.donate } >Contribute ETH</Button>
        </Form>
      </div>
    )
  }

  donate = () => {
    const { web3 } = this.props.route
    const { contractAddress, defaultAddress, contributionAmount } = this.state
    const SimpleICOCont = contract(SimpleICO)
    const amountInWei = this.props.route.web3.toWei(Number(this.state.contributionAmount), 'ether')
    SimpleICOCont.setProvider(web3.currentProvider)

    SimpleICOCont.at(contractAddress).then(inst => {
      return inst.donate({ from: defaultAddress, value: amountInWei, gas: 150000 }).then(res => {
        const receivedTokens = Number(web3.fromWei(res.logs[0].args._tokensAmount))
        this.setState({ contributionSuccessMessage: `You contributed ${contributionAmount} ETH in return for ${receivedTokens} STK` })
        this.setState({ contributionAmount: '' })
        this.loadDetails()
      })
    })
  }

  loadDetails = () => {
    const { web3 } = this.props.route
    const { contractAddress } = this.state
    const SimpleICOCont = contract(SimpleICO)
    SimpleICOCont.setProvider(web3.currentProvider)

    SimpleICOCont.at(contractAddress).then(inst => {
      inst.startBlock.call().then(res => {
        this.setState({ startBlock: Number(res) })
      })
      inst.endBlock.call().then(res => {
        this.setState({ endBlock: Number(res) })
      })
      inst.cap.call().then(res => {
        this.setState({ cap: Number(web3.fromWei(res)) })
      })
      inst.totalEthRaised.call().then(res => {
        this.setState({ totalEthRaised: Number(web3.fromWei(res)) })
      })
      inst.isOpen.call().then(res => {
        this.setState({ isOpen: res })
      })
      inst.getCurrentPrice.call().then(res => {
        this.setState({ tokenPrice: Number(res) })
      })
    })

    web3.eth.getBlockNumber((error, result) => {
      if (error) { return }
      this.setState({ currentBlock: result })
    })
  }

  onAmountChange = evt => {
    this.setState({ contributionAmount: evt.target.value })
  }
}
