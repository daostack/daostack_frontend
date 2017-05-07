import React, { Component, PropTypes } from 'react'
import { Table } from 'reactstrap'
import contract from 'truffle-contract'
import EtherscanLink from '../../components/EtherscanLink'
import Controller from '../../data/contracts/Controller.json'
import Reputation from '../../data/contracts/Reputation.json'
import MintableToken from '../../data/contracts/MintableToken.json'

export default class OrganizationDetailsContainer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
    params: PropTypes.shape({
      orgAddress: PropTypes.string,
    }),
  }

  state = (() => {
    const myDefAddrss = this.props.route.web3.eth.accounts[0]
    return {
      defAddrss: myDefAddrss,
      agents: [],
    }
  })()

  componentWillMount () {
    this.loadOrg()
  }

  render () {
    const { defAddrss, tokenHolders, repHolders, tokenName, tokenSymbol } = this.state
    return (
      <div>
        <div>
          <h1>Organization details</h1>
          <div><strong>Token name: </strong>{ tokenName }</div>
          <div><strong>Token symbol: </strong>{ tokenSymbol }</div>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Tokens</th>
              <th>Reputation</th>
            </tr>
          </thead>
          { this.renderAgents() }
        </Table>
      </div>
    )
  }

  renderAgents () {
    const agentsList = this.state.agents.map(agent =>
      <tr>
        <td>
          <EtherscanLink address={ agent.addrss }>{ agent.addrss }</EtherscanLink>
        </td>
        <td>{ agent.balance }</td>
        <td>{ agent.rep }</td>
      </tr>
    )
    return (
      <tbody>{ agentsList }</tbody>
    )
  }

  loadOrg = () => {
    const web3 = this.props.route.web3
    const controllerAddrss = this.props.params.orgAddress
    const ControllerCont = contract(Controller)
    ControllerCont.setProvider(web3.currentProvider)
    let tokenAddrss
    let reputationAddrss
    let contInst
    ControllerCont.at(controllerAddrss).then(inst => {
      contInst = inst
      return contInst.nativeToken.call()
    }).then(token => {
      tokenAddrss = token
      return contInst.nativeReputation.call()
    }).then(rep => {
      reputationAddrss = rep
    }).then(() => {
      const currentOrg = {
        controller: controllerAddrss,
        nativeToken: tokenAddrss,
        nativeRep: reputationAddrss,
      }
      return this.setState({ currentOrg: currentOrg })
    }).then(() => {
      this.loadDetails()
    })
  }

  loadDetails = () => {
    const currentOrg = this.state.currentOrg
    if (!currentOrg) { return }
    const { web3 } = this.props.route
    const MintableTokenCont = contract(MintableToken)
    const ReputationCont = contract(Reputation)
    MintableTokenCont.setProvider(web3.currentProvider)
    ReputationCont.setProvider(web3.currentProvider)
    let tknInst
    let repInst
    MintableTokenCont.at(currentOrg.nativeToken).then(inst => {
      tknInst = inst
      tknInst.name.call().then(res => {
        this.setState({ tokenName: res })
      })
      tknInst.symbol.call().then(res => {
        this.setState({ tokenSymbol: res })
      })
      return ReputationCont.at(currentOrg.nativeRep)
    }).then(inst => {
      repInst = inst
      const mintTknEvent = tknInst.Mint({}, { fromBlock: 0 })
      const transferTknEvent = tknInst.Transfer({}, { fromBlock: 0 })
      const mintRepEvent = repInst.Mint({}, { fromBlock: 0 })
      let agentsArrDup = []
      mintTknEvent.get((err, eventsArray) => {
        if (err) { return }
        for (let cnt = 0; cnt < eventsArray.length; cnt++) {
          agentsArrDup.push(eventsArray[cnt].args.to)
        }

        transferTknEvent.get((err, eventsArray) => {
          if (err) { return }
          for (let cnt = 0; cnt < eventsArray.length; cnt++) {
            agentsArrDup.push(eventsArray[cnt].args.to)
          }

          mintRepEvent.get((err, eventsArray) => {
            if (err) { return }
            for (let cnt = 0; cnt < eventsArray.length; cnt++) {
              agentsArrDup.push(eventsArray[cnt].args.to)
            }

            const agentsArr = [...new Set(agentsArrDup)]
            let agents = []
            for (let cnt = 0; cnt < agentsArr.length; cnt++) {
              agents[cnt] = { addrss: agentsArr[cnt], balance: 0, rep: 0 }
              tknInst.balanceOf.call(agentsArr[cnt]).then(res => {
                agents[cnt].balance = Number(web3.fromWei(res))
                this.forceUpdate()
              })
              repInst.reputationOf.call(agentsArr[cnt]).then(res => {
                agents[cnt].rep = Number(web3.fromWei(res))
                this.forceUpdate()
              })
            }
            this.setState({ agents: agents })
          })
        })
      })
    })
  }
}
