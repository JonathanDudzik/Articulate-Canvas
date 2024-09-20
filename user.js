window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  // Loads and array of scripts should be called in InitUserScripts
  function scriptLoader(setVar, scriptUrls = [
    "https://cdn.babylonjs.com/babylon.js", // Load Babylon.js first
    "https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.js" // Load glTF loader last
  ]) {
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
    
    loadScriptsSequentially(scriptUrls)
    .then(() => {
      console.log('All scripts loaded successfully');
      setVar("scriptsLoading", "False");
      })
      .catch(error => {
        console.error('Error loading scripts:', error);
      });
  }

  // AssetManager Class: Responsible for loading assets into the scene
  class AssetManager {
    async loadAsset(assetUrl, scene) {
      console.log("Loading asset from:", assetUrl);
      await BABYLON.SceneLoader.AppendAsync("", assetUrl, scene);
    }
  }
  window.assetManager = AssetManager; // Assigning AssetManager to window

  // CanvasManager Class: Responsible for finding the canvas element on a side that contains a Storyline 360 image
  class CanvasManager {
    constructor() {
      this.canvasElement = null;
    }

    static prepareCanvasElement() {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        console.log('Running Storyline in preview mode within an iframe');
        const canvasOrigin = window.top.document.querySelector('iframe').contentDocument.querySelector('[id^="three-canvas"]');
        canvasOrigin.id = 'renderCanvas';
        this.canvasElement = window.top.document.querySelector('iframe').contentDocument.getElementById('renderCanvas');
      } else {
        const canvasOrigin = document.querySelector('[id^="three-canvas"]');
        canvasOrigin.id = 'renderCanvas';
        this.canvasElement = document.getElementById('renderCanvas');
      }

      return this.canvasElement;
    }
  }
  window.canvasManager = CanvasManager; // Assigning CanvasManager to window

  // CustomLoadingScreen Class: Used to hide the Storyline loading screen when the scene's render loops start
  class CustomLoadingScreen {
    constructor(setVar) {
      this.setVar = setVar;
    }

    displayLoadingUI() {
      console.log("sceneLoading set to True");
      // Simulating the storyline behavior
    }

    hideLoadingUI() {
      console.log("customLoadingScreen loaded removing loading screen");
      this.setVar("sceneLoading", "False");
    }
  }
  window.customLoadingScreen = CustomLoadingScreen; // Assigning CustomLoadingScreen to window

  // EngineManager Class: Responsible for managing the engine and its lifecycle
  class EngineManager {
    constructor() {
      this.engine = null;
    }

    createEngine(canvasElement, setVar) {
      this.engine = new BABYLON.Engine(canvasElement, true);
      var loadingScreen = new CustomLoadingScreen(setVar);
      this.engine.loadingScreen = loadingScreen;
      this.engine.displayLoadingUI();
      return this.engine;
    }

    startRenderLoop(scene) {
      this.engine.runRenderLoop(function () {
        scene.render();
      });

      window.addEventListener("resize", () => {
        this.engine.resize();
      });
    }
  }
  window.engineManager = EngineManager; // Assigning EngineManager to window

  // CameraManager Class: Responsible for managing camera creation and movement
  class CameraManager {
    constructor() {
      this.camera = null;
    }

    createCamera(scene, canvasElement) {
      this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 200, BABYLON.Vector3.Zero(), scene);
      this.camera.attachControl(canvasElement, true);
      return this.camera;
    }

    moveCamera(alpha, beta, radius, duration = 1) {
      if (!this.camera) return;

      gsap.to(this.camera, {
        duration,               // Duration of the animation in seconds
        alpha,                  // Target alpha value (180 degrees)
        beta,                   // Target beta value (30 degrees)
        radius,                 // Defines distance from target
        ease: "power2.inOut",   // Easing function
      });
    }
  }
  window.cameraManager = new CameraManager(); // Assigning CameraManager to window

  // SceneManager Class: Responsible for creating the scene, adding lights, and meshes
  class SceneManager {
    constructor() {
      this.scene = null;
    }

    createScene(engine) {
      this.scene = new BABYLON.Scene(engine);
      new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
      return this.scene;
    }

    addMeshClickListener(meshes, player) {
      meshes.forEach(mesh => {
        mesh.actionManager = new BABYLON.ActionManager(this.scene);
        mesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (event) {
            console.log(`Mesh ${mesh.name} clicked!`);
            player.SetVar("buttonCounter", "8");
            console.log("Storyline state changed!");
          })
        );
      });
    }
  }
  window.sceneManager = SceneManager; // Assigning SceneManager to window

  // Main Application Class
  class MySceneApp {
    constructor(canvasElement) {
      this.canvasElement = canvasElement;
      this.engineManager = new window.engineManager();
      this.sceneManager = new window.sceneManager();
      this.cameraManager = window.cameraManager; // Instance of this class was instantiated previously and assigned to the global window obeject
      this.assetManager = new window.assetManager();
      this.assetUrl = "https://assetsblobstoragepublic.blob.core.windows.net/asset-blob/earth/scene.gltf";
    }

    async createScene(setVar) {
      const engine = this.engineManager.createEngine(this.canvasElement, setVar);
      const scene = this.sceneManager.createScene(engine);

      await this.assetManager.loadAsset(this.assetUrl, scene);

      this.cameraManager.createCamera(scene, this.canvasElement);
      this.cameraManager.moveCamera(Math.PI / 2, Math.PI / 4, 35);

      this.engineManager.startRenderLoop(scene);

      scene.executeWhenReady(() => {
        console.log("Scene is ready!");
        engine.hideLoadingUI();
      });
    }
  }
  window.mySceneApp = MySceneApp; // Assigning MySceneApp to window
  
  scriptLoader(setVar);
}

window.Script2 = function()
{
    // prepareCanvasElement is a static method (i.e. no need to instantiate class) and needs done slide-by-slide
  const canvasElement =  window.canvasManager.prepareCanvasElement();
  console.log("canvas element ready:", canvasElement);

  console.log("Creating scene")
  mySceneApp = new window.mySceneApp(canvasElement);
  mySceneApp.createScene(setVar)
}

window.Script3 = function()
{
  const alpha = 3.1915
const beta = 1.0225
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)

}

window.Script4 = function()
{
  const alpha = 1.9246
const beta = 1.5811
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)

}

window.Script5 = function()
{
  const alpha = -0.2218
const beta = 0.9359
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)

}

window.Script6 = function()
{
  const alpha = 0.5272
const beta = 1.8961
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)
}

window.Script7 = function()
{
  const alpha = 2.5405
const beta = 3.1316
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)

}

window.Script8 = function()
{
  const alpha = 1.9249
const beta = 0.7537
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)
}

window.Script9 = function()
{
  const alpha = 3.9908
const beta = 1.9112
const radius= 35
cameraManager.moveCamera(alpha, beta, radius)
}

window.Script10 = function()
{
  const alpha = Math.PI / 2
const beta = Math.PI / 4
const radius= 70
cameraManager.moveCamera(alpha, beta, radius)
}

};
