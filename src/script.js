import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.001)
  .name('Ambient Light Intensity')
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)

// Shadows
directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2

directionalLight.shadow.radius = 10

scene.add(directionalLight)

// GUI controls for directional light
const directionalLightFolder = gui.addFolder('Directional Light').close()
directionalLightFolder
  .add(directionalLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.001)
  .name('intensity')
directionalLightFolder
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
directionalLightFolder
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
directionalLightFolder
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
directionalLightFolder.add(directionalLight, 'castShadow').name('Cast Shadow')

// Directional light helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// Gui controls for directional light helper
directionalLightFolder
  .add(directionalLightCameraHelper, 'visible')
  .name('Directional Light Helper')

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)

// Shadows
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.fov = 30

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

scene.add(spotLight)
scene.add(spotLight.target)

// Gui controls for spot light
const spotLightFolder = gui.addFolder('Spot Light').close()
spotLightFolder
  .add(spotLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.001)
  .name('intensity')
spotLightFolder.add(spotLight.position, 'x').min(-5).max(5).step(0.001)
spotLightFolder.add(spotLight.position, 'y').min(-5).max(5).step(0.001)
spotLightFolder.add(spotLight.position, 'z').min(-5).max(5).step(0.001)
spotLightFolder.add(spotLight, 'castShadow').name('Cast Shadow')

// Spot light helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

// Gui controls for spot light helper
spotLightFolder.add(spotLightCameraHelper, 'visible').name('Spot Light Helper')

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)

// Shadows
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

scene.add(pointLight)

// Gui controls for point light
const pointLightFolder = gui.addFolder('Point Light').close()
pointLightFolder
  .add(pointLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.001)
  .name('intensity')
pointLightFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.001)
pointLightFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.001)
pointLightFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.001)
pointLightFolder.add(pointLight, 'castShadow').name('Cast Shadow')

// Point light helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

// Gui controls for point light helper
pointLightFolder
  .add(pointLightCameraHelper, 'visible')
  .name('Point Light Helper')

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui
  .add(material, 'metalness')
  .min(0)
  .max(1)
  .step(0.001)
  .name('Material metalness')
gui
  .add(material, 'roughness')
  .min(0)
  .max(1)
  .step(0.001)
  .name('Material roughness')

const bakedShadowMaterial = new THREE.MeshBasicMaterial({ map: bakedShadow })
const simpleShadowMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  alphaMap: simpleShadow,
  transparent: true
})

/**
 * Objects
 */
// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.material.side = THREE.DoubleSide
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

// Gui controls for plane
gui.add({ bakedShadow: false }, 'bakedShadow').onChange(() => {
  if (plane.material.map) {
    plane.material = material
    plane.material.needsUpdate = true
  } else {
    plane.material = bakedShadowMaterial
    plane.material.map = bakedShadow
    plane.material.needsUpdate = true
  }
})

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.castShadow = true
const sphereParams = { sphereBouncing: false }

// Sphere shadow
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  simpleShadowMaterial
)
sphereShadow.visible = false

sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

// Gui controls for sphere
gui.add({ simpleShadow: false }, 'simpleShadow').onChange(() => {
  if (sphereShadow.visible) {
    sphereShadow.visible = false
    directionalLight.castShadow = true
    spotLight.castShadow = true
    pointLight.castShadow = true
  } else {
    sphereShadow.visible = true
    directionalLight.castShadow = false
    spotLight.castShadow = false
    pointLight.castShadow = false
  }
})
gui.add(sphereParams, 'sphereBouncing').onChange(() => {
  if (!sphereParams.sphereBouncing) {
    sphere.position.set(0, 0, 0)
  }
})

scene.add(sphere, sphereShadow, plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const bounceSphere = elapsedTime => {
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
  sphere.position.z = Math.sin(elapsedTime) * 1.5
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update the sphere
  sphereParams.sphereBouncing && bounceSphere(elapsedTime)

  // Update the shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphere.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.3

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
