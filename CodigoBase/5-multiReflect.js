// Mapeamento de Texturas 
import * as THREE           from 'three';
import { OrbitControls }    from '../../../../Assets/scripts/three.js/examples/jsm/controls/OrbitControls.js';

const   rendSize    = new THREE.Vector2();

var     renderer,
        scene,
        camera,
        cameraControl,
        cubeCamera,
        mirrorSphere,
        mirrorCube,
        mirrorCylinder;

function main() {

    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

    rendSize.x = window.innerWidth*0.8;
    rendSize.y = window.innerHeight*0.8;

    renderer.setSize(rendSize.x, rendSize.y);

    document.body.appendChild(renderer.domElement);

    scene   = new THREE.Scene();
    
    camera              = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x   = 25;
    camera.position.y   = 10;
    camera.position.z   = 63;
    camera.lookAt(scene.position);

    cameraControl           = new OrbitControls(camera, renderer.domElement);
    cameraControl.enablePan = false;
    
    // cria Mapeamento de Ambiente
    const path          = "../../../../Assets/Textures/Cubemaps/SwedishRoyalCastle/";
    const textCubeMap   =    [  path + "px.jpg", 
                                path + "nx.jpg",
                                path + "py.jpg", 
                                path + "ny.jpg",
                                path + "pz.jpg", 
                                path + "nz.jpg",
                                
                            ];

    const textureCube   = new THREE.CubeTextureLoader().load( textCubeMap );
    textureCube.mapping = THREE.CubeReflectionMapping;
    scene.background    = textureCube;


    // Create cube render target
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, {    format: THREE.RGBFormat, 
                                                                        generateMipmaps: true, 
                                                                        minFilter: THREE.LinearMipmapLinearFilter } );   
    // cria uma camera para geracao do cubemap
	cubeCamera       = new THREE.CubeCamera(1, 100000, cubeRenderTarget );
	scene.add(cubeCamera);

    // cria os materiais para o mapeamento do ambiente dinamico e estatico
	const dynamicEnvMaterial   = new THREE.MeshBasicMaterial(  {   envMap: cubeCamera.renderTarget.texture, 
                                                                            side: THREE.DoubleSide});
	const envMaterial          = new THREE.MeshBasicMaterial(  {   envMap: textureCube, 
                                                                            side: THREE.DoubleSide});
  
    // cria esfera espelhada com mapemento dinamico
    const sphereGeometry        = new THREE.SphereGeometry(15, 60, 60);
    mirrorSphere                = new THREE.Mesh(sphereGeometry, dynamicEnvMaterial);
    scene.add(mirrorSphere);
	
    // cria cilindro espelhada com mapemento estatico
	const cylinderGeometry     = new THREE.CylinderGeometry(10, 4, 20, 20, 20, false);
	mirrorCylinder             = new THREE.Mesh(cylinderGeometry, envMaterial);
	scene.add(mirrorCylinder);
	mirrorCylinder.position.set(30, 0, 0);

    // cria cubo espelhada com mapemento estatico
	var boxGeometry            = new THREE.BoxGeometry(15, 15, 15);
	mirrorCube                 = new THREE.Mesh(boxGeometry, envMaterial);
	scene.add(mirrorCube);
	mirrorCube.position.set(-30, 0, 0);

    document.body.appendChild(renderer.domElement);

    render();
}

function render() {

    cameraControl.update();

	mirrorCube.rotation.y      +=0.005;
	mirrorCube.rotation.x      +=0.005;
	mirrorCylinder.rotation.x  +=0.009;

	mirrorSphere.visible = false;
	cubeCamera.update(renderer, scene);
	mirrorSphere.visible = true;
	
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

main();
