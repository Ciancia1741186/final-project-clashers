//file js
"use strict";

import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";

var head;
var scene;
var upperArm_right;
var upperArm_left;
var upperLeg_right;
var upperLeg_left;
var spine;
var hand_left;
var hand_right;

var tweenStartScale;
var tweenGoalScale;
var tweenBackScale;
var tweenIdle;
var tween;
var tweenBack;
var camTarget;
var yoshi;
var camera;

var upPressed = false;

function init() {
  var container = document.getElementById("game");

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight);

  const cameraX = -100;
  const cameraY = 10;
  const cameraZ = 0;

  var controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(cameraX, cameraY, cameraZ);
  camera.updateProjectionMatrix();
  controls.update();

  window.addEventListener(
    "resize",
    function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  //camera.lookAt(scene.position);
  scene.background = new THREE.Color(0xffffff);

  {
    const d = 100;
    const color = 0xffffff;
    const intensity = 1;
    var dirLight = new THREE.DirectionalLight(color, intensity, 100);
    dirLight.position.set(0, 100, 0);
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.fov = 50;
    dirLight.shadow.bias = 0.0039;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    scene.add(dirLight);

    var ambientLight = new THREE.AmbientLight(color, intensity);
    scene.add(ambientLight);
  }

  yoshi = new THREE.Scene();
  {
    const gltfLoader = new GLTFLoader();
    const url_yoshi = "models/yoshi_mario_party_10/scene.gltf";

    gltfLoader.load(url_yoshi, (gltf) => {
      yoshi = gltf.scene;
      yoshi.name = "yoshi";
      yoshi.position.set(0, -5.75, -0.75);
      yoshi.scale.set(0.3, 0.3, 0.3);

      yoshi.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      yoshi.castShadow = true;
      yoshi.receiveShadow = true;

      head = yoshi.getObjectByName(yoshi_dic.Head);
      console.log(dumpObject(yoshi).join("\n"));
      upperArm_right = yoshi.getObjectByName(yoshi_dic.UpperArm_right);
      upperArm_left = yoshi.getObjectByName(yoshi_dic.UpperArm_left);
      upperLeg_right = yoshi.getObjectByName(yoshi_dic.UpperLeg_right);
      upperLeg_left = yoshi.getObjectByName(yoshi_dic.UpperLeg_left);
      spine = yoshi.getObjectByName(yoshi_dic.Spine);
      hand_left = yoshi.getObjectByName(yoshi_dic.Hand_left);
      hand_right = yoshi.getObjectByName(yoshi_dic.Hand_right);

      upperArm_right.rotation.z = (55 * Math.PI) / 180;
      upperArm_left.rotation.z = (55 * Math.PI) / 180;
      upperArm_right.rotation.x = (-45 * Math.PI) / 180;
      upperArm_left.rotation.x = (-45 * Math.PI) / 180;
      upperLeg_right.rotation.x = (0 * Math.PI) / 180;
      upperLeg_left.rotation.x = (-180 * Math.PI) / 180;
      hand_left.rotation.y = (0 * Math.PI) / 180;
      hand_right.rotation.y = (0 * Math.PI) / 180;

      spine.rotation.x = (30 * Math.PI) / 180;
      head.rotation.x = (-30 * Math.PI) / 180;

      //camera.lookAt(yoshi.position.x, yoshi.position.y, yoshi.position.z);
      scene.add(yoshi);

      document.addEventListener("keydown", onDocumentKeyDown, false);
      function onDocumentKeyDown(event) {
        var keyCode = event.keyCode;
        if (keyCode == 65) {
          yoshi.position.x += 0.5;
        } else if (keyCode == 68) {
          yoshi.position.x -= 0.5;
        } else if (keyCode == 87) {
          if (!upPressed) {
            performAnimation();
          }
          upPressed = true;
        } else if (keyCode == 83) {
          yoshi.position.z -= 0.5;
        }
      }

      document.addEventListener("keyup", onDocumentKeyUp, false);
      function onDocumentKeyUp(event) {
        var keyCode = event.keyCode;
        if (keyCode == 87) {
          upPressed = false;
          tween.stop();
          tweenBack.stop();
          setIdlePosition();
        } else if (keyCode == 83) {
          yoshi.position.z -= 0.5;
        }
      }

      setAnimationParameters();
      requestAnimationFrame(animate);
    });
  }

  //const cameraHelper = new THREE.CameraHelper(camera);
  //scene.add(cameraHelper);

  scene.add(camera);
  CreateLandscape();

  function animate() {
    TWEEN.update();
    camera.lookAt(yoshi.position.x, yoshi.position.y, yoshi.position.z);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }
}

var Landscape = function () {
  var geometry = new THREE.BoxGeometry(window.innerWidth, 1, window.innerWidth);
  var texture = new THREE.TextureLoader().load("img/desert.jpg");
  var material = new THREE.MeshPhongMaterial({
    map: texture,
    color: 0xd2b48c,
  });
  this.mesh = new THREE.Mesh(geometry, material);
  this.mesh.receiveShadow = true;
};

var landscape;
function CreateLandscape() {
  landscape = new Landscape();
  landscape.mesh.position.y = -6;
  scene.add(landscape.mesh);
}

function setAnimationParameters() {
  tweenStartScale = {
    x_left: upperLeg_left.rotation.x,
    x_right: upperLeg_right.rotation.x,
  };
  tweenGoalScale = {
    x_left: (-225 * Math.PI) / 180,
    x_right: (45 * Math.PI) / 180,
  };
  tweenBackScale = {
    x_left: (-135 * Math.PI) / 180,
    x_right: (-45 * Math.PI) / 180,
  };
  tweenIdle = {
    x_left: (-180 * Math.PI) / 180,
    x_right: (0 * Math.PI) / 180,
  };
}

function performAnimation() {
  tween = new TWEEN.Tween(tweenStartScale)
    .to(tweenGoalScale, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function () {
      upperLeg_left.rotation.x = tweenStartScale.x_left;
      upperLeg_right.rotation.x = tweenStartScale.x_right;
      yoshi.position.z += 0.02;
      camera.position.z += (yoshi.position.z - camera.position.z) * 0.1;
      //camera.lookAt(yoshi.position.x, yoshi.position.y, yoshi.position.z);
      //camera.updateProjectionMatrix();
    })
    .start();

  tweenBack = new TWEEN.Tween(tweenStartScale)
    .to(tweenBackScale, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function () {
      upperLeg_left.rotation.x = tweenStartScale.x_left;
      upperLeg_right.rotation.x = tweenStartScale.x_right;
      yoshi.position.z += 0.02;
      camera.position.z += (yoshi.position.z - camera.position.z) * 0.1;
      //camera.lookAt(yoshi.position.x, yoshi.position.y, yoshi.position.z);
      //camera.updateProjectionMatrix();
    })
    .yoyo(true)
    .repeat(Infinity);
  tween.chain(tweenBack);
}

var tween_idle;

function setIdlePosition() {
  console.log("i'm in setIdlePosition function");
  tween_idle = new TWEEN.Tween(tweenStartScale)
    .to(tweenIdle, 1000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function () {
      upperLeg_left.rotation.x = tweenStartScale.x_left;
      upperLeg_right.rotation.x = tweenStartScale.x_right;
      //camera.lookAt(yoshi.position.x, yoshi.position.y, yoshi.position.z);
    })
    .start();
}

init();
