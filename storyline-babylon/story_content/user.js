window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve(url); // Resolve when the script loads
    script.onerror = () => reject(new Error(`Failed to load script ${url}`)); // Reject if there's an error
    document.head.appendChild(script);
  });
}

async function loadScriptsSequentially(scriptUrls) {
  for (const url of scriptUrls) {
    await loadScript(url); // Load each script sequentially
  }
}

const scriptUrls = [
  "https://cdn.babylonjs.com/babylon.js", // Load Babylon.js first
  // "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js", // Load loaders after Babylon.js
  "https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.js" // Load glTF loader last
];

loadScriptsSequentially(scriptUrls)
  .then(() => {
    console.log('All scripts loaded successfully');
    myScene.createScene(); // Proceed to create the scene
  })
  .catch(error => {
    console.error('Error loading scripts:', error);
  });

// function loadAssets(assetUrls) {
//   // Create an array of promises for each asset URL
//   const promises = assetUrls.map(url => {
//     return new Promise((resolve, reject) => {
//       // Fetch the asset using the Fetch API
//       fetch(url)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`Failed to load asset ${url}: ${response.statusText}`);
//           }
//           return response.arrayBuffer(); // Assuming you're fetching binary data like a model
//         })
//         .then(data => {
//           // Resolve the promise with the fetched data
//           resolve({ url, data });
//         })
//         .catch(error => {
//           // Reject the promise in case of error
//           reject(error);
//         });
//     });
//   });

//   // Return a single promise that resolves when all assets are loaded
//   return Promise.all(promises);
// }

function prepareCanvasElement() {
  const iframe = document.querySelector('iframe');
  let canvas
  if (iframe) {
    console.log('Running Storyline in preview mode within an iframe');
    const canvasOrigin = window.top.document.querySelector('iframe').contentDocument.querySelector('[id^="three-canvas"]');
    canvasOrigin.id = 'renderCanvas'
    canvas = window.top.document.querySelector('iframe').contentDocument.getElementById('renderCanvas')
  } else {
    const canvasOrigin = document.querySelector('[id^="three-canvas"]');
    canvasOrigin.id = 'renderCanvas'
    canvas = document.getElementById('renderCanvas')
  }

  console.log("Canvas element ready:", canvas)
  return canvas
}

const myScene = {
  engine: null,
  scene: null,
  assetUrl: "https://assetsblobstoragepublic.blob.core.windows.net/asset-blob/earth/scene.gltf",
  canvasElement: prepareCanvasElement(),
  async createScene() {
    console.log("Creating Scene with this asset:", this.assetUrl)
    const engine = new BABYLON.Engine(this.canvasElement, true);
    const scene = new BABYLON.Scene(engine);
    this.engine = engine
    this.scene = await BABYLON.appendSceneAsync(this.assetUrl, scene);

    // Create a camera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(this.canvasElement, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // UNCOMMENT TO ENABLE DEBUGGER
    // scene.debugLayer.show();

    // can you just extend the toframe of the animation to match the sctill pos
    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });

    
    return new Promise((resolve, reject) => {
      console.log("handle done loading")
      player.SetVar("loadingVideoState","hidden");
      resolve()
    });
  },
};

// (async () => {
//   await myScene.createScene(); // this scene must be available before doing anything with the scene
// })();
}

};
