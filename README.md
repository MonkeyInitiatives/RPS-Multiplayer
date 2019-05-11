# RPS-Multiplayer

## Overview

This Rock Paper Scissors game is inspired by the movie Blade Runner. Instead of fighting with rock, paper, or scissors, a player instead chooses one of three corporations (Atari, Wallace, or Tyrell). When a player first loads the page, they are greeted with a prompt asking for their name. If there are less than 2 players on the site, the player is allowed to play the game. Any players joining after the initial two are allowed to watch the game be played and chat in the chatroom, but they do not get to play the game. After both players select their choice, the game updates one another to display both choices and determine the round winner. After a brief period, the game returns to its natural state and allows the players to pick their choices again. When a player is done playing the game, they are encouraged to press the quit button at the bottom of the page and then close the browser window. When both players have left, the chat should be erased and all players should be removed from the game.

## Technologies

Firebase, CSS, HTML, Bootstrap, Javascript, and Jquery. 

## Notes

This was challenging. The code logic works, with wins, losses, and ties being fine. The chatroom works well, where player names and timestamps are written and displayed and updated whenever a new chat comment is submitted. A player can only chat if they entered in a user name when prompted. Moreover, the chat name is stored as session storage so if they leave the page and return, they can choose their name again. The site is mobile responsive and I tested it on my iPad. I used a timer to automatically advance to the next round of the game after 7 seconds, and only after both players have chosen their selection does the game update both players so they can see what the other player chose for their selection. All and all, I think it works as intended.

## Issues

I could not solve consistently how to delete a player from the database when they left the game. I initially tried an event listener for when a window closes, but it only worked some of the time, and it's only working on Chrome. I was then suggested to have a quit button, which I added and is displayed prominently, which mimics the same behavior. However, it sometimes doesn't update the firebase database. I don't know if it is because of my code or I've been testing it too frequently and I get rate limited or something, but the general problem is sometimes it works perfectly and other times it doesn't, and I've done nothing different from when the times it works and does not work. The quit button should close the window after it is pressed, but again this does not work consistently. As I wrote in the overview, the best way to play is when leaving the game, first press the quit button, then close the window. 
