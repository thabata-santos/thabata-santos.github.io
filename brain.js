// Brain 3D Neon – Cyberpunk Version 2.0

const brainCanvas = document.getElementById("brainCanvas");
if (!brainCanvas) return;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, brainCanvas.clientWidth / brainCanvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: brainCanvas, alpha: true });

renderer.setSize(brainCanvas.clientWidth, brainCanvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 6;

// Geometry
const geometry = new THREE.IcosahedronGeometry(2.2, 3);
const material = new THREE.MeshStandardMaterial({
  color: 0xff2bd6,
  emissive: 0x7b00ff,
  emissiveIntensity: 1.2,
  transparent: true,
  opacity: 0.85,
  wireframe: true
});

const brain = new THREE.Mesh(geometry, material);
scene.add(brain);

// Neon glow light
const light1 = new THREE.PointLight(0x22f0ff, 2);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xff2bd6, 2);
light2.position.set(-5, -5, 5);
scene.add(light2);

// Animation
function animate() {
  requestAnimationFrame(animate);

  brain.rotation.y += 0.004;
  brain.rotation.x += 0.002;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const width = brainCanvas.clientWidth;
  const height = brainCanvas.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
