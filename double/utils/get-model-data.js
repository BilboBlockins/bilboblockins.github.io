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
        inputImgEl.src = '../' + doubleData[i].image_path
        const faceData = await faceapi
          .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
          .withFaceLandmarks()
          .withFaceDescriptor()
        faceDataOut.push(Array.from(faceData.descriptor))
      } catch(err) {
        console.log('Error on ', doubleData[i].name, ' face data')
        console.log('You should remove bad double/pic from double data')
        let error = {double: doubleData[i].name, id:doubleData[i].id}
        faceReadErrors.push(error)
      }
    }
    if(faceReadErrors.length) {
      //if there were errors, download file of doubles to remove
      console.log('Face read errors: ', faceReadErrors)
      downloadJSON(faceReadErrors, 'doubles_to_remove.json')
    }
    return faceDataOut
  }
  
  function downloadJSON(obj, fileName) {
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
    downloadJSON(doublesModel, 'doubles_model.json')
    console.log('Finished!')
  }
  
  run()