import "@babel/polyfill";
import "isomorphic-fetch";

import { Shopify, ApiVersion } from "@shopify/shopify-api";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import cookie from "cookie";
import querystring from "querystring";
import axios from "axios";

import cron from "node-cron";
import middleEarthNames from "middleearth-names";

const nonce = require("nonce")();

const app = express();
const port = process.env.PORT || 5000;

const { API_KEY, API_SECRET_KEY, HOST_NAME, SCOPES, SHOP } = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES,
  HOST_NAME,
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

app.get("/express_backend", (req, res) => {
  res.send({ express: "EXPRESS BACKEND IS CONNECTED" });
});

app.get("/auth", (req, res) => {
  const shop = req.query.shop;

  if (shop) {
    const state = nonce();

    const redirectUri = "http://localhost:" + port + "/auth/callback";
    const installUrl = "https://" + SHOP +
      "/admin/oauth/authorize?client_id=" + API_KEY +
      "&scope=" + SCOPES +
      "&state=" + state +
      "&redirect_uri=" + redirectUri;

    res.cookie("state", state);
    res.redirect(installUrl);
  } else {
    return res
      .status(400)
      .send( "Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request");
  }
});

app.get("/auth/callback", (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    const map = Object.assign({}, req.query);
    delete map["signature"];
    delete map["hmac"];
    const message = querystring.stringify(map);
    const generatedHash = crypto
      .createHmac("sha256", API_SECRET_KEY)
      .update(message)
      .digest("hex");

    if (generatedHash !== hmac) {
      return res.status(400).send("HMAC validation failed");
    }

    const accessTokenRequestUrl = "https://" + SHOP + "/admin/oauth/access_token";
    const accessTokenPayload = {
      client_id: API_KEY,
      client_secret: API_SECRET_KEY,
      code,
    };

    axios
      .post(accessTokenRequestUrl, accessTokenPayload)
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.data.access_token;

        const shopRequestUrl = "https://" + SHOP + "/admin/api/2021-07/products/6888162295975.json";

        const shopRequestHeaders = {
          "X-Shopify-Access-Token": accessToken,
        };
        
        cron.schedule('0 * * * *', () => {
          const titleUpdate = {
            "product": {
              "id": 6888162295975,
              "title": `Short Sleeve ${middleEarthNames.random()} T-shirt`
            }
          };

          axios
            .put(shopRequestUrl, titleUpdate, { headers: shopRequestHeaders })
            .then((shopResponse) => {
              console.log(`Title successfully updated to: "${shopResponse.data.product.title}"`);
            })
            .catch((error) => {
              if (error.response) {
                res.status(error.response.status).send(error.message);
              } else if (error.request) {
                console.log('Error: ', error.request);
              } else {
                console.log('Error: ', error.message);
              }
            });
        });
      })
      .catch((error) => {
        if (error.response) {
          res.status(error.response.status).send(error.message);
        } else if (error.request) {
          console.log('Error: ', error.request);
        } else {
          console.log('Error: ', error.message);
        }
      });
  } else {
    res.status(400).send("Required parameters missing");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
