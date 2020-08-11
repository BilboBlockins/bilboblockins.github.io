async function getFaceData() {
    const faceDataOut = []
    const faceReadErrors = []
    const actorDataTidy = []
    const inputSize = 320
    const scoreThreshold = 0.2
    const inputImgEl = document.querySelector('#refImg')
    const doubleRes = await axios.get('https://bilboblockins.github.io/double/data/stunt_actors.json')
    const doubleData = doubleRes.data
  
    for(let i=0; i<doubleData.length; i++) {
      try {
        console.log(`${i} Processing `, doubleData[i].name, '...')
        let imgPath = '../' + doubleData[i].image_path
        inputImgEl.src = imgPath
        const faceData = await faceapi
          .detectSingleFace(inputImgEl, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold}))
          .withFaceLandmarks()
          .withFaceDescriptor()
        if(faceData) {
          faceDataOut.push(Array.from(faceData.descriptor))
          actorDataTidy.push(doubleData[i])
        } else {
          throw 'Face not found'
        }
      } catch(err) {
        console.log('Error on ', doubleData[i].name)
        console.log(err, ': you should remove bad pic and replace actors with tidy list.')
        let error = {double: doubleData[i].name, id:doubleData[i].id, error:err}
        faceReadErrors.push(error)
      }
    }
    if(actorDataTidy.length) {
      //If a face wasn't found, save tidied list to update actor data
      console.log('Saving tidied actor data...')
      downloadJSON(actorDataTidy, 'stunt_actors_tidy.json')
    }
    if(faceReadErrors.length) {
      //if there were errors, download file of double pics to remove
      console.log('Saving face read errors...')
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
    downloadJSON(doublesModel, 'doubles_model.json')
    console.log('Finished!')
  }
  
  run()
  