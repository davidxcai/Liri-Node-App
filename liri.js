require("dotenv").config();
const keys = require("./keys");
const fs = require('fs');
const inquirer = require("inquirer");
const request = require('request');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

//Input variables
var command = process.argv[2];
var query = process.argv.slice(3).join(' ');

var divider = '\n=========================================\n';

console.log("\nLiri is thinking...");

//=======================Logs Commands================================
var logThis = function(command) {
    var time = moment().format('h:mma MMM DD, YYYY');
    fs.appendFile("log.txt", `[${time}]: ${command}\n`, function (err) {
        if (err) return console.log(err);
    });
}

//===============Do what it says======================================
function doWhat(command) {
    //Appends that commands into the log.txt file
    logThis(command);
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) return console.log(err);
        var data = data.split(', ');                             //Splits the text file with ", "
        var action = data.shift();                               //Removes index 0 from the data
        let uniqueData = [...new Set(data)];                     //Removes duplicates from array
        var i = Math.floor(Math.random() * uniqueData.length);   //Generates a random number from remaining indexes
        if (action === "spotify-this-song") {                    //Searches random song from random.txts
            spotifyThis(action, uniqueData[i].replace('"', ''), 20);
            console.log(`\nOk, I picked ${uniqueData[i]}.`);
        }
    });
}

//=======================Spotify========================================
function spotifyThis(command, query, limit, empty) {
    //Saves each command to log.txt
    logThis(command);
    //callback from the spotify command, passes a boolean value, continues to check if true
    var noSong = empty;
    spotify.search({ type: 'track', query: query, limit: limit })
        .then(function (response) {
            var print = function (track) {
                console.log(`Artist: \t${track.artists[0].name}`);
                console.log(`Song: \t\t${track.name}`);
                console.log(`Preview: \t${track.href}`);
                console.log(`Album: \t\t${track.album.name}`);
                console.log(divider);
            }
            //If the query is empty, it will show 1 song: Shelter by Porter Robinson
            if (noSong) {
                var song = response.tracks.items[1];
                console.log(divider);
                console.log(`You didn't pick a song so I picked one for you <3`);
                console.log(divider);
                print(song);
            }
            else {
                var song = response.tracks.items;
                console.log(divider);
                console.log(`I found ${song.length} results for "${query}".`);
                console.log(divider);
                song.forEach(function (track) {
                    print(track);
                })
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

function movieThis(command, url) {
    logThis(command);
    request(url, function (err, x, data) { //x is never used because it's full of response codes
        if (err) return console.log(err);
        var movie = JSON.parse(data);
        if (movie.Response === "False") {
            console.log(divider);
            console.log(`Sorry, I couldn't find what you're looking for.`);
            console.log(`Please check to see if you spelled it correctly and exactly as it appears.`);
            console.log(divider);
        }
        else {
            console.log(divider);
            console.log(`Movie Title: \t${movie.Title}`);
            console.log(`Year: \t\t${movie.Year}`);
            console.log(`IMDB Rating: \t${movie.imdbRating}`);
            console.log(`Country: \t${movie.Country}`);
            console.log(`Language: \t${movie.Language}`);
            console.log(`Plot: \t\t${movie.Plot}`);
            console.log(`Actors: \t${movie.Actors}`);
            console.log(divider);
        }
    })
}

//Spotify Search========================================================

if (command === "spotify-this-song" || command === "spotify-this") {
    if (!query) {
        query = "shelter"
        spotifyThis(command, query, 2, true);
    }
    else {
        //Saves each song to random.txt
        fs.appendFile("random.txt", `, "${query}"`, function (err) {
            if (err) return console.log(err);
        });
        spotifyThis(command, query, 20, false);
    }
}

//OMDB search============================================================

else if (command === "movie-this" || command === "movie") {
    var url = `http://www.omdbapi.com/?apikey=trilogy&t=${query}`;
    if (!query) {
        url = `http://www.omdbapi.com/?apikey=trilogy&t=the+room`;
        console.log(divider);
        console.log("You didn't pick a movie so I picked one for you <3");
    }
    movieThis(command, url, query);
}

//do what it says?===================================================

else if (command === "do-what-it-says" || command === "random") {
    doWhat(command);
}

else if (command === "clear-log") {
    inquirer.prompt({
        name: "confirm",
        message: "Are you sure? y/n",
        validate: function (value) {
            if (value === "y" || value === "n") {
                return true;
            }
            else {
                console.log('\nError. Please enter "y" or "n".\n');
                return false;
            }
        }
    }).then(function (answer) {
        var confirm = answer.confirm;
        if (confirm === "y") {
            fs.writeFile("log.txt", '', function (err) {
                if (err) return console.log(err);
            });
            console.log(divider);
            console.log("Log history succesfully cleared. Is there anything else I can do for you?");
            console.log(divider);
        }
        else if (confirm === "n") {
            console.log("Log.txt not cleared.");
        }
    })
}

else if (command === "reset-random") {
    fs.writeFile("random.txt", `spotify-this-song, "I Want it That Way"`, function (err) {
        if (err) return console.log(err);
        console.log(divider);
        console.log("Random.txt succesfully reset. Is there anything else I can do for you?");
        console.log(divider);
    })
}

else {
    console.log("\nError, unable to search.");
}