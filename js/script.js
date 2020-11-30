let camera, pauseCamera, scene, renderer, pauseScene;

let geometry, material, mesh, texture, bumpmap, obj;

let clock = new THREE.Clock();

let aspectRatio = window.innerHeight / window.innerWidth;

let controls;

let pointlight, directionallight;

let pause = false;

let flag, ball;

const speed = 12

let ballSpeedx = speed, ballSpeedy = speed, goback = false;

let materialsList = [];

let meshList = [];

let lightingOn = true;

let ballMovement = true;

function createSkybox() {
	const loader = new THREE.CubeTextureLoader(); 

	const sky = loader.load([
        'js/assets/cubemap/px.png',
        'js/assets/cubemap/ny.png',
        'js/assets/cubemap/py.png',
        'js/assets/cubemap/nx.png',
        'js/assets/cubemap/pz.png',
        'js/assets/cubemap/nz.png',
    ]);
	scene.background = sky;
}

function createField(s) {
	'use strict';
	texture = new THREE.TextureLoader().load('js/assets/checkers.png');
    bumpmap = new THREE.TextureLoader().load('js/assets/bump.jpg');

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.anisotropy = 16;
	bumpmap.wrapS = THREE.RepeatWrapping;
    bumpmap.wrapT = THREE.RepeatWrapping;
    bumpmap.anisotropy = 16;

	geometry = new THREE.PlaneGeometry(s, s, 64);
	let materials = [
		new THREE.MeshPhongMaterial({map: texture, bumpMap: bumpmap}),
		new THREE.MeshBasicMaterial({map: texture})
	]
	materialsList.push(materials[0]);
	materialsList.push(materials[1]);
    mesh = new THREE.Mesh(geometry, materials);
	mesh.position.set(0, 0, 0);
	meshList.push(mesh);
	obj = new THREE.Object3D();
    obj.add(mesh);

    obj.rotateX(-Math.PI / 2);

    scene.add(obj);
    
	return obj;
}

function createPointLight() {
	'use strict';

	pointlight = new THREE.PointLight(0xffffff, 2, 100);
	pointlight.position.set(10, 40, 20);
	scene.add(pointlight);
	return pointlight;
}

function createDirectionalLight() {
    'use strict';

    directionallight = new THREE.DirectionalLight(0xffffff, 1);
    directionallight.position.set(-30, 30, -10);
    directionallight.castShadow = true
    directionallight.autoUpdate = true;
    
    directionallight.shadow.camera.near = 2;
    directionallight.shadow.camera.far = 100;
    directionallight.shadow.camera.left = -25;
    directionallight.shadow.camera.right = 25;
    directionallight.shadow.camera.top = 25;
    directionallight.shadow.camera.bottom = -25;
    directionallight.target.position.set(0, 0, 0);

    directionallight.shadow.mapSize.width = 2048;
    directionallight.shadow.mapSize.height = 2048;
    
    scene.add(directionallight);
    return directionallight
}

function createBall(r) {
    'use strict'
    
	bumpmap = new THREE.TextureLoader().load('js/assets/ball.png'); 

	geometry = new THREE.SphereGeometry(r, 32, 32)
	let materials = [
		new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 20, bumpMap: bumpmap}),
		new THREE.MeshBasicMaterial({color: 0xffffff})
	]
	materialsList.push(materials[0]);
	materialsList.push(materials[1]);
	mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(0, r, 0);
	meshList.push(mesh);
    ball = new THREE.Object3D();
	ball.add(mesh);
	scene.add(ball);
	return ball;
}

function createCylinder(w, h) {
	'use strict';

	geometry = new THREE.CylinderGeometry(w, w, h, 64);
	let materials = [
		new THREE.MeshPhongMaterial({color: 0xbbbb00}),
		new THREE.MeshBasicMaterial({color: 0xbbbb00})
	]
	materialsList.push(materials[0]);
	materialsList.push(materials[1]);
    mesh = new THREE.Mesh(geometry, materials);
	mesh.position.set(0, 7.5, 0);
	meshList.push(mesh);
	obj = new THREE.Object3D();
    obj.add(mesh);

	return obj;
}

function createBox(l, h, w) {
    'use strict';

    geometry = new THREE.BoxGeometry(l, h, w);
	let materials = [
		new THREE.MeshPhongMaterial({color: 0xff0000}),
		new THREE.MeshBasicMaterial({color: 0xff0000})
	]
	materialsList.push(materials[0]);
	materialsList.push(materials[1]);
	mesh = new THREE.Mesh(geometry, materials);
	meshList.push(mesh);
	for(let j = 0; j < mesh.geometry.faces.length; j++){
        mesh.geometry.faces[j].materialIndex = 0;
	}
	
    mesh.position.set(3, 13.5, 0);
    obj = new THREE.Object3D();
    obj.add(mesh);

	return obj;
}

function createFlag() {
    'use strict';
    let stick = createCylinder(0.2, 15);
	let top = createBox(6, 3, 0.1);
	flag = new THREE.Object3D();
    flag.add(stick);
    flag.add(top);
    flag.rotation.y = Math.PI / 2;
    scene.add(flag);
    return flag;
}

function onKeyDown(e) {
	'use strict';
    switch (e.keyCode) {
        case 66:    //b
            ballMovement = !ballMovement;
            break;
		case 68: 	// d
			directionallight.visible = !directionallight.visible;
			break;
		case 73:	// i
			let x;
			
			if (lightingOn) {
				x = 1;
			}
			else {
				x = 0;
			}
			for(let i = 0; i < meshList.length; i++) {
				for(let j = 0; j < meshList[i].geometry.__directGeometry.groups.length; j++){
					meshList[i].geometry.__directGeometry.groups[j].materialIndex = x;
				}
			}

			lightingOn = !lightingOn;
			break;
		case 80: 	// p
			pointlight.visible = !pointlight.visible;
            break;
        case 83: 	// s
			pause = !pause;
			break;
		case 87: 	// w
			for(let i = 0; i < materialsList.length; i++) {
				materialsList[i].wireframe = !materialsList[i].wireframe;
			}
			break;
		case 82: 	// r
			if (pause) {
                flag.rotation.y = Math.PI / 2;
                ball.position.x = 0;
                ball.position.y = 0;
                ballSpeedx = speed;
                ballSpeedy = speed;
                goback = false;
                ballMovement = true;
                pause = false;
				directionallight.visible = true;
				pointlight.visible = true;
				lightingOn = true;
				for(let i = 0; i < meshList.length; i++) {
					for(let j = 0; j < meshList[i].geometry.__directGeometry.groups.length; j++){
						meshList[i].geometry.__directGeometry.groups[j].materialIndex = 0;
					}
				}

				for(let i = 0; i < materialsList.length; i++) {
					materialsList[i].wireframe = false;
				}
			}
			break;
	}
}

function onResize() {
	'use strict';

	renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    aspectRatio = window.innerWidth / window.innerHeight;
	pauseCamera.left = 10 * aspectRatio;
    pauseCamera.right = -10 * aspectRatio;
	pauseCamera.updateProjectionMatrix();
}

function createScene() {
    'use strict';

	scene = new THREE.Scene();
	createSkybox();
    createField(75);
    createPointLight();
    createDirectionalLight();
	createBall(0.4);
	let flag = createFlag();
	flag.position.set(30, 0, 0);
}

function createPauseScene() {
    'use strict';
    pauseScene = new THREE.Scene();

    pauseCamera = new THREE.OrthographicCamera(10*(window.innerWidth / window.innerHeight), -10*(window.innerWidth / window.innerHeight), 10, -10, 1, 1000);
    pauseCamera.position.x = 0;
    pauseCamera.position.y = 0;
    pauseCamera.position.z = -20;
    pauseCamera.lookAt(0, 0, 0);
    
	texture = new THREE.TextureLoader().load('js/assets/pause.png'); 

	geometry = new THREE.PlaneGeometry(10, 10, 64);
	material = new THREE.MeshBasicMaterial({map: texture});
	mesh = new THREE.Mesh(geometry, material);
	
    pauseScene.add(mesh);
}

function createCamera() {
	'use strict';

	camera = new THREE.PerspectiveCamera(60,  window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = -20;
    camera.position.y = 20;
	camera.position.z = -20;
    camera.lookAt(scene.position);
}

function render() {
	'use strict';
	renderer.autoClear = true;
	renderer.render(scene, camera);
	renderer.autoClear = false;
    if (pause) {
        renderer.render(pauseScene, pauseCamera);
	}
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true,
	});
	render.autoClear = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
    createScene();
    createCamera();
    createPauseScene();
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    let rotationSpeed = Math.PI;
    let delta;
    if (pause) {
        delta = clock.getDelta();
        delta = 0;
	} 
	else {
        delta = clock.getDelta();
    }

    flag.rotateY(rotationSpeed * delta);

    if (ballMovement) {
		ball.position.y += ballSpeedy * delta;
		
        if (ball.position.y >= 0) {
            ballSpeedy -= 9.8 * delta;
		} 
		else {
            goback = !goback;
            ballSpeedy = speed;
            ball.position.y = 0;
        }

        if (goback) {
            ball.position.x -= ballSpeedx * delta;
        } else {
            ball.position.x += ballSpeedx * delta;
        }
    }
    
    render();
    requestAnimationFrame(animate);
}
