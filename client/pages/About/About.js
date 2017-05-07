import React, { Component } from 'react'

export default class About extends Component {
  render () {
    return (
      <div>
        <h1>What is DAOstack?</h1>
        <p>DAOstack is a multifaceted project focusing on building the following:</p>
        <ul>
          <li>An&nbsp;
            <a target='_blank' href='https://github.com/daostack/daostack'>
              open source framework
            </a>&nbsp;
            for managing faultless organizations on the blockchain using&nbsp;
            <a href='https://www.ethereum.org/'>ethereum</a>&nbsp;
            <a target='_blank' href='https://en.wikipedia.org/wiki/Smart_contract'>
              smart contracts
            </a>.
          </li>
          <li>A&nbsp;
            <a href='https://en.wikipedia.org/wiki/Platform_as_a_service'>
              Platform As A Service
            </a>, allowing anyone to deploy the DAOstack framework without any technical skills.
          </li>
          <li>
            A&nbsp;marketplace network connecting organizations, services providers and investors,&nbsp;
            in order to provide them with an easy way to publish and discover opportunities.
          </li>
          <li>A&nbsp;
            <a href='https://en.wikipedia.org/wiki/Decentralized_autonomous_organization'>
              Decentralized Autonomous Organization
            </a>&nbsp;
            in itself, using the DAOstack framework, to manage token distribution
            and decision making in it's mission to build the leading open source
            tech stack and platform for running faultless organizations.
          </li>
        </ul>
      </div>
    )
  }
}
