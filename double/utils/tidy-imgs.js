//Node script to remove images that were removed from actor data due to bad face read
//Run after getting new doubles model
const fs = require('fs')
const removeData = require('../data/doubles_to_remove.json')
//https://bilboblockins.github.io/double/utils/get-model-data.html
run()

function run() {
  //check if all actors have associated images
  removeImgs(removeData)
  console.log('All bad images removed...')
  console.log('Done')
}

function removeImgs(array) {
  for(let actor of array) {

  }
}