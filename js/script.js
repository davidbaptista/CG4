let camera, scene, renderer;

let geometry, material, mesh, obj;

let clock = new THREE.Clock();

let aspectRatio = window.innerHeight / window.innerWidth;


function createScene() {
    'use strict';

    scene = new THREE.Scene();
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
