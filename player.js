// Over the course of this assignment you are going to put together a function which uses constructors and user input to create and manage a team of players.

// Start out by creating a constructor function called "Player" with the following properties and methods...

// name: Property which contains the player's name

// position: Property which holds the player's position

// offense: Property which is a value between 1 and 10 to show how good this player is on offense

// defense: Property which is a value between 1 and 10 to show how good this player is on defense

// goodGame: Method which increases either the player's offense or defense property based upon a coinflip.

// badGame: Method which decreases either the player's offense or defense property based upon a coinflip.

// printStats: Method which prints all of the player's properties to the screen

// Now create a program which allows the user to create 3 unique players; 2 starters and a sub. It should take as user input the name, position, offense, and defense of each player.

// Once all of the players have been created, print their stats.
var inquirer = require('inquirer');

function Player(name, position, offense, defense) {
    this.name = name,
    this.position = position,
    this.offense = offense,
    this.defense = defense
}

Player.prototype.printInfo = function () {
    console.log(`Name: ${this.name} \nPosition: ${this.position} \nOffense: ${this.offense} \nDefense: ${this.defense}`);
};

Player.prototype.goodGame = function () {
    var coinflip = Math.floor(Math.random() * 2) + 1;
    if (coinflip === 1) {
        this.offense++;
        console.log('Increased Offense');
    }
    else {
        this.defense++;
        console.log('Increased Defense');
    }
};

Player.prototype.badGame = function () {
    var coinflip = Math.floor(Math.random() * 2) + 1;
    if (coinflip === 1) {
        this.offense--;
        console.log('Decreased Offense');
    }
    else {
        this.defense--;
        console.log('Decreased Defense');
    }
};

var starters = [];
var subs = [];
var team = [];

var count = 0;

var createPlayer = function() {
    if (count < 3) {
        inquirer.prompt([
            {
                name: 'name',
                message: "What is the player's name?"
            },
            {
                name: 'position',
                message: "What is the player's position?"
            },
            {
                name: 'offense',
                message: "What is the player's offense?"
                // Validate: function(value) 
            },
            {
                name: 'defense',
                message: "What is the player's defense?"
            }
        ]).then(function(answers) {
            var newPlayer = new Player(
                answers.name,
                answers.position,
                Number(answers.offense),
                Number(answers.defense)
            );

            if (answers.position === "starter") {
                starters.push(newPlayer);
                team.push(newPlayer);
                console.log("Added to starters.");
            }
            else if (answers.position === "sub") {
                subs.push(newPlayer);
                team.push(newPlayer);
                console.log("Added to subs.");
            }

            newPlayer.printInfo();

            count++;

            createPlayer();
        })
    }
    else {
        console.log("All players have been created.");
        count = 0;
        console.log("Let's play the fuckin game.");
        playGame();
        }
};

createPlayer();

var teamScore = 0;

var playGame = function() {
    if (count < 5) {
        var firstNum = Math.floor(Math.random() * 20) + 1;
        var secondNum = Math.floor(Math.random() * 20) + 1;
        var sumOffense = starters[0].offense + starters[1].offense;
        var sumDefense = starters[0].defense + starters[1].defense;
        if (firstNum < sumOffense) {
            teamScore++;
            console.log('Your team gained 1 point');
        }
        if (secondNum > sumDefense) {
            teamScore--;
            console.log('Your team lost 1 point');
        }
        inquirer.prompt([
            {
                name: "subout",
                message: "Who would you like to switch out?"
            },
            {
                name: "subin",
                message: "Who would you like to switch in?"
            }
        ]).then(function(players) {
            subs.push(starters.name.players.subout);
            starters.push(subs.name.players.subin);
        })

    }
}