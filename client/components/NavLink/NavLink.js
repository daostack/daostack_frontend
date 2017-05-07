import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class NavLink extends Component {
  static propTypes = {
    to: PropTypes.string,
    children: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  render () {
    const isActive = this.context.router.isActive(this.props.to, true)
    const className = isActive ? 'nav-item active' : 'nav-item'

    return (
      <li className={ className }>
        <Link className='nav-link' { ...this.props }>{ this.props.children }</Link>
      </li>
    )
  }
}
