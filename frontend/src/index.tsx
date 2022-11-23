import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'
import { persistor, persistedStore } from './store'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <Provider store={persistedStore}>
      <PersistGate loading={null} persistor={persistor}>
       <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
