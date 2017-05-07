import React, { Component, PropTypes } from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap'
import { IndexLink } from 'react-router'
import FontAwesome from 'react-fontawesome'

import NavLink from '../../components/NavLink'
import TokenTicker from '../../components/TokenTicker'
import EthBalance from '../../components/EthBalance'
import './NavBar.css'

export default class NavBar extends Component {
  static propTypes = {
    web3: PropTypes.object,
    DAOstack: PropTypes.object,
  }

  state = (() => {
    const activeAddress = this.props.web3.eth.accounts[0]
    return {
      isOpen: false,
      connected: this.props.web3.isConnected(),
      activeAddress: activeAddress,
    }
  })()

  render () {
    const { activeAddress } = this.state
    const { web3, DAOstack } = this.props
    return (
      <div>
        <Navbar inverse toggleable className='bg-inverse container-fluid'>
          <NavbarToggler right onClick={ this.toggle } />
          <IndexLink className='navbar-brand' to='/' activeClassName='active'>
            <img className='navbar-logo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/blocks-medium.png' alt='DAOstack Logo' /> DAOstack
          </IndexLink>
          <Collapse isOpen={ this.state.isOpen } navbar>
            <Nav navbar>
              <NavLink to='organizations'>Organizations</NavLink>
              <NavLink to='deploygenesis'>Launch a DAO</NavLink>
            </Nav>
            <Nav className='ml-auto' navbar>
              <NavItem title='ETH balance'>
                <div className='nav-link'>
                  <EthBalance web3={ web3 } />
                </div>
              </NavItem>
              <NavItem title='STK balance'>
                <div className='nav-link'>
                  <TokenTicker web3={ web3 } contAddrss={ DAOstack.nativeToken } usrAddrss={ activeAddress } />
                </div>
              </NavItem>
              <NavItem>{ this.renderConnectedStatus() }</NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }

  renderConnectedStatus () {
    const status = this.state.connected
    if (!status) {
      return (
        <div className='nav-link'>
          <span>Connecting...</span>
        </div>
      )
    } else {
      return (
        <div className='nav-link' title='Connected to Ethereum' >
          <FontAwesome name='circle' className='green' />
        </div>
      )
    }
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }
}
