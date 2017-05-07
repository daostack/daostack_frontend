import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Row, Col, Button, Form, Label, Input, Progress } from 'reactstrap'
import { VictoryPie } from 'victory'
import FontAwesome from 'react-fontawesome'
import contract from 'truffle-contract'
import EtherscanLink from '../../components/EtherscanLink'
import OrganizationsBoard from '../../data/contracts/OrganizationsBoard.json'
import SimpleVote from '../../data/contracts/SimpleVote.json'
import Genesis from '../../data/contracts/GenesisScheme.json'
import Controller from '../../data/contracts/Controller.json'
import MintableToken from '../../data/contracts/MintableToken.json'
import { CURRENT_CHAIN_ID } from '../../constants/constants'

export default class DeployGen extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
      DAOstack: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    return {
      defAddrss: myDefAddrss,
      tokenName: '',
      tokenSymbol: '',
      initToken: '',
      initRep: '',
      collaborator_0_address: myDefAddrss,
      collaborators: [{ address: myDefAddrss, tokens: 1000, reputation: 1000 }],
      simpleVoteDeployMessage: null,
      genesisDeployMessage: null,
      deployOrgStatus: null,
      ethBalance: null,
      tknBalance: null,
    }
  })()

  componentWillMount () {
    this.readBalances()
  }

  render () {
    return (
      <Row>
        <Col xs='9'>
          <h1>Deploy a new DAO</h1>
          { this.renderDeployOrgForm() }
        </Col>
        <Col xs='3'>
          { this.renderDistrbutionCharts() }
        </Col>
      </Row>
    )
  }

  renderDeployOrgForm () {
    const { tknBalance, ethBalance, controllerAddrss } = this.state
    if (ethBalance === null || tknBalance === null) {
      return (
        <div>
          <h5>Loading...</h5>
        </div>
      )
    }
    if (ethBalance < 0.2) {
      return (
        <div>
          <br />
          <h5>Looks like you don't have enough ETH to pay for all the transaction fees to launch your organization.</h5>
          <br />
          <Link to='faucet' className='btn btn-primary' >Get some ETH from our faucet</Link>
        </div>
      )
    }
    if (tknBalance < 5) {
      return (
        <div>
          <br />
          <h5>The price to launch an organization on DAOstack is 5 STK. Head over to the DAOstack ICO and contribute some ETH in return for some Stacks.</h5>
          <br />
          <Link className='btn btn-primary' to={ `/organization/${controllerAddrss}/ico` } >Go get some Stacks!</Link>
        </div>
      )
    }
    return (
      <div>
        <br />
        { this.renderTokenDetailsForm() }
        <br />
        <h4>Orgnization Core Team Members</h4>
        <br />
        { this.renderCollaboratorForms() }
        <Button type='button' onClick={ this.addCollaboratorInput }>
          <FontAwesome name='plus' /> Add another collaborator
        </Button>
        <br /><br />
        { this.renderDeploymentProgress() }
      </div>
    )
  }

  renderDeploymentProgress () {
    const { deployOrgStatus } = this.state
    if (deployOrgStatus === null) {
      return (
        <div>
          <p><strong>* Forging a new organization requires the signing of three separate transactions at the moment. So please be patient and make sure to sign all three transactions. </strong></p>
          <Button type='button' className='bg-primary text-white' onClick={ this.deploySequence }>
            <FontAwesome name='rocket' /> Deploy Organization
          </Button>
        </div>
      )
    }
    if (deployOrgStatus === 'deploying') {
      return (
        <div>
          <h6 className='text-center'>Organization Deployment Progress</h6>
          <Progress multi>
            { this.renderSimpleVoteDeployProgress() }
            { this.renderGenesisDeployProgress() }
            { this.renderAddOrgToIndexProgress() }
          </Progress>
        </div>
      )
    }
    if (deployOrgStatus === 'deployed') {
      return (
        <div>
          <h5>congratulations! Your organization has been successfully deployed!</h5>
          <p>Check it out in the <Link to='organizations' >Organization Index</Link> </p>
        </div>
      )
    }
  }

  renderSimpleVoteDeployProgress () {
    const { simpleVoteDeployMessage, simpleVoteContractAddress } = this.state
    if (simpleVoteDeployMessage === null) { return }
    if (simpleVoteDeployMessage === 'deploying') {
      return (<Progress bar animated value='33.3'>Deploying SimpleVote Contract</Progress>)
    }
    if (simpleVoteDeployMessage === 'deployed') {
      return (
        <Progress color='success' bar value='33.3'>
          <EtherscanLink address={ simpleVoteContractAddress } >SimpleVote Deployed Successfully</EtherscanLink>
        </Progress>
      )
    }
  }

  renderGenesisDeployProgress () {
    const { genesisDeployMessage, genesisContractAddress } = this.state
    if (genesisDeployMessage === null) { return }
    if (genesisDeployMessage === 'deploying') {
      return (<Progress bar animated value='33.3'>Deploying Genesis Contract</Progress>)
    }
    if (genesisDeployMessage === 'deployed') {
      return (
        <Progress color='success' bar value='33.3'>
          <EtherscanLink address={ genesisContractAddress } >Genesis Deployed Successfully</EtherscanLink>
        </Progress>
      )
    }
  }

  renderAddOrgToIndexProgress () {
    const { addOrgToIndexMessage } = this.state
    if (addOrgToIndexMessage === null) { return }
    if (addOrgToIndexMessage === 'adding_org') {
      return (<Progress bar animated value='33.3'>Adding Your Organization to Index</Progress>)
    }
    if (addOrgToIndexMessage === 'org_added') {
      return (<Progress color='success' bar value='33.3'>Organization Added to Index Successfully</Progress>)
    }
  }

  renderDistrbutionCharts () {
    const { collaborators } = this.state
    return (
      <div>
        <h3 className='text-center'>Tokens Distribution</h3>
        <VictoryPie
          data={ collaborators }
          x='address'
          y={ datum => datum.tokens }
          />
        <h3 className='text-center'>Reputation Distribution</h3>
        <VictoryPie
          data={ collaborators }
          x='address'
          y={ datum => datum.reputation }
          />
      </div>
    )
  }

  renderTokenDetailsForm () {
    const { tokenName, tokenSymbol } = this.state
    return (
      <div>
        <h4>Token Details</h4>
        <Form inline>
          <Label className='mr-sm-2' for='tokenName'>Token Name</Label>
          <Input className='mr-sm-2' type='text' id='tokenName' value={ tokenName } onChange={ this.onTknNameChange } name='tokenName' />
          <Label className='mr-sm-2' for='tokenSymbol'>Token symbol</Label>
          <Input className='mr-sm-2' id='tokenSymbol' type='text' value={ tokenSymbol } onChange={ this.onTokenSymbolChange } name='tokenSymbol' />
        </Form>
      </div>
    )
  }

  renderCollaboratorForms () {
    return this.state.collaborators.map((collaborator, idx) =>
      <div>
        <Form inline>
          <Label className='mr-sm-2' for={ `collaborator_${idx}_address` }>Member { idx + 1 } </Label>
          <Input
            placeholder='enter wallet address'
            className='mr-sm-2'
            type='text'
            name={ `collaborator_${idx}_address` }
            id={ `collaborator_${idx}_address` }
            key={ `collaborator_${idx}_address` }
            value={ collaborator.address }
            onChange={ this.handleCollaboratorAddressChange(idx) }
          />
          <Label className='mr-sm-2' for={ `collaborator_${idx}_tokens` }>Tokens</Label>
          <Input
            className='mr-sm-2'
            type='number'
            name={ `collaborator_${idx}_tokens` }
            id={ `collaborator_${idx}_tokens` }
            key={ `collaborator_${idx}_tokens` }
            value={ collaborator.tokens }
            onChange={ this.handleCollaboratorTokenChange(idx) }
          />
          <Label className='mr-sm-2' for={ `collaborator_${idx}_reputation` }>Reputation</Label>
          <Input
            className='mr-sm-2'
            type='number'
            name={ `collaborator_${idx}_reputation` }
            id={ `collaborator_${idx}_reputation` }
            key={ `collaborator_${idx}_reputation` }
            value={ collaborator.reputation }
            onChange={ this.handleCollaboratorReputationChange(idx) }
          />
          { this.renderRemoveCollaboratorButton(idx) }
        </Form>
        <br />
      </div>
    )
  }

  renderRemoveCollaboratorButton (idx) {
    if (idx === 0) { return }
    return (
      <span className='mr-sm-2'>
        <FontAwesome
          name='times'
          size='2x'
          onClick={ this.removeCollaborator(idx) }
        />
      </span>
    )
  }

  deploySequence = () => {
    const DAOstack = this.props.route.DAOstack
    const web3 = this.props.route.web3
    const { defAddrss, tokenName, tokenSymbol } = this.state
    const addressArray = this.addressArray()
    const tokensArray = this.tokensArray()
    const reputationsArray = this.reputationsArray()
    const SimpleVoteCont = contract(SimpleVote)
    const GenesisCont = contract(Genesis)
    const OrganizationsBoardCont = contract(OrganizationsBoard)
    SimpleVoteCont.setProvider(web3.currentProvider)
    GenesisCont.setProvider(web3.currentProvider)
    OrganizationsBoardCont.setProvider(web3.currentProvider)
    this.setState({ deployOrgStatus: 'deploying', simpleVoteDeployMessage: 'deploying' })
    SimpleVoteCont.new({ from: defAddrss, gas: 3000000 }).then(inst => {
      this.setState({ simpleVoteDeployMessage: 'deployed', simpleVoteContractAddress: inst.address })
      return (inst.address)
    }).then(simpleVoteAddrss => {
      this.setState({ genesisDeployMessage: 'deploying' })
      return GenesisCont.new(tokenName, tokenSymbol, addressArray, tokensArray, reputationsArray, simpleVoteAddrss, { from: defAddrss, gas: 4000000 })
    }).then(genInst => {
      this.setState({ genesisDeployMessage: 'deployed', genesisContractAddress: genInst.address })
      return genInst.controller.call()
    }).then(controllerAddrss => {
      this.setState({ addOrgToIndexMessage: 'adding_org' })
      OrganizationsBoardCont.at(DAOstack.orgBoard).then(inst => {
        return inst.addOrg(controllerAddrss, tokenName, { from: web3.eth.accounts[0], gas: 200000 })
      }).then(() => {
        this.setState({ controllerAddrss: controllerAddrss, deployOrgStatus: 'deployed', addOrgToIndexMessage: 'org_added' })
      })
    })
  }

  readBalances = () => {
    const web3 = this.props.route.web3
    const defAddrss = this.state.defAddrss
    const GenesisSchemeCont = contract(Genesis)
    const ControllerCont = contract(Controller)
    const MintableTokenCont = contract(MintableToken)
    GenesisSchemeCont.setProvider(web3.currentProvider)
    ControllerCont.setProvider(web3.currentProvider)
    MintableTokenCont.setProvider(web3.currentProvider)
    const genesisAddress = Genesis.networks[CURRENT_CHAIN_ID]['address']
    GenesisSchemeCont.at(genesisAddress).then(genInst => {
      return genInst.controller.call()
    }).then(contAddrss => {
      return ControllerCont.at(contAddrss)
    }).then(contInst => {
      return contInst.nativeToken.call()
    }).then(tknAddress => {
      MintableTokenCont.at(tknAddress).then(inst => {
        return (inst.balanceOf.call(defAddrss, { from: defAddrss }))
      }).then(res => {
        this.setState({ tknBalance: Number(web3.fromWei(res)) })
      })
      web3.eth.getBalance(defAddrss, (error, res) => {
        if (error) { return }
        this.setState({ ethBalance: Number(web3.fromWei(res)) })
      })
    })
  }

  handleCollaboratorAddressChange = idx => evt => {
    const newCollaborators = this.state.collaborators.map((collaborator, sidx) => {
      if (idx !== sidx) return collaborator
      return { ...collaborator, address: evt.target.value }
    })
    this.setState({ collaborators: newCollaborators })
  }

  handleCollaboratorTokenChange = idx => evt => {
    const newCollaborators = this.state.collaborators.map((collaborator, sidx) => {
      if (idx !== sidx) return collaborator
      return { ...collaborator, tokens: Number(evt.target.value) }
    })
    this.setState({ collaborators: newCollaborators })
  }

  handleCollaboratorReputationChange = idx => evt => {
    const newCollaborators = this.state.collaborators.map((collaborator, sidx) => {
      if (idx !== sidx) return collaborator
      return { ...collaborator, reputation: Number(evt.target.value) }
    })
    this.setState({ collaborators: newCollaborators })
  }

  removeCollaborator = idx => () => {
    if (this.state.collaborators.length === 1) { return }
    this.setState({ collaborators: this.state.collaborators.filter((s, sidx) => idx !== sidx) })
  }

  addCollaboratorInput = () => {
    this.setState({
      collaborators: this.state.collaborators.concat([{ address: '', tokens: 1000, reputation: 1000 }]),
    })
  }

  pieChartData () {
    return this.state.collaborators.map((collaborator, sidx) => {
      return { address: collaborator.address, tokens: collaborator.tokens }
    })
  }

  addressArray () {
    return this.state.collaborators.map((collaborator, sidx) => {
      return collaborator.address
    })
  }

  tokensArray () {
    const web3 = this.props.route.web3
    return this.state.collaborators.map((collaborator, sidx) => {
      return web3.toWei(collaborator.tokens)
    })
  }

  reputationsArray () {
    const web3 = this.props.route.web3
    return this.state.collaborators.map((collaborator, sidx) => {
      return web3.toWei(collaborator.reputation)
    })
  }

  onTknNameChange = evt => {
    this.setState({ tokenName: evt.target.value })
  }

  onTokenSymbolChange = evt => {
    this.setState({ tokenSymbol: evt.target.value.toUpperCase() })
  }

  onInitTknChange = evt => {
    this.setState({ initToken: Number(evt.target.value) })
  }

  onInitRepChange = evt => {
    this.setState({ initRep: Number(evt.target.value) })
  }

  onTextInputChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  onNumberInputChange = evt => {
    this.setState({ [evt.target.name]: Number(evt.target.value) })
  }
}
