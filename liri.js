require("dotenv").config();
const keys = require("./keys");
const request = require('request');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const fs = require('fs');

var command = process.argv[2];
var query = process.argv;
var queryArr = [];

//Takes in process.argv[x] and pushes it into array
for (var i = 3; i < query.length; i++) {
    queryArr.push(query[i]);
}

//Checks if log.txt exists, if it doesn't, create a new log.txt file
if (fs.existsSync("./log.txt")) {
    console.log("Liri is thinking...");
}
else {
    fs.writeFile("log.txt", "", function (err) {
        if (err) return console.log(err);
        console.log("log.txt created");
    })
}

//Functions===========================================================

function doWhat(command) {
    //Appends that commands into the log.txt file
    fs.appendFile("log.txt", `${command}, `, function (err) {
        if (err) return console.log(err);
    });
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) return console.log(err);

        //Splits the text file with ", "
        var data = data.split(', ');

        //Removes index 0 from the data
        var action = data.shift();

        //Removes duplicates from array
        let uniqueData = [...new Set(data)];

        //Generates a random number from remaining indexes
        var i = Math.floor(Math.random() * uniqueData.length);

        //Searches random song from random.txt
        if (action === "spotify-this-song") {
            spotifyThis(action, uniqueData[i], 20);
            console.log(`Ok, I picked ${uniqueData[i]}.`);
        }
    });
}

function spotifyThis(command, query, limit, empty) {
    //Saves each command to log.txt
    fs.appendFile("log.txt", `${command}, `, function (err) {
        if (err) return console.log(err);
    });

    //If the query is empty, it will show 1 song: Shelter by Porter Robinson
    if (empty) {
        spotify.search({ type: 'track', query: query, limit: limit })
            .then(function (response) {
                var song = response.tracks.items;
                console.log('\n=========================================\n');
                console.log(`You didn't pick a song so I picked one for you <3`);
                console.log('\n=========================================\n');
                console.log(`Artist: \t${song[1].artists[0].name}`);
                console.log(`Song: \t\t${song[1].name}`);
                console.log(`Preview: \t${song[1].href}`);
                console.log(`Album: \t\t${song[1].album.name}`);
                console.log('\n=========================================\n');
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    else {
        spotify.search({ type: 'track', query: query, limit: limit })
            .then(function (response) {
                var song = response.tracks.items;
                console.log("\n ");
                console.log(`Ok, I found ${limit} results for "${query}".`);
                console.log('\n=========================================\n');
                song.forEach(function (track) {
                    console.log(`Artist: \t${track.artists[0].name}`);
                    console.log(`Song: \t\t${track.name}`);
                    console.log(`Preview: \t${track.href}`);
                    console.log(`Album: \t\t${track.album.name}`);
                    console.log('\n=========================================\n');
                })
            })
            .catch(function (err) {
                console.log(err);
            });
    }

};

function movieThis(command, url) {
    fs.appendFile("log.txt", `${command}, `, function (err) {
        if (err) return console.log(err);
    });
    request(url, function (err, response, data) {
        if (err) return console.log(err);
        var movie = JSON.parse(data);
        console.log('\n=========================================\n');
        console.log(`Movie Title: \t${movie.Title}`);
        console.log(`Year: \t\t${movie.Year}`);
        console.log(`IMDB Rating: \t${movie.imdbRating}`);
        console.log(`Country: \t${movie.Country}`);
        console.log(`Language: \t${movie.Language}`);
        console.log(`Plot: \t\t${movie.Plot}`);
        console.log(`Actors: \t${movie.Actors}`);
        console.log('\n=========================================\n');
    })
}

//Spotify Search========================================================

if (command === "spotify-this-song") {
    var querySong = queryArr.join(' ');
    var limit = 20;
    var empty = false;
    if (queryArr.length === 0) {
        querySong = "shelter"
        limit = 2;
        empty = true;
        spotifyThis(command, querySong, limit, empty);
    }
    else {
        //Saves each song to random.txt
        fs.appendFile("random.txt", `, "${querySong}"`, function (err) {
            if (err) return console.log(err);
        });
        spotifyThis(command, querySong, limit, empty);
    }

}

//OMDB search============================================================

else if (command === "movie-this") {
    var url = `http://www.omdbapi.com/?apikey=trilogy&t=${queryArr.join('+')}`;
    if (queryArr.length === 0) {
        url = `http://www.omdbapi.com/?apikey=trilogy&t=the+room`;
        console.log('\n=========================================\n');
        console.log("You didn't pick a movie so I picked one for you <3");
    }
    movieThis(command, url);
}

//do what it says?===================================================

else if (command === "do-what-it-says") {
    doWhat(command);
}

else if (command === "jerk-to-this" || command === "fap-to") {
    var video = queryArr.join(' ');
    searchIt(video);
}

else if (command === "clear-log") {
    fs.writeFile("log.txt", '', function(err) {
        if (err) return console.log(err);
        console.log('\n=========================================\n');
        console.log("Log history succesfully cleared. Is there anything else I can do for you?");
        console.log('\n=========================================\n');
    })
}

else if (command === "reset-random") {
    fs.writeFile("random.txt", `spotify-this-song, "I Want it That Way"`, function(err) {
        if (err) return console.log(err);
        console.log('\n=========================================\n');
        console.log("Random.txt succesfully reset. Is there anything else I can do for you?");
        console.log('\n=========================================\n');
    })
}

else {
    console.log("Error, unable to search.");
}

function searchIt(video, browser) {
    var pornsearch = require('pornsearch').search(video);
    console.log(`I found these results for ${video}.`);
    console.log('\n=========================================\n');
    pornsearch.videos()
        .then(videos =>
            videos.forEach(function (video) {
                console.log(`Title: \t\t${video.title}`);
                console.log(`URL: \t\t${video.url}`);
                console.log(`Duration: \t${video.duration}`);
                console.log('\n=========================================\n');
            })
        );
    
}