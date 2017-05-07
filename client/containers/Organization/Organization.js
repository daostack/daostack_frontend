import React, { Component, PropTypes } from 'react'
import { Container, Row, Col } from 'reactstrap'
import SideBar from '../../components/SideBar'

export default class OrganizationContainer extends Component {
  static propTypes = {
    route: PropTypes.shape({
      web3: PropTypes.object,
    }),
    children: PropTypes.object.isRequired,
  }

  render () {
    const web3 = this.props.route.web3
    const orgAddress = this.props.params.orgAddress
    return (
      <div>
        <Row>
          <Col xs='3'>
            <SideBar orgAddress={ orgAddress } />
          </Col>
          <Col xs='9'>
            { this.props.children }
          </Col>
        </Row>
      </div>
    )
  }
}
