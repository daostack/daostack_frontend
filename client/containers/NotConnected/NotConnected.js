import React, { Component } from 'react'
import { CURRENT_CHAIN } from '../../constants/constants'

const currentLocation = window.location.origin

export default class NotConnected extends Component {
  render () {
    return (
      <div>
        <h1>Not connected to Ethereum</h1>
        <p>DAOstack requires an active Ethereum client connection to run.</p>
        <p>Use one of the following clients to connect to Ethereum:</p>
        { this.renderMetaMaskExplanation() }
        { this.renderMistExplanation() }
        { this.renderParityExplanation() }
      </div>
    )
  }

  renderMetaMaskExplanation () {
    return (
      <div>
        <h5>MetaMask</h5>
        <ul>
          <li>
            Install the <a target='_blank' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>MetaMask Chrome Extension</a>
          </li>
          <li>Change the network of metamask to the <strong>{ CURRENT_CHAIN }</strong> network</li>
          <li>Reload this page</li>
        </ul>
      </div>
    )
  }

  renderMistExplanation () {
    if (CURRENT_CHAIN === 'ropsten') {
      return (
        <div>
          <h5>Mist</h5>
          <ul>
            <li>
              Download, install and run <a target='_blank' href='https://github.com/ethereum/mist/releases'>Mist</a>
            </li>
            <li>In Mist switch to the test network - Develop > Network > Testnet</li>
            <li>Open <a href={ currentLocation } >{ currentLocation }</a> in the Mist browser</li>
          </ul>
        </div>
      )
    }
  }

  renderParityExplanation () {
    if (CURRENT_CHAIN === 'kovan') {
      return (
        <div>
          <h5>Parity</h5>
          <ul>
            <li>Install <a target='_blank' href='https://github.com/paritytech/parity/releases'>Parity</a></li>
            <li>Start parity by opening a terminal and running 'parity ui --no-warp --chain=kovan'</li>
            <li>Open the parity ui interface in your browser at <a href='http://127.0.0.1:8180'>http://127.0.0.1:8180</a></li>
            <li>In the parity UI Open the parity browser at <a href='http://127.0.0.1:8180/#/web'>http://127.0.0.1:8180/#/web</a></li>
            <li>In the parity browser enter the follwing url <a href={ currentLocation }>{ currentLocation }</a></li>
          </ul>
        </div>
      )
    }
  }
}
