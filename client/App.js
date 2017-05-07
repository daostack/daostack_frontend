import React, { Component } from 'react'
import Web3 from 'web3'
import contract from 'truffle-contract'
import Routes from './Routes'
import GenesisScheme from './data/contracts/GenesisScheme.json'
import Controller from './data/contracts/Controller.json'
import OrganizationsBoard from './data/contracts/OrganizationsBoard.json'
import SimpleICO from './data/contracts/SimpleICO.json'
import { CURRENT_CHAIN_ID } from './constants/constants'

export default class App extends Component {
  state = {
    web3: null,
    daoStackAddresses: null,
    isCorrectChain: null,
  }

  componentWillMount () {
    this.initWeb3()
  }

  render () {
    const { web3, daoStackAddresses, isCorrectChain } = this.state
    if (web3 && !isCorrectChain) {
      return (<Routes web3={ web3 } isCorrectChain={ isCorrectChain } />)
    }
    if (!!daoStackAddresses || web3 === 'unavailable') {
      return (<Routes web3={ web3 } DAOstack={ daoStackAddresses } />)
    } else {
      return (<div>Loading DAOstack...</div>)
    }
  }

  initWeb3 () {
    let web3
    if (window.web3) {
      web3 = new Web3(window.web3.currentProvider)
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    }

    try {
      web3.eth.defaultAccount = web3.eth.accounts[0]
      this.getDaoStackAddresses(web3)
    } catch (err) {
      web3 = 'unavailable'
    }

    this.setState({ web3 })
  }

  getDaoStackAddresses (web3) {
    // const web3 = this.state.web3
    let controllerAddrss
    let tokenAddrss
    let reputationAddrss
    let controllerInst

    const orgBoardAddress = OrganizationsBoard.networks[CURRENT_CHAIN_ID]['address']
    const genesisAddress = GenesisScheme.networks[CURRENT_CHAIN_ID]['address']
    const simpleICOAddress = SimpleICO.networks[CURRENT_CHAIN_ID]['address']

    if (web3 != null) {
      web3.version.getNetwork((err, res) => {
        if (err) { return }
        const isCorrectChain = CURRENT_CHAIN_ID === res
        this.setState({ currentNetworkId: res, isCorrectChain: isCorrectChain })
      })
      const GenesisCont = contract(GenesisScheme)
      GenesisCont.setProvider(web3.currentProvider)
      GenesisCont.at(genesisAddress).then(genInst => {
        return genInst.controller.call()
      }).then(contAddrss => {
        controllerAddrss = contAddrss
        const ControllerCont = contract(Controller)
        ControllerCont.setProvider(web3.currentProvider)
        return ControllerCont.at(contAddrss)
      }).then(contInst => {
        controllerInst = contInst
        return controllerInst.nativeToken.call()
      }).then(res => {
        tokenAddrss = res
        return controllerInst.nativeReputation.call()
      }).then(res => {
        reputationAddrss = res
      }).then(() => {
        const daoStackAddresses = { genesis: genesisAddress,
          orgBoard: orgBoardAddress,
          simpleICO: simpleICOAddress,
          controller: controllerAddrss,
          nativeToken: tokenAddrss,
          nativeRep: reputationAddrss }
        this.setState({ daoStackAddresses })
      })
    }
  }
}
