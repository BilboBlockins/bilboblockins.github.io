//Brett Hiebert
//Get Double Data
//Nodejs script to get actor data from backstage.com and saves thumbnail images of each.
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
    fs.writeFile(`../data/stunt_actors.json`, JSON.stringify(doubleData), function(err) {
      if(err) { return console.log(err) }
      console.log("All actor data was saved")
      console.log('Done.')
    })
  } catch(error) {
    console.log('Error: ', error)
  } 
}

async function getActorData() {
  let results = []
  let page = 1
  try {
    //Until the next page is null
    while(page) {
      console.log('On page: ', page)
      let res = await axios.get(`https://www.backstage.com/talent/async/search/?assets=headshot_available&page=${page}&size=48&skill=23`)
      let data = res.data
      let actorList = data.items
      let actorsOnPage = []
      //loop through results
      for (let actor of actorList) {
        //collect only important data
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
      }
      //add to results list
      results = results.concat(actorsOnPage)
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
    const response = await axios({url, method: 'get', responseType: 'stream'})
    await response.data.pipe(fs.createWriteStream(`../images/doubles/${id}.jpg`))
    console.log(`Image ${id} saved...`)
}
        