// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" data-theme="dracula">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>IBG Membership</title>
          <meta name="description" content="Gym membership manager for Indy Boxing and Grappling" />
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link rel="icon" href="/logo.svg" sizes="any" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
          <meta name="theme-color" content="#ffffff" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
