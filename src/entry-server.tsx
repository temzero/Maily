// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { APP_NAME } from "./data/constants";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{APP_NAME}</title>
          <link rel="icon" type="image/svg+xml" href="/logo.svg" />
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
