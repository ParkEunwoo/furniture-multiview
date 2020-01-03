const inputElement = document.getElementById("input");

inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
  const [file] = this.files; /* 이제 파일 리스트로 작업할 수 있습니다 */
  const reader = new FileReader();
  reader.onload = (function() {
    return function(e) {
      loadObjLoader(e.target.result);
    };
  })();
  reader.readAsDataURL(file);
}

let scene = new THREE.Scene();
let light;
let camera;
let loader; // OBJLoader 객체를 넣을 변수를 선언합니다.

initThree();
addDirectionalLight();
// loadObjLoader("./../model/chair.obj");

function addDirectionalLight() {
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true;
  light.position.x = 5;
  light.position.y = 5;
  light.position.z = 5;
  scene.add(light);
}

function initThree() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  let renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  let axes = new THREE.AxisHelper(10);
  scene.add(axes);

  camera.position.x = 27;
  camera.position.y = 13;
  camera.position.z = 13;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.minDistance = 5;
  controls.maxDistance = 100;

  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
  }

  animate();
}

function loadObjLoader(file) {
  loader = new THREE.OBJLoader();
  loader.load(
    file,
    function(object) {
      // 모델 로드가 완료되었을때 호출되는 함수
      object.scale.x = 0.1;
      object.scale.y = 0.1;
      object.scale.z = 0.1;
      console.log(object);
      scene.add(object);
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
