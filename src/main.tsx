
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Force check for system dark mode on initial load
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const savedTheme = localStorage.getItem('theme') || systemTheme;
document.documentElement.classList.add(savedTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
