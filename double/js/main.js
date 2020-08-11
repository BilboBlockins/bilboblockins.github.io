let inputSize = 320
let scoreThreshold = .2
let doubleData
let doubleModelData

async function warmUp() {
  //upload hidden dummy image to warm up tensors for faster processing on upload
  const inputImgEl = document.getElementById('file-image')
  console.log('Warming face recognition net...')
  console.log('Processing ', doubleData[0].name)
  inputImgEl.src = './' + doubleData[0].image_path
  const result = await faceapi
    .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
    .withFaceLandmarks()
    .withFaceDescriptor()
  console.log(result)
}

async function findMatches() {
  const inputImgEl = document.getElementById('file-image')
  const outputImgEl = document.getElementById('resultsImg')
  const result = await faceapi
    .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
    .withFaceLandmarks()
    .withFaceDescriptor()
  if(result) {
    let distArray = []
    const modelLen = doubleModelData.length
    for(let i=0; i<modelLen; i++) {
      let dist = faceapi.euclideanDistance(result.descriptor, doubleModelData[i])
      distArray.push(dist)
    }
    //to get min 3
    const minValues = distArray.sort((a,b) => a-b).slice(0,3)
    console.log(minValues)
    const minDist = Math.min(...distArray)
    const minIndex = distArray.indexOf(minDist)
    const minMatch = doubleData[minIndex]
    output(`Looks like the closest match is ${minMatch.name}`)
    outputImgEl.src = './' + minMatch.image_path
  } else {
    output('Sorry, couldn\'t find a face in that one.')
  }
}

// Output
function output(msg) {
  let m = document.getElementById('messages');
  m.innerHTML = msg;
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