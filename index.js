import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* This AuthProvider wrapper makes login/logout available everywhere */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

