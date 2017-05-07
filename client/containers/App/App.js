import React, { Component, PropTypes } from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default class AppContainer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
      DAOstack: PropTypes.object,
    }),
    children: PropTypes.object.isRequired,
  }

  render () {
    return (
      <div>
        { this.renderNavBar() }
        <div className='container-fluid'>
          <br />
          { this.props.children }
        </div>
        <Footer />
      </div>
    )
  }

  renderNavBar () {
    const { web3, DAOstack } = this.props.route
    if (web3 && DAOstack) {
      return (<NavBar web3={ web3 } DAOstack={ DAOstack } />)
    }
  }
}
