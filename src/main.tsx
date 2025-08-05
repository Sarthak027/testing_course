import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupRealtimeSubscriptions } from './utils/storage';

// Initialize real-time subscriptions
setupRealtimeSubscriptions();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
