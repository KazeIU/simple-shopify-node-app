# Getting Started 

Step 1: Refer to the the env [example](https://github.com/KazeIU/shopify-embedded-app/blob/master/.env.example) and fill in the variables 

Step 2: Open an [Ngrok Tunnel](https://dashboard.ngrok.com/get-started/setup)

- `ngrok http 3000 -host-header="localhost:3000"`  

Step 3: Start the Node Express server and the React frontend concurrently from the top directory

- `npm run dev`

Step 4: Visit the local auth route to install the app and get authorized to make the API requests

- `http://localhost:5000/auth?shop=your-development-shop.myshopify.com`


The API requests from the client-side will be proxied to the API on the server-side. 

- `Client side: Port 3000`
- `Server side: Port 5000`


