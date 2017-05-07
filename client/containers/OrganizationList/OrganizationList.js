import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Table } from 'reactstrap'
import contract from 'truffle-contract'
import EtherscanLink from '../../components/EtherscanLink'
import OrganizationsBoard from '../../data/contracts/OrganizationsBoard.json'

import { CURRENT_CHAIN_ID } from '../../constants/constants'

export default class OrganizationListContainer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
      DAOstack: PropTypes.object,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    const orgBoardAddress = OrganizationsBoard.networks[CURRENT_CHAIN_ID]['address']
    return {
      defAddrss: myDefAddrss,
      organizationArray: [],
      orgBoardAddress: orgBoardAddress,
    }
  })()

  componentWillMount () {
    this.readOrganizations()
  }

  render () {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Promoted with</th>
              <th>Actions</th>
            </tr>
          </thead>
          { this.renderOrganizations() }
        </Table>
        <br />
      </div>
    )
  }

  renderOrganizations () {
    // this.readOrganizations()
    const orgList = this.state.organizationArray.map(org =>
      <tr>
        <td><Link to={ `/organization/${org.address}` } >{ org.name }</Link></td>
        <td><EtherscanLink address={ org.address } >{ org.address }</EtherscanLink></td>
        <td>{ org.promotedAmount } Stacks</td>
        <td><Link to={ `/organization/${org.address}/promote` } >Promote</Link></td>
      </tr>
    )
    return (
      <tbody>{ orgList }</tbody>
    )
  }

  readOrganizations = () => {
    const { orgBoardAddress } = this.state
    const web3 = this.props.route.web3
    const OrganizationsBoardCont = contract(OrganizationsBoard)
    const newOrganizationArray = []
    OrganizationsBoardCont.setProvider(web3.currentProvider)
    OrganizationsBoardCont.at(orgBoardAddress).then(inst => {
      const myEvent = inst.OrgAdded({}, { fromBlock: 0 })
      myEvent.get((err, eventsArray) => {
        if (!err) {
          for (let cnt = 0; cnt < eventsArray.length; cnt++) {
            let promotedAmount = 0
            inst.orgList.call(eventsArray[cnt].args._addrss).then(res => {
              promotedAmount = Number(web3.fromWei(res[1]))
              this.state.organizationArray[cnt].promotedAmount = promotedAmount
              this.forceUpdate()
              if (eventsArray.length === (cnt + 1)) {
                const sortedArray = this.state.organizationArray.sort((a, b) => {
                  return b.promotedAmount - a.promotedAmount
                })
                this.setState({ organizationArray: sortedArray })
              }
            })
            newOrganizationArray[cnt] = {
              rank: cnt + 1,
              name: eventsArray[cnt].args._orgName,
              members: 3,
              tokens: 300000,
              reputation: 30000,
              promotedAmount: promotedAmount,
              address: eventsArray[cnt].args._addrss,
            }
          }
          this.setState({ organizationArray: newOrganizationArray })
        }
      })
    })
  }
}
