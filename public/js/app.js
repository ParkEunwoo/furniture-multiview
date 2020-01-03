const objInput = document.getElementById("input");
const imageInput = document.getElementById("image");

objInput.addEventListener("change", handleFiles, false);
imageInput.addEventListener("change", handleImages, false);

function handleFiles() {
  const [file] = this.files;
  const reader = new FileReader();
  reader.onload = (function() {
    return function(e) {
      loadObjLoader(e.target.result);
    };
  })();
  reader.readAsDataURL(file);
}
function handleImages() {
  const [file] = this.files;
  const reader = new FileReader();
  reader.onload = (function() {
    return function(e) {};
  })();
  reader.readAsDataURL(file);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
});
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const loader = new THREE.OBJLoader();

initThree();
addDirectionalLight();

function addDirectionalLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true;
  light.position.x = 5;
  light.position.y = 5;
  light.position.z = 5;
  scene.add(light);
}

function initThree() {
  renderer.setSize(800, 600);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document
    .querySelector("main")
    .insertAdjacentElement("afterbegin", renderer.domElement);

  let axes = new THREE.AxesHelper(10);
  scene.add(axes);

  camera.position.x = 27;
  camera.position.y = 13;
  camera.position.z = 13;

  controls.rotateSpeed = 0.1;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.minDistance = 5;
  controls.maxDistance = 100;

  // 캡쳐 renderer.domElement.toDataURL();
}
function animate() {
  requestAnimationFrame(animate);
  let speed = Date.now() * 0.00025;
  camera.position.x = Math.cos(speed) * 27;
  camera.position.z = Math.sin(speed) * 27;
  renderer.render(scene, camera);
  controls.update();
}

function loadObjLoader(file) {
  loader.load(
    file,
    function(object) {
      // 모델 로드가 완료되었을때 호출되는 함수
      object.scale.x = 0.1;
      object.scale.y = 0.1;
      object.scale.z = 0.1;
      scene.add(object);
      const sizeInput = document.getElementById("size");
      sizeInput.addEventListener("input", setObjectSize, false);
      function setObjectSize(e) {
        object.scale.x = e.target.value;
        object.scale.y = e.target.value;
        object.scale.z = e.target.value;
      }
      animate();
    },
    function(xhr) {
      // 모델이 로드되는 동안 호출되는 함수
      console.log((xhr.loaded / xhr.total) * 100, "% loaded");
    },
    function(error) {
      // 모델 로드가 실패했을 때 호출하는 함수
      alert("모델을 로드 중 오류가 발생하였습니다.");
    }
  );
}
