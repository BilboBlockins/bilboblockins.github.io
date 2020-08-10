let inputSize = 320
let scoreThreshold = .2
let doubleData
let doubleModelData

async function warmUp() {
  //upload hidden dummy image to warm up tensors for faster processing for upload
  const inputImgEl = document.getElementById('file-image')
  console.log('Warming face recognition net...')
  console.log('Processing ', doubleData[0].name)
  inputImgEl.src = doubleData[0].image_path
  const result = await faceapi
    .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
    .withFaceLandmarks()
    .withFaceDescriptor()
  console.log(result)
}

async function findMatches() {
  const inputImgEl = document.getElementById('file-image')
  const result = await faceapi
    .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
    .withFaceLandmarks()
    .withFaceDescriptor()
  console.log(result)
  if(result) {
    const distance = faceMatcher.computeMeanDistance(result.descriptor, [doubleModelData[0]])
    console.log('query distance: ', distance)
  } else {
    output('Sorry, couldn\'t find a face in that one.')
  }

}

async function run() {
  //Load doubles model and data
  const doubleRes = await axios.get('https://bilboblockins.github.io/double/data/stunt_actors.json')
  const doubleModelRes = await axios.get('https://bilboblockins.github.io/double/data/doubles_model.json')
  doubleData = doubleRes.data
  doubleModelData = doubleModelRes.data
  // load face detection, face landmark model and face recognition models
  await faceapi.loadTinyFaceDetectorModel('/double/weights/')
  await faceapi.loadFaceLandmarkModel('/double/weights/')
  await faceapi.loadFaceRecognitionModel('/double/weights/')
  warmUp()
}

run()