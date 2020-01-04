const objInput = document.getElementById("object");
const mtlInput = document.getElementById("material");
const imageInput = document.getElementById("image");
const hidden = document.getElementById("hidden");
const submit = document.getElementById("submit");
const classification = document.getElementById("class");

submit.addEventListener("click", handleSubmit, false);

objInput.addEventListener("change", handleObj, false);
mtlInput.addEventListener("change", handleMtl, false);
imageInput.addEventListener("change", handleImages, false);
classification.addEventListener("change", handleClass, false);

function handleClass() {
  document.forms[0].setAttribute("action", `/upload/${this.value}`);
}

function handleObj() {
  const [file] = this.files;
  const reader = new FileReader();
  reader.onload = (function() {
    return function(e) {
      loadOBJLoader(e.target.result);
    };
  })();
  reader.readAsDataURL(file);
}

function handleMtl() {
  const [file] = this.files;
  const reader = new FileReader();
  reader.onload = (function() {
    return function(e) {
      loadMTLLoader(e.target.result);
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
const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
});
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const objLoader = new THREE.OBJLoader();
const mtlLoader = new THREE.MTLLoader();

initThree();
addHemisphereLight();

function addHemisphereLight() {
  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  console.log(light);
  const lightInput = document.getElementById("light");
  lightInput.addEventListener("input", setLight, false);
  function setLight(e) {
    light.intensity = e.target.value;
  }
  scene.add(light);
}

function initThree() {
  renderer.setSize(800, 600);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document
    .querySelector("main")
    .insertAdjacentElement("afterbegin", renderer.domElement);

  camera.position.x = 27;
  camera.position.y = 30;
  camera.position.z = 13;

  controls.rotateSpeed = 0.1;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.minDistance = 5;
  controls.maxDistance = 100;
}
let speed = 500;
function animate() {
  rqamf = requestAnimationFrame(animate);
  speed += 0.01;
  camera.position.x = Math.cos(speed) * 30;
  camera.position.z = Math.sin(speed) * 30;
  renderer.render(scene, camera);
  controls.update();
}

function loadOBJLoader(file) {
  objLoader.load(
    file,
    function(object) {
      // 모델 로드가 완료되었을때 호출되는 함수
      object.scale.x = 0.5;
      object.scale.y = 0.5;
      object.scale.z = 0.5;
      console.log(object);
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

function loadMTLLoader(file) {
  mtlLoader.load(
    file,
    function(materials) {
      // 모델 로드가 완료되었을때 호출되는 함수
      materials.preload();
      objLoader.setMaterials(materials);
      console.log(materials);
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

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(document.forms[0]);
  cancelAnimationFrame(rqamf);
  const multiview = Array(12)
    .fill(0)
    .map((v, i) => {
      camera.position.x = Math.cos((Math.PI * i) / 12) * 27;
      camera.position.z = Math.sin((Math.PI * i) / 12) * 27;
      controls.update();
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL();
    });
  Promise.all(multiview).then(result => {
    result.forEach((img, index) =>
      formData.append(
        "files",
        new File(
          [
            new Blob(
              [
                new Uint8Array(
                  [...atob(img.split(",")[1])].map(blob => blob.charCodeAt(0))
                )
              ],
              { type: "image/jpeg" }
            )
          ],
          `${index < 10 ? `0${index}` : index}.jpg`
        )
      )
    );
    fetch("/upload/" + classification.value, {
      method: "POST",
      body: formData
    }).then(res => {
      location.reload();
    });
  });
}
