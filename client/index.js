import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App'
import './index.css'

window.addEventListener('load', function () {
  render(App)
})

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default
    render(NewApp)
  })
}

function render (NewApp) {
  ReactDOM.render(
    <AppContainer>
      <NewApp />
    </AppContainer>,
    document.getElementById('root')
  )
}
