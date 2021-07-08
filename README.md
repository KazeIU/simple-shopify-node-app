# Getting Started 

Step 1: Open an [Ngrok Tunnel](https://dashboard.ngrok.com/get-started/setup)

- `ngrok http 3000 -host-header="localhost:3000"`  

Step 2: Start Node Express server from the top directory

- `node index.js`

Step 3: Navigate to the client folder in the terminal and run: 

- `npm start`

The API requests from the client-side will be proxied to the API on the server-side. 

### Client side: Port 3000
### Server side: Port 5000


