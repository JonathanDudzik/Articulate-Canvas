window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  // In this function scope you have access to the following:
// var player = GetPlayer();
// var object = player.object;
// var addToTimeline = player.addToTimeline;
// var setVar = player.SetVar;
// var getVar = player.GetVar;

function loadScripts(scriptUrls) {
  const promises = scriptUrls.map(url => {
      return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.onload = () => resolve(url); // Resolve the promise when the script loads
          script.onerror = () => reject(new Error(`Failed to load script ${url}`)); // Reject the promise if there's an error
          document.head.appendChild(script); // or document.body.appendChild(script)
      });
  });

  return Promise.all(promises); // Return a single promise that resolves when all scripts are loaded
}

// Example usage
loadScripts([
  "https://cdn.babylonjs.com/babylon.js",
  // Add more script URLs if needed
]).then(() => {
  console.log('All scripts loaded successfully');

  // Call the function to create the scene
  createScene();
}).catch(error => {
  console.error('Error loading scripts:', error);
});

function createScene() {
  console.log("creating Scene")

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


  // Create a Babylon.js engine
  const engine = new BABYLON.Engine(canvas, true);
  
  // Create a basic scene
  const scene = new BABYLON.Scene(engine);
  
  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  
  // Create a light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  
  // Create a basic box
  const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  
  // Set a simple material
  const material = new BABYLON.StandardMaterial("boxMaterial", scene);
  material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color
  box.material = material;
  
  // Animation loop
  engine.runRenderLoop(() => {
      box.rotation.y += 0.01; // Rotate the box
      scene.render();
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
      engine.resize();
  });
  
  console.log("handle done loading")
  player.SetVar("loadingVideoState","hidden");
}
}

};
