# Installation

1. cp .env.example .env
2. npm install -g @ionic/cli
3. npm install -g electron
4. npm install
5. For reload/development - npm run dev
6. For production build - npm run build

**NOTE:** In order to use any other hostname instead of 'localhost' you have to change it in authentication-service's UserConfig table for all other edge-node apps that are being directly accessed from the browser
(drag_endpoint, edge_node_backend_endpoint). You also need to change `VITE_AUTH_SERVICE_ENDPOINT` in .env to use the desired hostname.
 
The reason for this is the fact that we are using cookies for authentication and the cookie in browser is tied to a specific domain
(precisely, domain/hostname on which the authentication-service is accessed when logging in) 
