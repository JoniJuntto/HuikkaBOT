import OBSWebSocket from "obs-websocket-js";
import fs from "fs";
var obs = new OBSWebSocket();

const AlertCorrectGuess = async (user) => {
  fs.writeFile("user.txt", user, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });

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

    // Both together now
/*     let { sceneItemId } = await obs.call("GetSceneItemId", {
      sceneName: "Scene",
      sourceName: "Image",
    });
    console.log(sceneItemId); */

     await obs.call("SetSceneItemEnabled", {
      sceneName: "Scene",
      sceneItemId: 8,
      sceneItemEnabled: true,
    });
     await obs.call("SetSceneItemEnabled", {
      sceneName: "Scene",
      sceneItemId: 5,
      sceneItemEnabled: true,
    });

    await obs.call("SetSceneItemEnabled", {
      sceneName: "Scene",
      sceneItemId: 6,
      sceneItemEnabled: true,
    });

    await new Promise((r) => setTimeout(r, 6000));
    await obs.call("SetSceneItemEnabled", {
      sceneName: "Scene",
      sceneItemId: 8,
      sceneItemEnabled: false,
    });
        await obs.call("SetSceneItemEnabled", {
      sceneName: "Scene",
      sceneItemId: 5,
      sceneItemEnabled: false,
    });
    await obs.call("SetSceneItemEnabled", {
      sceneName: "Scene",
      sceneItemId: 6,
      sceneItemEnabled: false,
    }); 
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
  }
};

export default AlertCorrectGuess;
