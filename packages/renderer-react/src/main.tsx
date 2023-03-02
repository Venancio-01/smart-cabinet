import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { StyledEngineProvider } from '@mui/material/styles';
import '@/assets/styles/index.css'
import '@/assets/styles/preflight.css'
import '@/assets/styles/tailwind.css'

import Index from '@/pages/index';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <StyledEngineProvider>
      <Index />
    </StyledEngineProvider>
  </StrictMode>
);
