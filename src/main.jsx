import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { setupAuthStateListener } from './store/authSlice'
import App from './App.jsx'
import './index.css'

// Setup auth state listener
setupAuthStateListener(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
