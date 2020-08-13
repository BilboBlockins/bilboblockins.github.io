//Node script to clean actor data if associated face image is deleted
//Run if any bad images were deleted manually
//A new model will need to be built to replace doubles model
const fs = require('fs')
const actorData = require('../data/doubles.json')

run()

function run() {
  //check if all actors have associated images
  const goodData = getGoodData(actorData)
  //if there are missing images
  if(goodData.length !== actorData.length) {
    //save data as json
    console.log('Issues found, saving tidied data')
    fs.writeFile(`../data/doubles_tidy.json`, JSON.stringify(goodData), function(err) {
      if(err) { return console.log(err) }
      console.log("Tidied data saved...")
      console.log('Done')
    })
  } else {
    console.log('All data ok')
    console.log('Done')
  }
}

function getGoodData(array) {
  let goodData = []
  let uniqueIds = {}
  for(let actor of array) {
    try{
      if (fs.existsSync(`../${actor.image_path}`)) {
        console.log('Image exists...')
        if(!uniqueIds[actor.id]) {
          uniqueIds[actor.id] = true
          goodData.push(actor)
        } else {
          console.log('Found duplicate id...')
        }
      } else {
        console.log('Found missing image...')
      }
    } catch (err) {
      console.log('Error: ', err)
    }
  }
  return goodData
}

