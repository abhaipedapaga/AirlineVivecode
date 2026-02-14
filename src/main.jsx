import './index.css'

// main entry point: CSS imported so Tailwind can be processed by Vite/PostCSS
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { AppProviders } from './app/providers';
import { router } from './app/router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
);
