var camera, scene, renderer, mesh;

var keyboard = {};

var player = {
    height: 1.8,
    speed: 0.2,
    turnSpeed: Math.PI * 0.02
};
var meshFloor;


function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(40, 30, 5);
    camera.lookAt(new THREE.Vector3(30,0,20));

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 10000);
    light.position.set(-3, 1000, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
    //SMOKE

    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS

    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0x00dddd,
        map: smokeTexture,
        transparent: true
    });
    smokeGeo = new THREE.SphereGeometry(50,100,100); //smoke shape
    smokeParticles = [];


    for (p = 0; p < 15; p++) {  //count of shape 
        var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set((Math.random() * 10 - 5), Math.random() * 10 - 5, Math.random() * 10 - 5);
        particle.rotation.z = Math.random() * 10;
        scene.add(particle);
        smokeParticles.push(particle);
    }
    //SHIP

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('models/ship_wreck.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('models/ship_wreck.obj', function (mesh) {
            mesh.scale.set(0.5, 0.5, 0.5);
            mesh.position.set(0,0,-5);
            scene.add(mesh);
        });
    });
    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    controls.addEventListener('change', render);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);
    // renderer.setClearColor(0xffffff);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();
    controls.update();

    evolveSmoke();
    
    render();


   
}
function render(){
    renderer.render(scene, camera);
}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while (sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}




window.onload = init;