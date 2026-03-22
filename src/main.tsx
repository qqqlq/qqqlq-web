import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from "@/components/ui/provider"
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider defaultTheme="dark">
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
