const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, 400);
document.getElementById("brain-container").appendChild(renderer.domElement);

const group = new THREE.Group();
scene.add(group);

const nodes = [];
const geometry = new THREE.SphereGeometry(0.06, 16, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xff2bd6 });

for (let i = 0; i < 60; i++) {
  const node = new THREE.Mesh(geometry, material);
  node.position.set(
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3
  );
  nodes.push(node);
  group.add(node);
}

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x22f0ff });

nodes.forEach((a, i) => {
  nodes.forEach((b, j) => {
    if (i < j && a.position.distanceTo(b.position) < 1.2) {
      const points = [a.position, b.position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      group.add(line);
    }
  });
});

camera.position.z = 4;

function animate() {
  requestAnimationFrame(animate);
  group.rotation.x += 0.003;
  group.rotation.y += 0.004;
  renderer.render(scene, camera);
}

animate();
