const vertexShader = `
  uniform vec2 uOffset;
  varying vec2 vUv;

  #define M_PI 3.1415926535897932384626433832795

  vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
     position.x += sin(uv.y * M_PI) * offset.x;
     position.y += sin(uv.x * M_PI) * offset.y;

     return position;
  }

  void main() {
     vUv = uv;
     vec3 newPosition = deformationCurve(position, uv, uOffset);
     gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uAlpha;
  uniform vec2 uOffset;
  varying vec2 vUv;
  uniform vec2 uRGBShift;

  vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 shift) {
     vec2 verticalShift = vec2(0.0, shift.y);
    float r = texture2D(textureImage, uv + verticalShift).r;
    vec2 gb = texture2D(textureImage, uv).gb;
     return vec3(r, gb);
  }

  void main() {
     vec3 color = rgbShift(uTexture, vUv, uRGBShift);
     gl_FragColor = vec4(color, uAlpha);
  }
`;

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const smoother = ScrollSmoother.create({
  wrapper: "main",
  content: ".scrollable",
  smooth: 1.2,
  effects: true
});

gsap.utils.toArray(".image-container").forEach((section) => {
  const heading = section.querySelector("h1");

  gsap.fromTo(
    heading,
    { x: "5%" },
    {
      x: () => {
        const rect = heading.getBoundingClientRect();
        const leftInViewport = rect.left;
        const headingWidth = rect.width;
        const rightOffset = window.innerWidth - leftInViewport;
        return rightOffset + headingWidth; // push it entirely out to the right
        // return headingWidth;
      },
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "center bottom",
        end: "bottom center",
        scrub: true
        // markers: true // for debugging
      }
    }
  );
});

class EffectCanvas {
  constructor() {
    this.container = document.querySelector("main");
    this.images = [...document.querySelectorAll("img")];
    this.meshItems = [];

    this.setupCamera();
    this.createMeshItems();
    this.render();
  }

  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;
    return { width, height, aspectRatio };
  }

  setupCamera() {
    this.scene = new THREE.Scene();

    const perspective = 1000;
    const fov =
      (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.viewport.aspectRatio,
      1,
      2000
    );

    this.camera.position.set(0, 0, 1600);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  createMeshItems() {
    const group = new THREE.Group();
    this.scene.add(group);

    group.scale.set(1.5, 1.5, 1.5);
    group.position.x = 200;

    const skewAngleDeg = -5;
    const skewAngle = THREE.MathUtils.degToRad(skewAngleDeg);

    // const offsetStepY = 1.2;
    // const offsetStepX = 0.2;
    const offsetStepY = 0;
    const offsetStepX = 0;

    this.images.forEach((image, index) => {
      const meshItem = new MeshItem(image, this.scene, index);
      this.meshItems.push(meshItem);

      // Apply diagonal stacking and skew
      meshItem.mesh.position.y = index * offsetStepY;
      meshItem.mesh.position.x = index * offsetStepX;
      meshItem.mesh.rotation.z = skewAngle;

      group.add(meshItem.mesh);
    });

    group.rotation.y = -0.5;
    group.rotation.x = -0.3;
    group.rotation.z = -0.3;
  }

  render() {
    for (let i = 0; i < this.meshItems.length; i++) {
      this.meshItems[i].render();
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

class MeshItem {
  constructor(element, scene, index = 0) {
    this.element = element;
    this.scene = scene;

    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.targetOffset = new THREE.Vector2(0, 0);
    this.currentOffset = new THREE.Vector2(0, 0);
    this.targetRGB = new THREE.Vector2(0, 0);
    this.currentRGB = new THREE.Vector2(0, 0);

    this.createMesh();
  }

  getDimensions() {
    const { width, height, top, left } = this.element.getBoundingClientRect();

    this.sizes.set(width, height);
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,
      -top + window.innerHeight / 2 - height / 2
    );
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.imageTexture = new THREE.TextureLoader().load(this.element.src);

    this.uniforms = {
      uTexture: { value: this.imageTexture },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
      uAlpha: { value: 1.0 },
      uRGBShift: { value: new THREE.Vector2(0.0, 0.0) } // NEW
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    const offsetStepY = 200;
    const offsetStepX = 100;
    const diagX = this.index * offsetStepX;
    const diagY = -this.index * offsetStepY;

    this.mesh.position.set(this.offset.x + diagX, this.offset.y + diagY, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    this.scene.add(this.mesh);
  }

  render() {
    this.getDimensions(); // updates this.offset based on getBoundingClientRect()

    const { top, left, width, height } = this.element.getBoundingClientRect();

    const relativeY = top + height / 2 - window.innerHeight / 2;
    const diagX = relativeY * -0.3;
    const diagY = relativeY * -0.3;

    const baseX = left - window.innerWidth / 2 + width / 2;
    const baseY = -top + window.innerHeight / 2 - height / 2;

    this.mesh.position.set(baseX + diagX, baseY + diagY, 0);
    this.mesh.rotation.z = THREE.MathUtils.degToRad(-5);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    // Shader distortions remain
    const velocityY = smoother.getVelocity();
    this.targetOffset.set(0, velocityY * 0.00005);
    this.currentOffset.lerp(this.targetOffset, 0.075);
    this.uniforms.uOffset.value.copy(this.currentOffset);

    this.targetRGB.set(0, velocityY * 0.00003);
    this.currentRGB.lerp(this.targetRGB, 0.1);
    if (Math.abs(this.currentRGB.y) < 0.00001) this.currentRGB.y = 0;
    this.uniforms.uRGBShift.value.copy(this.currentRGB);
  }
}

new EffectCanvas();