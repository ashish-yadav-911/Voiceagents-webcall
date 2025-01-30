const fs = require("fs").promises;
const axios = require("axios");

// Retrieving environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing! Set it in your environment variables.");
}

//------------------------------------Register call function ------------------------------------
const registerCall = async (agentId) => {
  try {
    // console.log("Registering call for agentId:", agentId);

    const response = await axios.post(
      "https://api.retellai.com/v2/create-web-call",
      { agent_id: agentId },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Register Call API Response:", response.data);
    return response.data; // Ensure you're returning only the response data
  } catch (error) {
    console.error(
      "Error registering call:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

//------------------------------------Find Agent ID Function ------------------------------------
const findAgentId = async (id) => {
  try {
    let agentId = id;
    // switch (id) {
    //   case 1:
    //     agentId = "dfa3f8837f46b19d2c29bfb30bec8e26";
    //     break;
    //   case 2:
    //     agentId = "ef0d804d354700f0be5e9ec408cce617";
    //     break;
    //   case 3:
    //     agentId = "8b84658158b8cb84509f239826ddeef7";
    //     break;
    //   case 4:
    //     agentId = "ce778078c63ca2e2e03cf42e0b0dfa08";
    //     break;
    //   case 5:
    //     agentId = "8f86cbead954181be14a22f7396422af";
    //     break;
    //   case 6:
    //     agentId = "agent_5383fe00b20e7a0ab3ff4560de";
    //     break;
    //   case 7:
    //     agentId = "agent_e733b755eb1f2837cd22d87c42";
    //     break;
    //   default:
    //     throw new Error("Invalid agent ID");
    // }

    // console.log("Mapped ID to agentId:", agentId);

    if (agentId) {
      const regisResp = await registerCall(agentId);
      return regisResp;
    } else {
      throw new Error("Agent ID not found");
    }
  } catch (error) {
    console.error("Error finding agent ID:", error.message);
    throw error;
  }
};

//------------------------------------Start Conversation API Function--------------------------
const gettingCallingData = async (req, res) => {
  try {
    const { agent_id } = req.body;
    console.log(agent_id);

    // const numericId = parseInt(id, 10);

    // console.log("Received request with ID:", numericId);

    // if (isNaN(numericId)) {
    //   return res.status(400).json({ error: "Invalid ID format" });
    // }

    try {
      const regisResp = await findAgentId(agent_id);
      res.status(200).json({
        message: "Register call successfully",
        data: regisResp,
      });
    } catch (err) {
      console.error("Error registering call:", err.message);
      res.status(500).json({ error: "Error registering call" });
    }
  } catch (err) {
    console.error("Error starting conversation:", err.message);
    res.status(500).json({ error: "Error starting conversation" });
  }
};

module.exports = {
  gettingCallingData,
};
