//Brett Hiebert
//Get Double Data
//Nodejs script to get actor data from backstage.com and saves thumbnail images of each.
//Run tidy data after this script to remove actors without pics
//Lic: MIT
//2020
//=======================
const fs = require('fs')
const axios = require('axios')

run()

async function run() {
  try {
    //get data
    const doubleData = await getActorData()
    //save data as json
    console.log('Saving...')
    fs.writeFile(`../data/doubles.json`, JSON.stringify(doubleData), function(err) {
      if(err) { throw err}
      console.log("All actor data was saved.")
      console.log('Done.')
    })
  } catch(error) {
    console.log('Error: ', error)
  } 
}

async function getActorData() {
  let results = []
  let page = 1
  let pageTo = 200
  try {
    //Until the next page is null or set page length
    while(page && page <= pageTo) {
      console.log('On page: ', page)
      let res = await axios.get(`https://www.backstage.com/talent/async/search/?assets=headshot_available&page=${page}&size=48`)
      let data = res.data
      let actorList = data.items
      let actorsOnPage = []
      //loop through results
      for (let actor of actorList) {
        //collect important data
        let imageUrl = actor.primary_headshot
        let profileUrl = `https://www.backstage.com${actor.talent_profile_url}`
        let actorId = actor.talent_profile_id
        let imagePath = `images/doubles/${actorId}.jpg`
        let actorObj = {
          name: actor.name,
          gender: actor.gender,
          age_max: actor.max_age,
          age_min: actor.min_age,
          id: actorId,
          image_path: imagePath,
          profile: profileUrl
        }
        //push into page list
        actorsOnPage.push(actorObj)
        //download actor image
        downloadImage(imageUrl, actorId)
        //wait a bit
        await sleep(200)
      }
      //add to results list
      results = results.concat(actorsOnPage)
      //save running file in case of crash
      fs.writeFile(`../data/doubles_running.json`, JSON.stringify(results), function(err) {
        if(err) { throw err}
      })
      //assign next page
      page = data.next_page
    }
    console.log('Finished fetching data...')
    return results
  } catch(error) {
    console.log('Error: ', error)
  }
}

async function downloadImage(url, id) {
  try{
    const response = await axios({url, method: 'get', responseType: 'arraybuffer'})
    const buffer = Buffer.from(response.data, 'binary')
    const jpgCheck = new Uint8Array(buffer)
    const c1 = jpgCheck[0]
    const c2 = jpgCheck[1]
    //check to make sure image is jpg
    if(c1===255 && c2 === 216) {
      fs.writeFile(`../images/doubles/${id}.jpg`, jpgCheck, function(err) {
        if(err) { throw err }
        console.log(`Image ${id} saved...`)
      })
    } else {
      console.log(`Image ${id} not jpg, not saved...`)
    } 
  } catch(error) {
    console.log('Error: ', error)
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
} 
        