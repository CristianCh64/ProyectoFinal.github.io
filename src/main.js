var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    origin = new THREE.Vector3(0, 0, 0),
    sound1,
    plane,
    modelLoad,
    light;
var modPlayer = null;

function start() {
    window.onresize = onWindowResize;
    initScene();
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function initScene() {
    // Scene, Camera, Renderer
    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    // Create Camera (3D)
    camera = new THREE.PerspectiveCamera(75, // Fov (campo de vision)
        window.innerWidth / window.innerHeight, // aspect (tamano pantalla)
        0.1, // near (Cercano)
        1000); // far (Lejano)

    // To renderer
    const canvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // To Make Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // To create Grid
    const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Make Adds
    scene.add(camera);
    camera.position.set(3.9, 3.7, 4.7);
    controls.update();

    // Create Object with images texture
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const light = new THREE.AmbientLight(0xFFE74F, 0.4); // soft white light
    scene.add(light);

    pointLight = new THREE.PointLight(0xffffff, 0.3, 30);
    pointLight.position.set(0, 10, 2);
    scene.add(pointLight);

    loadModel_objAndMtl("./modelos/Jackie/", "Jackie",2 );
    generateUI();
}
function loadModel_objAndMtl(pathGeneralFolder, pathFile,scale) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(pathGeneralFolder);
    mtlLoader.setPath(pathGeneralFolder);
    mtlLoader.load(pathFile + ".mtl", function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(pathGeneralFolder);
        objLoader.load(pathFile + ".obj", function (Object) {
            modPlayer= Object;
            scene.add(Object);
            Object.scale.set(scale, scale, scale);
            Object.position.set(0, 0, 0)
        });
    });
}

function generateUI() {
    console.log("generate content");

    var gui = new dat.GUI();
    var param = {
        Options: "Move",                   //Animations to FBX
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        movX: 0,
        movY: 0,
        movZ: 0,
        scale: 3,
    };

    var m = gui.addFolder("Move");
    var r = gui.addFolder("Rotate");
    var e = gui.addFolder("Scale");
    var p = gui.addFolder("PolygonCount");

    var movementX = m.add(param, 'movX').min(-50).max(50).step(1).name("X");
    var movementY = m.add(param, 'movY').min(0).max(50).step(1).name("Y");
    var movementZ = m.add(param, 'movZ').min(0).max(50).step(1).name("Z");

    movementX.onChange(function (valueX) {
        modPlayer.position.x = valueX;
    })
    movementY.onChange(function (valueY) {
        modPlayer.position.y = valueY;
    })
    movementZ.onChange(function (valueZ) {
        modPlayer.position.z = valueZ;
    })

    var rotationX = r.add(param, 'rotX').min(0).max(360).step(0.1).name("X");
    var rotationY = r.add(param, 'rotY').min(0).max(360).step(0.1).name("Y");
    var rotationZ = r.add(param, 'rotZ').min(0).max(360).step(0.1).name("Z");

    rotationX.onChange(function (rotateX) {
        modPlayer.rotation.x = rotateX;

    })
    rotationY.onChange(function (rotateY) {
        modPlayer.rotation.y = rotateY;

    })
    rotationZ.onChange(function (rotateZ) {
        modPlayer.rotation.z = rotateZ;

    })

    var myScale = e.add(param, 'scale').min(1).max(10).step(1).name("Scale");

    myScale.onChange(function (myScaleN) {
        modPlayer.scale.set(myScaleN, myScaleN, myScaleN);
    })
}

// function playAudio() { 
//     x.play(); 
// } 

function createLight() {
    // Create a directional light
    // light = new THREE.DirectionalLight(0xffffff, 1.0, 1000);
    var light2 = new THREE.AmbientLight(0xffffff); // soft white light

    // move the light back and up a bit
    light2.position.set(10, 10, 10);

    // remember to add the light to the scene
    scene.add(light2);

    light = new THREE.DirectionalLight(0xffffff, 1.0, 1000);
    scene.add(light);
}
//----------------------------------------------------
function createSpotlight(color) {
    var newObj = new THREE.SpotLight(color, 2);
    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 50;
    return newObj;
}

function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // sound1.update(camera);
}
