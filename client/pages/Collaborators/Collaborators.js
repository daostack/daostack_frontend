import React, { Component } from 'react'
import { Row, Col, Card, CardImg, CardBlock, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import FontAwesome from 'react-fontawesome'
import './Collaborators.css'

export default class Collaborators extends Component {
  render () {
    return (
      <div>
        <h1>Collaborators</h1>
        <p>DAOstack is being developed by a group of passionate indaviduals who beleive in an open eco-system of collaboration</p>
        <p>These are some of the people who have contributed to the vision so far:</p>
        <br />
        <Row>
          <Col className='text-center'>
            <h6>Matan Field</h6>
            <img className='collaborator-photo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/matan-650-650.jpg' alt='Matan Field' />
            <br />
            <a href='https://il.linkedin.com/in/matan-field-92a2b396' target='_blank'><FontAwesome name='linkedin' /></a>
            &nbsp;&nbsp;&nbsp;
            <a href='https://github.com/fmatan' target='_blank'><FontAwesome name='github' /></a>
          </Col>
          <Col className='text-center'>
            <h6>Adam Levi</h6>
            <img className='collaborator-photo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/adam-2.jpg' alt='Adam Levi' />
            <br />
            <a href='https://www.linkedin.com/in/adam-levi-3bb5164/' target='_blank'><FontAwesome name='linkedin' /></a>
            &nbsp;&nbsp;&nbsp;
            <a href='https://github.com/leviadam' target='_blank'><FontAwesome name='github' /></a>
          </Col>
          <Col className='text-center'>
            <h6>Elan Perach</h6>
            <img className='collaborator-photo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/elan-with-saturation.jpg' alt='Elan Perach' />
            <br />
            <a href='https://www.linkedin.com/in/elanperach/' target='_blank'><FontAwesome name='linkedin' /></a>
            &nbsp;&nbsp;&nbsp;
            <a href='https://github.com/elanperach' target='_blank'><FontAwesome name='github' /></a>
          </Col>
          <Col className='text-center'>
            <h6>Yaron Velner</h6>
            <img className='collaborator-photo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/yaron-velner.jpg' alt='Yaron Velner' />
            <br />
            <a href='https://www.linkedin.com/in/yaron-velner-7a8aa4107/' target='_blank'><FontAwesome name='linkedin' /></a>
            &nbsp;&nbsp;&nbsp;
            <a href='https://github.com/yaronvel' target='_blank'><FontAwesome name='github' /></a>
          </Col>
          <Col className='text-center'>
            <h6>Jelle Gerbrandy</h6>
            <img className='collaborator-photo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/jelle.jpg' alt='Jelle Gerbrandy' />
            <br />
            <a href='https://www.linkedin.com/in/jelle-gerbrandy-4aa2b25/' target='_blank'><FontAwesome name='linkedin' /></a>
            &nbsp;&nbsp;&nbsp;
            <a href='https://github.com/jellegerbrandy' target='_blank'><FontAwesome name='github' /></a>
          </Col>
          <Col className='text-center'>
            <h6>Adam Goldman</h6>
            <img className='collaborator-photo' src='https://s3-eu-west-1.amazonaws.com/daostack/images/adam-goldman.jpg' alt='Adam Goldman' />
            <br />
            <a href='https://www.linkedin.com/in/adam-goldman-7a463166/' target='_blank'><FontAwesome name='linkedin' /></a>
            &nbsp;&nbsp;&nbsp;
            <a href='https://github.com/goldylucks' target='_blank'><FontAwesome name='github' /></a>
          </Col>
        </Row>
      </div>
    )
  }
}
