let camera, scene, renderer;

let geometry, material, mesh, texture, bumpmap, obj;

let clock = new THREE.Clock();

let aspectRatio = window.innerHeight / window.innerWidth;

function createField(s) {
	'use strict';

	texture = new THREE.TextureLoader().load('js/assets/checkers.png');
	bumpmap = new THREE.TextureLoader().load('js/assets/bump3.jpg'); 
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.anisotropy = 16;
	bumpmap.wrapS = THREE.RepeatWrapping;
    bumpmap.wrapT = THREE.RepeatWrapping;
    bumpmap.anisotropy = 16;

	geometry = new THREE.PlaneGeometry(s, s, 64);
    material = new THREE.MeshPhongMaterial({map: texture, bumpMap: bumpmap});

    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, 0, 0);
	obj = new THREE.Object3D();
    obj.add(mesh);

    obj.rotateX(-Math.PI / 2);

    scene.add(obj);
    
	return obj;
}

function createLight() {
	'use strict';

	const light = new THREE.PointLight( 0xffffff, 2, 100 );
	light.position.set(25, 25, 5);
	scene.add(light);
	return light;
}


function createBall(r) {
    'use strict'
    
	bumpmap = new THREE.TextureLoader().load('js/assets/ball.png'); 

    geometry = new THREE.SphereGeometry(r, 32, 32)
    let material = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 1, bumpMap: bumpmap});
	mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(5, 2, 5);
   
    obj = new THREE.Object3D();
	obj.add(mesh);
	scene.add(obj);
	return obj;
}

function createCylinder(w, h) {
	'use strict';

	geometry = new THREE.CylinderGeometry(w, w, h, 64);
 	material = new THREE.MeshPhongMaterial({color: 0xbbbb00});
    mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 7.5, 0);
	obj = new THREE.Object3D();
    obj.add(mesh);

	return obj;
}

function createBox(l, h, w) {
    'use strict';

    geometry = new THREE.BoxGeometry(l, h, w);
    material = new THREE.MeshPhongMaterial({color: 0xff0000});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(3, 13.5, 0);
    obj = new THREE.Object3D();
    obj.add(mesh);

	return obj;
}

function createFlag() {
    'use strict';
    let stick = createCylinder(0.2, 15);
	let flag = createBox(6, 3, 0.1);
	obj = new THREE.Object3D();
    obj.add(stick);
    obj.add(flag);
    scene.add(obj);
    return obj;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    createField(50);
	createLight();
	createBall();
	createFlag();
}

function createCamera() {
	'use strict';

	camera = new THREE.PerspectiveCamera(60,  window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 20;
    camera.position.y = 20;
	camera.position.z = 20;
    camera.lookAt(scene.position);
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
}

function animate() {
    'use strict';
    render();
    requestAnimationFrame(animate);
}
