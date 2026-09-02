import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Head } from '@tanstack/react-start';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Devocional App' },
    ],
  }),
  component: () => (
    <html lang="pt-BR">
      <head>
        <Head />
      </head>
      <body>
        <Outlet />
        <TanStackRouterDevtools />
      </body>
    </html>
  ),
});