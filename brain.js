// Brain 3D Elite Version
let scene, camera, renderer, brainMesh, particles;

function initBrain() {
  const container = document.getElementById("brainContainer");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(1.4, 3);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xff2bd6,
    emissive: 0xff2bd6,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.15,
    transparent: true,
    opacity: 0.75,
    transmission: 0.9,
    thickness: 1.5
  });

  brainMesh = new THREE.Mesh(geometry, material);
  scene.add(brainMesh);

  // Particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 300;
  const positions = [];

  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 6);
    positions.push((Math.random() - 0.5) * 6);
    positions.push((Math.random() - 0.5) * 6);
  }

  particleGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const particleMat = new THREE.PointsMaterial({
    color: 0x22f0ff,
    size: 0.02
  });

  particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  brainMesh.rotation.y += 0.003;
  brainMesh.rotation.x += 0.001;

  particles.rotation.y += 0.001;

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  const container = document.getElementById("brainContainer");
  if (!container) return;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

window.addEventListener("DOMContentLoaded", initBrain);
