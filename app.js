import OBSWebSocket from "obs-websocket-js";
var obs = new OBSWebSocket();

const AlertCorrectGuess = async () => {
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      "ws://127.0.0.1:4444",
      "salainen",
      {
        rpcVersion: 1,
      }
    );
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    );
    await obs.call("SetCurrentProgramScene", { sceneName: "Scene 2" });

    // Both together now
let  {sceneItemId}  = await obs.call("GetSceneItemId", { sceneName: "Scene 2", sourceName: "Display Capture 2" });
console.log(sceneItemId);
await obs.call("SetSceneItemEnabled", { sceneName: "Scene 2", sceneItemId: sceneItemId, sceneItemEnabled: true });

await new Promise(r => setTimeout(r, 6000));
await obs.call("SetSceneItemEnabled", { sceneName: "Scene 2", sceneItemId: sceneItemId, sceneItemEnabled: false });
} catch (error) {
    console.error("Failed to connect", error.code, error.message);
  }
};

export default AlertCorrectGuess;
