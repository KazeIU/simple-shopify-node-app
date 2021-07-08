import "@babel/polyfill";
import "isomorphic-fetch";

import { Shopify, ApiVersion } from "@shopify/shopify-api";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import cookie from "cookie";
import querystring from "querystring";
import request from "request-promise";

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

    const redirectUri = "https://" + HOST_NAME + "/auth/callback";
    const installUrl = "https://" + SHOP +
      "/admin/oauth/authorize?client_id=" + API_KEY +
      "&scope=" + SCOPES +
      "&state=" + state +
      "&redirect_uri=" + redirectUri;

    res.cookie('state', state);
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
