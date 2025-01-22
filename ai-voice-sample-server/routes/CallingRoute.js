const express = require("express");
const CallingRouter = express.Router();

const { gettingCallingData } = require("../controllers/VoipAgent");

CallingRouter.get("/startCall:id", gettingCallingData);

module.exports = CallingRouter;
