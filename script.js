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
    camera.position.set(40,40,0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));



    // meshFloor = new THREE.Mesh(
    //     new THREE.PlaneGeometry(20, 20, 10, 10),
    //     new THREE.MeshPhongMaterial({
    //         color: 0xffffff,
    //         wireframe: false
    //     })

    // );
    // meshFloor.receiveShadow = true;
    // meshFloor.rotation.x -= Math.PI / 2;
    // scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 10000);
    light.position.set(-3, 1000, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);


    geometry = new THREE.CubeGeometry( 10, 10, 10 );
    material = new THREE.MeshLambertMaterial( { color: 0xaa6666, wireframe: false } );
    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );
    cubeSineDriver = 0;
 
   
    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    

    // light = new THREE.DirectionalLight(0xffffff,0.5);
    // light.position.set(-1,0,1);
    // scene.add(light);
  
    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0x00dddd, map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(300,300);
    smokeParticles = [];


    for (p = 0; p < 50; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*100-50,Math.random()*100-50,Math.random()*100-10);
        particle.rotation.z = Math.random() * 100;
        scene.add(particle);
        smokeParticles.push(particle);
    }
 

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('models/ship_wreck.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('models/ship_wreck.obj', function (mesh) {
            mesh.scale.set(0.5, 0.5, 0.5);
            scene.add(mesh);
        });
    });



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
    evolveSmoke();


    renderer.render(scene, camera);
}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while (sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}




window.onload = init;