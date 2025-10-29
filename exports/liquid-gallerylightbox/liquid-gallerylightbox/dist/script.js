import { Fancybox } from "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.esm.js";
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 80), 0.1, 100);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('webgl'),
	antialias: true,
	alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight - 80);
renderer.setPixelRatio(window.devicePixelRatio);

const images = [
	'https://images.unsplash.com/photo-1576506542790-51244b486a6b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	'https://images.unsplash.com/photo-1749916884078-e8359b2adcdd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	'https://images.unsplash.com/photo-1751554827598-c96cb294c0e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	'https://plus.unsplash.com/premium_photo-1750117839548-0500942b9dfe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	'https://images.unsplash.com/photo-1752643719885-d3a7408ec711?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const loader = new THREE.TextureLoader();
const planes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let columns = 3;
let spacingX = 1.8;
let spacingY = 1.8;
let planeSize = 1.5;

const createUniforms = (texture) => ({
	uTime: { value: 0 },
	uTexture: { value: texture },
	uStrength: { value: 0 },
	uHoverTime: { value: 0 }
});

images.forEach((img, i) => {
	const texture = loader.load(img);
	const planeUniforms = createUniforms(texture);


	const material = new THREE.ShaderMaterial({
		uniforms: planeUniforms,
		vertexShader: `
                    precision mediump float;
                    uniform float uTime;
                    uniform float uStrength;
                    uniform float uHoverTime;
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        float individualTime = uTime + float(${i}) * 0.5;
                        pos.z += uStrength * 0.15 * sin(individualTime * 3.0 + pos.x * 8.0) * cos(individualTime * 3.0 + pos.y * 8.0);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
		fragmentShader: `
                    precision mediump float;
                    uniform float uTime;
                    uniform float uStrength;
                    uniform float uHoverTime;
                    uniform sampler2D uTexture;
                    varying vec2 vUv;
                    void main() {
                        vec2 uv = vUv;
                        float individualTime = uTime + float(${i}) * 0.5;

                        // Aplicar object-fit: cover
                        vec2 aspect = vec2(1.0, 1.0);
                        vec2 imageUv = (uv - 0.5) / aspect + 0.5;
                        imageUv = clamp(imageUv, 0.0, 1.0);

                        // Efecto líquido más suave e independiente
                        imageUv.y += uStrength * 0.02 * sin(imageUv.x * 15.0 + individualTime * 4.0);
                        imageUv.x += uStrength * 0.02 * cos(imageUv.y * 15.0 + individualTime * 4.0);

                        gl_FragColor = texture2D(uTexture, imageUv);
                    }
                `,
		transparent: true
	});

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize, 30, 30), material);

	const col = i % columns;
	const row = Math.floor(i / columns);

	plane.position.x = (col - 1) * spacingX;
	plane.position.y = (1 - row) * spacingY;

	scene.add(plane);
	planes.push({ 
		mesh: plane, 
		uniforms: planeUniforms, 
		isHovering: false, 
		imgSrc: img,
		targetStrength: 0,
		individualOffset: i * 0.3
	});
});

renderer.domElement.addEventListener('mousemove', (e) => {
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -((e.clientY - 80) / (window.innerHeight - 80)) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));

	renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';

	planes.forEach((planeData) => {
		const { mesh, uniforms } = planeData;
		if (intersects.find(hit => hit.object === mesh)) {
			if (!planeData.isHovering) {
				planeData.isHovering = true;
				planeData.targetStrength = 1.0;
			}
		} else {
			if (planeData.isHovering) {
				planeData.isHovering = false;
				planeData.targetStrength = 0;
			}
		}
	});
});

renderer.domElement.addEventListener('click', (e) => {
	const mouse = new THREE.Vector2(
		(e.clientX / window.innerWidth) * 2 - 1,
		-((e.clientY - 80) / (window.innerHeight - 80)) * 2 + 1
	);

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));
	if (intersects.length > 0) {
		const clickedPlane = planes.find(p => p.mesh === intersects[0].object);
		if (clickedPlane) {
			Fancybox.show([{ src: clickedPlane.imgSrc, type: "image" }]);
		}
	}
});

function animate() {
	requestAnimationFrame(animate);
	planes.forEach(({ uniforms, targetStrength, individualOffset }) => {
		uniforms.uTime.value += 0.012;
		uniforms.uHoverTime.value += 0.015;

		const strengthDiff = targetStrength - uniforms.uStrength.value;
		uniforms.uStrength.value += strengthDiff * 0.08;

		if (Math.abs(uniforms.uStrength.value) < 0.01) {
			uniforms.uStrength.value = 0;
		}
	});
	renderer.render(scene, camera);
}
animate();

function updatePlanesLayout() {
	planes.forEach((p, i) => {
		const col = i % columns;
		const row = Math.floor(i / columns);
		p.mesh.geometry.dispose();
		p.mesh.geometry = new THREE.PlaneGeometry(planeSize, planeSize, 30, 30);
		p.mesh.position.x = (col - (columns - 1) / 2) * spacingX;
		p.mesh.position.y = ((Math.floor(i / columns) - 0.5) * -spacingY);

		p.individualOffset = i * 0.3;
		p.targetStrength = 0;
		p.uniforms.uStrength.value = 0;
	});
}

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight - 80;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);

	if (width < 600) {
		columns = 1;
		spacingX = 0;
		spacingY = 1.6;
		planeSize = 2.5;
	} else {
		columns = 3;
		spacingX = 1.8;
		spacingY = 1.8;
		planeSize = 1.5;
	}

	updatePlanesLayout();
}

window.addEventListener('resize', resize);
resize();