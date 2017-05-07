import React, { Component } from 'react'
import { IndexLink } from 'react-router'
import FontAwesome from 'react-fontawesome'

import NavLink from '../../components/NavLink'
import './Footer.css'

export default class Footer extends Component {
  render () {
    return (
      <footer className='footer'>
        <div className='container-fluid'>
          <ul className='nav'>
            <li className='nav-item'>
              <IndexLink to='/' className='nav-link'><FontAwesome name='home' /> Home</IndexLink>
            </li>
            <NavLink to='about'><FontAwesome name='info' /> About</NavLink>
            <NavLink to='collaborators'><FontAwesome name='users' /> Collaborators</NavLink>
            <NavLink to='presale'><FontAwesome name='money' /> Presale</NavLink>

            <NavLink to='/'><FontAwesome name='book' /> Whitepaper</NavLink>

            <li className='nav-item'>
              <a className='nav-link active' href='https://github.com/daostack/daostack' target='_blank'>
                <FontAwesome name='github' /> Github
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='https://daostack.slack.com' target='blank'>
                <FontAwesome name='slack' /> Slack
              </a>
            </li>
          </ul>
        </div>
      </footer>
    )
  }
}
