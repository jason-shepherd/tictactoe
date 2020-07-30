# A simple Tic Tac Toe
My version of tic tac toe is pretty simple. The AI uses the minimax algorithm to choose a move. If you happen to have a friend you can also play with this (on the same pc). To reset the game after completing a match, just click the board.

![Playing](https://i.gyazo.com/486b8b7997db8c90cdb6ad488ba618ce.gif)
![X Wins!](https://i.gyazo.com/9b9555492d95a5636af88729b3327230.gif)
![Cat's Game :(](https://i.gyazo.com/c94ca82629d4297510e401b81786c607.gif)

# Javascript Practice
I am just learning javascript, in fact this is my first javascript project. I honestly didn't do much research beforehand on javascript. I just kind of went for it and while I was programming this I tryed to learn as much as possible. This project is guarenteed to be flawed. I'm probably doing a few things that would make a javascript vetern cringe into his esophagus, but that's okay. As long as I can find, change, and learn from those mistakes.

# The AI
The AI in this implementation uses the minimax algorithm to look ahead at the possible moves and make the move that maximizes the score of the AI while minimizing the player's score. This allows for an unbeatable tic tac toe AI. The algorithm can also take in a depth that controls how far in the future the AI looks. I use this depth to control the difficultly of the AI. I still need to tweak the difficulties. The algorithm is really cool. It uses recursion to create a tree of possible moves. Then it uses two players to pick moves from the tree. One player is the maximizing player (the AI) and one is the minimizing player (the player). The players go down the tree at each level and pick moves alternating at each level. If the maximizing player is up then it picks the moves with the highest values and the minimizing player chooses the moves with the lowest value. This lets the AI pick moves that maximize it's score while minimizing the score of the player. I don't think I explained this well so I'll link a graphic and the wikipedia page below.  
https://en.wikipedia.org/wiki/Minimax
![Minimax Tree](https://nestedsoftware.com/assets/images/2019-06-15-tic-tac-toe-with-the-minimax-algorithm-5988.123625/eo3qr44bp1w96a92t8s2.png)
This graphic show's off the algorithm pretty well. The only difference between this and my own is that I also evaluate the how fast the AI wins, so the AI will make the moves that ensure a speedy victory.

# Wanna help me out?
Like I said this project was build to help me learn javascript. So, if you already know javascript, then help me out!. I am stupid, so this project has a ton of mistakes, or things that are considered "poor practice". If you see something like this, please tell me! I haven't used github much, but I'd think that would fit in the "Issues" tab. Thanks!

# The Future
Well I wanted to add an AI and I did (more about that above). The only thing this implementation is missing is multiplayer. I doubt I will ever add multiplayer to this example because I don't have anywhere to host the server.
