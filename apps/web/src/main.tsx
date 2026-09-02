import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start';
import { RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StartClient>
      <RouterProvider routeTree={routeTree} />
    </StartClient>
  </StrictMode>
);