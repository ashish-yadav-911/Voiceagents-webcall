import React, { useEffect, useState } from "react";
import "./CallCompo.css";
import axios from "axios";
import { Buttons } from "./button";
import logo from "../logo-dashboard.png";
import { RetellWebClient } from "retell-client-js-sdk";

const apiURL = process.env.REACT_APP_NODE_API_URL;
const sdk = new RetellWebClient();

const startCall = async (regisResp) => {
  try {
    // First check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Audio is not supported in your browser");
    }

    // iOS Safari requires user interaction before allowing audio
    // Add specific constraints for iOS
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Ensure audio is properly initialized on iOS
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    await audioContext.resume();

    sdk.startConversation({
      callId: regisResp.call_id,
      sampleRate: regisResp.sample_rate,
      enableUpdate: false,
    });
  } catch (error) {
    console.error("Audio setup error:", error);
    if (error.name === "NotAllowedError") {
      window.alert(
        "Microphone access is required. Please enable it in your device settings and try again."
      );
    } else if (error.name === "NotFoundError") {
      window.alert(
        "No microphone found. Please ensure your device has a working microphone."
      );
    } else {
      window.alert(`Failed to start call: ${error.message}`);
    }
  }
};

function CallComponent() {
  const [CallStart, setStartCall] = useState(0);
  const [buttons, setButtons] = useState(Buttons);
  const [isAnyToggleFalse, setIsAnyToggleFalse] = useState(false);

  useEffect(() => {
    const anyFalse = buttons.some((btn) => btn?.toggle === false);
    setIsAnyToggleFalse(anyFalse);
  }, [buttons]);

  sdk.on("conversationStarted", () => {
    const updatedButtons = buttons.map((item) => {
      if (item.id === CallStart) {
        return { ...item, toggle: false };
      }
      return item;
    });
    setButtons(updatedButtons);
  });

  sdk.on("conversationEnded", () => {
    const updatedButtons = buttons.map((item) => {
      if (item.id === CallStart) {
        return { ...item, toggle: true };
      }
      return item;
    });
    setButtons(updatedButtons);
  });

  sdk.on("error", (error) => {
    console.error("An error occurred:", error);
  });

  sdk.on("update", (update) => {
    console.log("update", update);
  });

  sdk.on("metadata", (metadata) => {
    console.log("metadata", metadata);
  });

  sdk.on("agentStartTalking", () => {});

  sdk.on("agentStopTalking", () => {});

  const EndCall = () => {
    sdk.stopConversation();
  };

  const ApiCallBasedOnFlag = async (flag) => {
    try {
      const response = await axios.post(`${apiURL}voiceAgent/startCall`, {
        agent_id: flag,
      });
      if (response.status === 200) {
        setStartCall(flag);
        startCall(response.data.data);
      } else {
        window.alert(response.data.message);
      }
    } catch (error) {
      window.alert(error);
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="container">
      <header className="SampleHeading">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
        <h1 className="AIvoice">AI Voice Samples</h1>
      </header>

      <main>
        {buttons?.map((btn) => (
          <div className="CallerHeading" key={btn?.id || btn?.name}>
            <div className="Content">
              <h2>{btn.name}</h2>
              <p>{btn.about}</p>
              <p className="ExamplePara">{btn?.exmaple}</p>
            </div>
            <div className="button-container">
              <button
                onClick={
                  btn?.toggle
                    ? () => ApiCallBasedOnFlag(btn?.id)
                    : () => EndCall()
                }
                className={`${btn.toggle ? "startCall" : "endCall"} ${
                  isAnyToggleFalse && btn?.toggle ? "disabledButton" : ""
                }`}
                disabled={isAnyToggleFalse && btn?.toggle}
              >
                {btn.toggle ? "Start Call" : "End Call"}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default CallComponent;
