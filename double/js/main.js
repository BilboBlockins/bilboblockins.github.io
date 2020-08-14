let inputSize = 416
let scoreThreshold = .35
let doubleData
let doubleModelData

async function warmUp() {
  const content = document.querySelector('.loading')
  const loader = document.querySelector('load')
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
  content.classList.remove('loading')
  content.classList.add('loaded')
  loader.classList.add('loaded')
}

async function findMatches() {
  const progressBar = document.getElementById('file-progress')
  const inputImgEl = document.getElementById('file-image')
  const outputImgEl1 = document.getElementById('resultsImg1')
  const outputImgEl2 = document.getElementById('resultsImg2')
  const outputImgEl3 = document.getElementById('resultsImg3')

  const result = await faceapi
    .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
    .withFaceLandmarks()
    .withFaceDescriptor()
  if(result) {
    let distArray = []
    const modelLen = doubleModelData.length
    setMaxProgress(modelLen-1)
    for(let i=0; i<modelLen; i++) {
      let dist = faceapi.euclideanDistance(result.descriptor, doubleModelData[i])
      distArray.push(dist)
      progressBar.value = i
    }
    let minDist = distArray.slice()
    minDist = minDist.sort((a,b) => a-b).slice(0,3)
    console.log(minDist)
    const minIndex1 = distArray.indexOf(minDist[0])
    const minIndex2 = distArray.indexOf(minDist[1])
    const minIndex3 = distArray.indexOf(minDist[2])
    const minMatch1 = doubleData[minIndex1]
    const minMatch2 = doubleData[minIndex2]
    const minMatch3 = doubleData[minIndex3]
    output(`Looks like the closest match is ${minMatch1.name}`)
    outputImgEl1.src = './' + minMatch1.image_path
    outputImgEl2.src = './' + minMatch2.image_path
    outputImgEl3.src = './' + minMatch3.image_path
  } else {
    output('Sorry, couldn\'t find a face in that one.')
  }
}

function output(msg) {
  let m = document.getElementById('messages')
  m.innerHTML = msg
}

function setMaxProgress(num) {
  let progressBar = document.getElementById('file-progress')
  progressBar.max = num
}

async function run() {
  //Load doubles model and data
  const doubleRes = await axios.get('https://bilboblockins.github.io/double/data/doubles.json')
  const doubleModelRes = await axios.get('https://bilboblockins.github.io/double/data/face_model.json')
  doubleData = doubleRes.data
  doubleModelData = doubleModelRes.data
  // load face detection, face landmark model and face recognition models
  await faceapi.loadTinyFaceDetectorModel('/double/weights/')
  await faceapi.loadFaceLandmarkModel('/double/weights/')
  await faceapi.loadFaceRecognitionModel('/double/weights/')
  warmUp()
}

run()