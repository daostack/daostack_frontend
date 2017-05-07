import React, { Component, PropTypes } from 'react'
import contract from 'truffle-contract'
import { Form, Input, Button } from 'reactstrap'

import OrganizationsBoard from '../../data/contracts/OrganizationsBoard.json'
import { CURRENT_CHAIN_ID } from '../../constants/constants'

export default class PromoteOrg extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
      DAOstack: PropTypes.object,
    }),
    params: PropTypes.shape({
      orgAddress: PropTypes.string,
    }),
  }

  state = (() => {
    const { web3 } = this.props.route
    const currentOrgAddress = this.props.params.orgAddress
    const OrganizationsBoardContract = contract(OrganizationsBoard)
    OrganizationsBoardContract.setProvider(web3.currentProvider)
    const orgBoardAddress = OrganizationsBoard.networks[CURRENT_CHAIN_ID]['address']
    return {
      web3: web3,
      promotionAmount: '',
      MyContractInst: '',
      minFeeForPromotion: null,
      currentOrgAddress: currentOrgAddress,
      defaultAddress: web3.eth.accounts[0],
      orgBoardContractAddress: orgBoardAddress,
      OrganizationsBoardContract: OrganizationsBoardContract,
    }
  })()

  componentWillMount () {
    this.loadDetails()
  }

  render () {
    const { promotionAmount, minFeeForPromotion,
      currentOrgAddress, boardName, orgBoardContractAddress, promotionResult } = this.state
    return (
      <div>
        <h3>Promote the OrgName Organization</h3>
        <p>Anyone can promote any organization in the DAOstack Organization Index in order to get more visibility and attention from collaborators and investors.</p>
        <p>All you have to do is "burn" some Stacks</p>
        <Form inline>
          <Input type='number' id='promotionAmount' value={ promotionAmount } onChange={ this.onAmountChange } name='promotionAmount' placeholder='STK amount' />
          <Button disabled={ promotionAmount <= 0 } type='button' className='bg-primary text-white' onClick={ this.promote } >Promote</Button>
        </Form>
        <div>{ promotionResult }</div>
      </div>
    )
  }

  promote = () => {
    const { web3, promotionAmount, OrganizationsBoardContract, defaultAddress, currentOrgAddress, orgBoardContractAddress } = this.state
    const promotionAmountInWei = this.props.route.web3.toWei(Number(promotionAmount), 'ether')

    OrganizationsBoardContract.at(orgBoardContractAddress).then(inst => {
      return inst.promoteOrg(currentOrgAddress, promotionAmountInWei, { from: defaultAddress, gas: 200000 }).then(res => {
        const promotedAmount = Number(web3.fromWei(res.logs[0].args._amount))
        this.setState({ promotionResult: 'Promoted org with ' + promotedAmount + ' STK' })
        this.setState({ promotionAmount: '' })
      })
    })
  }

  loadDetails = () => {
    const { web3, orgBoardContractAddress } = this.state
    const OrganizationsBoardContract = contract(OrganizationsBoard)
    OrganizationsBoardContract.setProvider(web3.currentProvider)
    OrganizationsBoardContract.at(orgBoardContractAddress).then(inst => {
      inst.fee.call().then(res => {
        this.setState({ minFeeForPromotion: Number(web3.fromWei(res)) })
      })
    })
  }

  onAmountChange = evt => {
    let amount = evt.target.value
    if (amount < 0) { amount = 0 }
    this.setState({ promotionAmount: amount })
  }
}
