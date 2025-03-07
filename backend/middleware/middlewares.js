module.exports.configureMiddleware = (app) => {
    const cors = require("cors");
    const session = require("express-session");
    const express = require("express");
    
    app.use(cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(session({
      secret: process.env.SESSION_SECRET || 'secretkey',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
  };