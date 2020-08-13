//Node script to verify that all actors have imgs
//Run after getting double data and before getting model data
const fs = require('fs')
const actorData = require('../data/doubles.json')

run()

function run() {
  //check if all actors have associated images
  const missingFiles = checkImgs(actorData)
  //if there are missing links
  if(missingFiles.length) {
    //save data as json
    console.log('Problems found, saving...')
    fs.writeFile(`../data/missing_images.json`, JSON.stringify(missingFiles), function(err) {
      if(err) { return console.log(err) }
      console.log("Problems saved...")
      console.log('Done')
    })
  } else {
    console.log('All images ok')
    console.log('Done')
  }
}

function checkImgs(array) {
  let problems = []
  for(let actor of array) {
    try{
      if (fs.existsSync(`../${actor.image_path}`)) {
        console.log('File exists...')
      } else {
        console.log('Found missing image...')
        problems.push({name: actor.name, id: actor.id})
      }
    } catch (err) {
      console.log('Error: ', err)
    }
  }
  return problems
}
