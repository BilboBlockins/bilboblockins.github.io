let imgEl = document.createElement('img')
imgEl.id = 'refImg'
imgEl.width = '320'

async function getFaceData() {
    const faceDataOut = []
    const faceReadErrors = []
    const inputSize = 320
    const scoreThreshold = 0.2
    const inputImgEl = document.querySelector('#refImg')
    const doubleRes = await axios.get('https://bilboblockins.github.io/double/data/stunt_actors.json')
    const doubleData = doubleRes.data
  
    for(let i=0; i<doubleData.length; i++) {
      try {
        console.log('Processing ', doubleData[i].name, '...')
        inputImgEl.src = doubleData[i].image_path
        const faceData = await faceapi
          .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
          .withFaceLandmarks()
          .withFaceDescriptor()
        faceDataOut.push(faceData.descriptor)
      } catch(err) {
        console.log('Error on getting ', doubleData[i].name, ' face data')
        console.log('You should remove bad double/pic from double data')
        let err = {double: doubleData[i].name, id:doubleData[i].id}
        faceReadErrors.push(err)
      }
  
    }
    console.log(faceReadErrors)
    return faceDataOut
  }
  
  function downloadJSON(obj, fileName, contentType) {
      let jsonStr = JSON.stringify(obj)
      let a = document.createElement("a")
      let file = new Blob([jsonStr], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = fileName
      a.click()
  }
  
  async function run() {
    await faceapi.loadTinyFaceDetectorModel('/double/weights/')
    await faceapi.loadFaceLandmarkModel('/double/weights/')
    await faceapi.loadFaceRecognitionModel('/double/weights/')
    
    const doublesModel = await getFaceData()
    console.log(doublesModel)
    downloadJSON(doublesModel, 'doublesModel.json')
    console.log('Finished!')
  }
  
  run()