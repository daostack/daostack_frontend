import React, { Component, PropTypes } from 'react'
import { NavItem } from 'reactstrap'
import NavLink from '../../components/NavLink'
import EtherscanLink from '../../components/EtherscanLink'
import './SideBar.css'

export default class SideBar extends Component {
  static propTypes = {
    orgAddress: PropTypes.string,
  }

  state = (() => {
    return {
      orgAddress: this.props.orgAddress,
    }
  })()

  render () {
    const { orgAddress } = this.state
    return (
      <ul className='nav flex-column'>
        <NavItem>
          <div className='nav-link sideBarActiveAddress'>
            <h5>Organization Links</h5>
            <EtherscanLink address={ orgAddress } >View on etherscan</EtherscanLink>
          </div>
        </NavItem>
        <NavLink to={ `organization/${orgAddress}` } >Organization Details</NavLink>
        <NavLink to={ `organization/${orgAddress}/promote` } >Promote Organization</NavLink>
      </ul>
    )
  }
}

// <NavLink to={ `organization/${orgAddress}/votepco` } >Launch PCO</NavLink>
// <NavLink to={ `organization/${orgAddress}/propose_recurring_reward` } >Recurring Reward Offer</NavLink>
// <NavLink to={ `organization/${orgAddress}/voteschemes` } >Vote on Schemes</NavLink>
