//Node script to remove images that were removed from actor data due to bad face read
//Run after getting new doubles model
const fs = require('fs')
const removeData = require('../data/doubles_to_remove.json')

run()

function run() {
  //Loop through marked to remove list
  removeImgs(removeData)
}

function removeImgs(array) {
  for(let i=0;i<array.length;i++) {
    // delete a each image
    fs.unlink(`../images/doubles/${array[i].id}.jpg`, (err) => {
      if (err) {
          throw err
      }
      console.log(`${array[i].id}.jpg deleted...`)
    })
  }
}