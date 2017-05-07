import React, { Component, PropTypes } from 'react'

import { Router, Route, hashHistory, IndexRoute } from 'react-router'

import AppContainer from '../containers/App'
import SendEther from '../containers/SendEther'
import IcoContainer from '../containers/Ico'
import PromoteOrgContainer from '../containers/PromoteOrg'
import DeployGen from '../containers/DeployGen'
import VotePCO from '../containers/VotePCO'
import VoteSchemes from '../containers/VoteSchemes'
import RecurringRewardOffer from '../containers/RecurringRewardOffer'
import AddOrgBoard from '../containers/AddOrgBoard'

import OrganizationContainer from '../containers/Organization'
import OrganizationDetailsContainer from '../containers/OrganizationDetails'
import OrganizationListContainer from '../containers/OrganizationList'

import FaucetContainer from '../containers/Faucet'
import NotConnectedContainer from '../containers/NotConnected'
import WrongChainContainer from '../containers/WrongChain'

import SplashPage from '../pages/Splash'
import AboutPage from '../pages/About'
import CollaboratorsPage from '../pages/Collaborators'
import PresalePage from '../pages/Presale'

export default class Routes extends Component {
  static propTypes = {
    web3: PropTypes.object,
    DAOstack: PropTypes.object,
    isCorrectChain: PropTypes.bool,
  }

  componentWillReceiveProps (nextProps) {
    this.setState(nextProps)
  }

  render () {
    const { web3, DAOstack, isCorrectChain } = this.props
    let indexRouteComponant = NotConnectedContainer

    if (web3 !== 'unavailable') {
      if (!isCorrectChain) { indexRouteComponant = WrongChainContainer }
      if (DAOstack) { indexRouteComponant = SplashPage }
    }
    return (
      <Router history={ hashHistory }>
        <Route path={ '/' } component={ AppContainer } web3={ web3 } DAOstack={ DAOstack }>
          <IndexRoute component={ indexRouteComponant } web3={ web3 } DAOstack={ DAOstack } />
          <Route path={ '/deploygenesis' } component={ DeployGen } web3={ web3 } DAOstack={ DAOstack } />

        // Static Pages
          <Route path={ '/about' } component={ AboutPage } />
          <Route path={ '/collaborators' } component={ CollaboratorsPage } />
          <Route path={ '/presale' } component={ PresalePage } />

          <Route path={ '/faucet' } component={ FaucetContainer } web3={ web3 } />

          <Route path={ '/organizations' } component={ OrganizationListContainer } web3={ web3 } DAOstack={ DAOstack } />
          <Route path='/organization/:orgAddress' component={ OrganizationContainer } web3={ web3 } >
            <IndexRoute component={ OrganizationDetailsContainer } web3={ web3 } />
            <Route path={ 'ico' } component={ IcoContainer } web3={ web3 } DAOstack={ DAOstack } />
            <Route path={ 'promote' } component={ PromoteOrgContainer } web3={ web3 } DAOstack={ DAOstack } />
            <Route path={ 'details' } component={ OrganizationDetailsContainer } />
            <Route path={ 'votepco' } component={ VotePCO } web3={ web3 } />
            <Route path={ 'propose_recurring_reward' } component={ RecurringRewardOffer } web3={ web3 } />
            <Route path={ 'voteschemes' } component={ VoteSchemes } web3={ web3 } />
            <Route path={ 'addorgboard' } component={ AddOrgBoard } web3={ web3 } />
          </Route>

          <Route path={ '/sendether' } component={ SendEther } web3={ web3 } />
        </Route>
      </Router>
    )
  }
}
