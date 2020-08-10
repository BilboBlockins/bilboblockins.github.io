//Get-Double-Data
//Collects actor data from backstage.com and saves thumbnail images of each.
//Todo: collect data automatically before fetching the pictures.
//Todo: Should have a loop for stunt actors and regular actors.
//Run in Node.
const https = require('https')
const fs = require('fs')
const stuntData = require('./data/stunt.json') // will remove

let stuntActors = []
stuntData.items.forEach((actor) => {
    //collect important data
    let imageUrl = actor.primary_headshot_square
    let profileUrl = `https://www.backstage.com${actor.talent_profile_url}`
    let actorId = actor.talent_profile_id
    let imagePath = `images/doubles/${actorId}.jpg`
    let stuntActor = {
        name: actor.name,
        gender: actor.gender,
        age_max: actor.max_age,
        age_min: actor.min_age,
        id: actorId,
        image_path: imagePath,
        profile: profileUrl
    }
    //save image
    https.get(`${imageUrl}`,(response) => {
        let imageData = ''
        response.setEncoding('binary')
        response.on('data', (chunk) => { imageData += chunk })
        response.on('end', () => {
            fs.writeFile(`../images/doubles/${actorId}.jpg`, imageData, 'binary', function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            })
        })
        
    })
    //save actor
    stuntActors.push(stuntActor)
})

//save actor object
fs.writeFile(`./data/stunt_actors.json`, JSON.stringify(stuntActors), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("All stunt actors are saved!");
})
        