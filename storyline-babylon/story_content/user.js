window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  const myScene = {
  engine: null,
  scene: null,
  camera: null,
  assetUrl: "https://assetsblobstoragepublic.blob.core.windows.net/asset-blob/earth/scene.gltf",
  canvasElement: prepareCanvasElement(),
  // Can you make this function in scope for the other slides?
  moveCamera(camera, alpha, beta, radius, duration = 1) {
    gsap.to(camera, {
      duration,               // Duration of the animation in seconds
      alpha,                  // Target alpha value (180 degrees)
      beta,                   // Target beta value (30 degrees)
      radius,                 // Defines distance from target
      ease: "power2.inOut",   // Easing function
    });
  },
  async createScene(loadingScreen) {
    console.log("Creating scene with this asset:", this.assetUrl)

    // Create engine
    const engine = new BABYLON.Engine(this.canvasElement, true);
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();
    
    // Create scene and append asset
    // this is wierd. maybe try this.scene = new BABYLON.scene... and then this.scene for the appendSceneAsync
    const scene = new BABYLON.Scene(engine);
    await BABYLON.appendSceneAsync(this.assetUrl, scene);

    // Create a camera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 200, BABYLON.Vector3.Zero(), scene);
    this.moveCamera(camera, Math.PI / 2, Math.PI / 4, 35);
    camera.attachControl(this.canvasElement, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // UNCOMMENT TO ENABLE DEBUGGER
    // scene.debugLayer.show();
    
    // Assuming your model has multiple meshes, you can iterate through them
    scene.meshes.forEach(mesh => {
        // Add click listener to each mesh
        mesh.actionManager = new BABYLON.ActionManager(scene);

        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (event) => {
                console.log(`Mesh ${mesh.name} clicked!`);

                const player = GetPlayer(); // Get Storyline player object
                player.SetVar("buttonCounter", "8"); // Sets Storyline variable to a new state
        
                console.log("Storyline state changed!");
            })
        );
    });

    // can you just extend the toframe of the animation to match the sctill pos
    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });

    scene.executeWhenReady(() => {
      console.log("handle done loading")
      engine.hideLoadingUI();
      this.engine = engine
      this.scene = scene
      this.camera = camera
    });

    return new Promise((resolve, reject) => {
      resolve()
    });
  },
};


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
  "https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.js" // Load glTF loader last
];

loadScriptsSequentially(scriptUrls)
  .then(() => {
    console.log('All scripts loaded successfully');
    var loadingScreen = new customLoadingScreen();
    myScene.createScene(loadingScreen); // Proceed to create the scene
    window.babylonScene = myScene
  })
  .catch(error => {
    console.error('Error loading scripts:', error);
  });

function customLoadingScreen() {
    console.log("customLoadingScreen creation")
}
customLoadingScreen.prototype.displayLoadingUI = function () {
    console.log("customLoadingScreen loading")
};
customLoadingScreen.prototype.hideLoadingUI = function () {
    console.log("customLoadingScreen loaded removing loading sceen")
    player.SetVar("loadingVideoState","hidden");
};

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


}

window.Script2 = function()
{
  console.log("button 1")
window.babylonScene.cameras[0].fov = 1
}

window.Script3 = function()
{
  console.log("button 2")
window.babylonScene.cameras[0].fov = 0.9
}

window.Script4 = function()
{
  console.log("button 3")
window.babylonScene.cameras[0].fov = 0.8
}

window.Script5 = function()
{
  console.log("button 4")
window.babylonScene.cameras[0].fov = 0.7
}

window.Script6 = function()
{
  console.log("button 5")
window.babylonScene.cameras[0].fov = 0.5
}

window.Script7 = function()
{
  console.log("button 6")
window.babylonScene.cameras[0].fov = 0.4
}

window.Script8 = function()
{
  console.log("button 7")
window.babylonScene.cameras[0].fov = 0.3
}

window.Script9 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = 3.1915
const beta = 1.0225
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script10 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = 1.9246
const beta = 1.5811
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script11 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = -0.2218
const beta = 0.9359
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script12 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = 0.5272
const beta = 1.8961
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script13 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = 2.5405
const beta = 3.1316
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script14 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = 1.9249
const beta = 0.7537
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script15 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = 3.9908
const beta = 1.9112
const radius= 35
babylonScene.moveCamera(camera, alpha, beta, radius)

}

window.Script16 = function()
{
  console.log("buttonCounter set to:", player.GetVar("buttonCounter"));
// babylonScene is available through the (implicit) global window object
const camera = babylonScene.camera
const alpha = Math.PI / 2
const beta = Math.PI / 4
const radius= 70
babylonScene.moveCamera(camera, alpha, beta, radius)

}

};
