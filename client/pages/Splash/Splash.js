import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Row, Col, Jumbotron, Button, Card, CardImg, CardBlock, CardTitle, CardSubtitle, CardText } from 'reactstrap';

export default class Splash extends Component {
  static propTypes = {
    route: PropTypes.shape({
      DAOstack: PropTypes.object,
    }),
  }

  state = (() => {
    return {
      daoStackAddresses: this.props.route.DAOstack,
    }
  })()

  render () {
    const daoStackAddress = this.state.daoStackAddresses.controller
    return (
      <div>
        <Jumbotron>
          <h1 className='display-5'>Welcome to DAOstack!</h1>
          <p className='lead'>The worlds first open eco-system of Decentralized Autonomous Organizations.</p>
          <hr className='my-2' />
          <p>DAOstack is an open source framework, DAO management platform & network of organizations, collaborators and investors that collaborate on the blockchain.</p>
          <p>* This is a demo to demonstrate the vision and a subset of features that will be available once the the platform is launched.</p>
          <p className='lead'>
            <Link to='about' className='btn btn-primary' >Learn More</Link>
          </p>
        </Jumbotron>
        <Row>
          <Col>
            <Card>
              <CardBlock>
                <CardTitle>Get Some ETH</CardTitle>
                <CardText>Before you can do anything you need some ETH. It is the only way can pay for the gas to perform transactions on the ethereum blockchain.</CardText>
                <Link to='faucet' className='btn btn-secondary' >Send me some test ETH</Link>
              </CardBlock>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBlock>
                <CardTitle>Stacks (STK)</CardTitle>
                <CardText>Stacks are the native token of the DAOstack network and you can get some by contributing ETH in DAOstack ICO.</CardText>
                <Link className='btn btn-secondary' to={ `/organization/${daoStackAddress}/ico` } >I want some Stacks!</Link>
              </CardBlock>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBlock>
                <CardTitle>Launch a DAO</CardTitle>
                <CardText>Use your freshly minted Stacks to forge a DAO; choose your cofounders and deploy it to the Ethereum blockchain!</CardText>
                <Link to='deploygenesis' className='btn btn-secondary' >Create a new DAO</Link>
              </CardBlock>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBlock>
                <CardTitle>Browse Index</CardTitle>
                <CardText>The DAOstack network includes an index of all organizations forged using the platform (including yours).</CardText>
                <Link to='organizations' className='btn btn-secondary' >Show me the index</Link>
              </CardBlock>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBlock>
                <CardTitle>Promote a DAO</CardTitle>
                <CardText>As part of the DAOstack business model, anyone can promote and organization in the DAO Index by "burning" some Stacks. </CardText>
                <Link to='organizations' className='btn btn-secondary' >Look for the 'Promote' Link</Link>
              </CardBlock>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
