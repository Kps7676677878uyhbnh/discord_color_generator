import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import App from './App.jsx';
// import App from '../App.jsx';
import '@mantine/core/styles.css'; // Mantine's global styles

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>
);
