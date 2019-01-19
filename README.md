# Liri-Node-App

[Demo Video](https://www.youtube.com/watch?v=GuqOw0KKHaM)

This is an application used in node.js utilizing Spotify and OMDB APIs to search for content.

This requires you to have your own API key for Spotify to work.

Here are the available commands the user can input from the terminal:

| Commands           | Function                              | Parameter      |
| ------------------ |:-------------------------------------:| :-------------:|
| spotify-this-song  | Searches song from spotify            | song(optional) |
| movie-this         | Searches movie from OMDB              | movie(optional)|
| do-what-it-says    | Selects random song from "random.txt" | null           |

Commands are then saved to a "log.txt" file. If there isn't a log.txt file, it will create one.

Songs or movies searched will be saved in "random.txt" which will be read with the `do-what-it-says` command.

*If you leave the `song` or `movie` field empty, it will pick a pre-selected song/movie for you by default.

Packages required are `request` and `node-spotify-api`.