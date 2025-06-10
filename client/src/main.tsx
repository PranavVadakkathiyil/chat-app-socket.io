import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast'

import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './context/chatProvider.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@chakra-ui/react/preset'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <ChatProvider>
    
    <Toaster/>
    <ChakraProvider value={system}>
    <App />
    </ChakraProvider>
  </ChatProvider>
  </BrowserRouter>
  
)
