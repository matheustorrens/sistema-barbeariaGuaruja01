import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import App from './App';
import { DashboardApp } from './dashboard/DashboardApp';
import { LoginPage } from './dashboard/LoginPage';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                element={<App />} />
          <Route path="/dashboard/login" element={<LoginPage />} />
          <Route path="/dashboard/*"     element={<DashboardApp />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  </React.StrictMode>,
);