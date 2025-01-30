const express = require("express");
const CallingRouter = express.Router();

const { gettingCallingData } = require("../controllers/VoipAgent");

CallingRouter.post("/startCall", gettingCallingData);

module.exports = CallingRouter;
