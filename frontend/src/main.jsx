import { MotionConfig, motion } from 'framer-motion';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App.jsx';
import StoreProvider from './store/provider.jsx';
import theme from './theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MotionConfig transition={{ duration: 0.15, ease: 'easeInOut' }} reducedMotion="user">
            <CssBaseline />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', minHeight: '100vh' }}>
              <App />
            </motion.div>
          </MotionConfig>
        </ThemeProvider>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
