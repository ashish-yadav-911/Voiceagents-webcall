const fs = require("fs").promises;
const Retell = require("retell-sdk");

// Retrieving environment variables
const apiKey = process.env.API_KEY;
// const agentId = process.env.AGENT_ID;

// Setting default values
const audioEncoding = "s16le";
const audioWebsocketProtocol = "web";
const sampleRate = 24000;

// Initializing Retell client
const retellClient = new Retell({
  apiKey: apiKey,
});

//------------------------------------Register call function ------------------------------------
const registerCall = async (agentId) => {
  try {
    const registerCallResponse = await retellClient.call.register({
      agent_id: agentId,
      audio_encoding: audioEncoding,
      audio_websocket_protocol: audioWebsocketProtocol,
      sample_rate: sampleRate,
    });
    return registerCallResponse;
  } catch (error) {
    console.error("Error registering call:", error);
    throw error;
  }
};

const findAgentId = async (id) => {
  try {
    let agentId;
    switch (id) {
      case 1:
        agentId = "dfa3f8837f46b19d2c29bfb30bec8e26";
        break;
      case 2:
        agentId = "ef0d804d354700f0be5e9ec408cce617";
        break;
      case 3:
        agentId = "8b84658158b8cb84509f239826ddeef7";
        break;
      case 4:
        agentId = "ce778078c63ca2e2e03cf42e0b0dfa08";
        break;
      case 5:
        agentId = "8f86cbead954181be14a22f7396422af";
        break;
      case 6:
        agentId="agent_5383fe00b20e7a0ab3ff4560de";
        break;
      case 7:
        agentId="agent_e733b755eb1f2837cd22d87c42";
        break;
      default:
        throw new Error("Invalid agent ID");
    }
    if (agentId) {
      const regisResp = await registerCall(agentId);
      return regisResp;
    } else {
      throw new Error("Agent ID not found");
    }
  } catch (error) {
    console.error("Error finding agent ID:", error);
    throw error;
  }
};

//------------------------------------Start conversation API's function--------------------------
const gettingCallingData = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const regisResp = await findAgentId(numericId);
      res.status(200).json({
        message: "Register call successfully",
        data: regisResp,
      });
    } catch (err) {
      console.error("Error registering call:", err);
      res.status(500).json({ error: "Error registering call" });
    }
  } catch (err) {
    console.error("Error starting conversation:", err);
    res.status(500).json({ error: "Error starting conversation" });
  }
};

module.exports = {
  gettingCallingData,
};
