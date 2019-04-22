var camera, scene, renderer, mesh;

var keyboard = {};

var player = {
    height: 1.8,
    speed: 0.2,
    turnSpeed: Math.PI * 0.02
};
var meshFloor;

var crate, crateTexture, crateNormalMap, crateBumpMap;
function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xff9999,
            wireframe: false
        })
    );
    mesh.position.y = 1;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: false
        })

    );
    meshFloor.receiveShadow = true;
    meshFloor.rotation.x -= Math.PI / 2;
    scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2)    ;
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 6 , -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
    
    var textureLoader = new THREE.TextureLoader();
    crateTexture = textureLoader.load("crate0/crate0_diffuse.png");
    crateBumpMap = textureLoader.load("crate0/crate0_bump.png");
    crateNormalMap = textureLoader.load("crate0/crate0_normal.png");
    crate = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshPhongMaterial({
            color:0xffffff,
            map: crateTexture,
            bumpMap: crateBumpMap,
            normalMap: crateNormalMap
        })
    );
    scene.add(crate);
    crate.position.set(2.5,3/2,2.5);
    crate.recieveShadow = true;
    crate.castShadow = true;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('models/boat_small.mtl', function(materials){
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('models/boat_small.obj', function(mesh){
            scene.add(mesh);
           

        });
    }); 

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap
    document.body.appendChild(renderer.domElement);
    // renderer.setClearColor(0xffffff);

    animate();





 



    // var manager = new THREE.LoadingManager();
    // var loader = new THREE.ImageLoader(manager);


    // var objLoader = new THREE.OBJLoader();
    // var callbackOnLoad = function ( obj ) {
    //     scene.add( obj );      
    //     // camera.lookAt(obj.position)  ;
    // };

    // // load a resource from provided URL synchronously
    // //objLoader.setLogging( true, true );
    // objLoader.load( 'Bus-Ruin_obj.obj', callbackOnLoad);
}

function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    if (keyboard[87]) {
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) {
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) {
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) {
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    if (keyboard[37]) {
        camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]) {
        camera.rotation.y += player.turnSpeed;
    }

    renderer.render(scene, camera);
}

function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;

}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);


window.onload = init;