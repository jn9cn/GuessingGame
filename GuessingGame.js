//Javascript starts here

function generateWinningNumber() {
    return Math.floor(Math.random()*100+1);
}

//Fisher–Yates shuffle: https://bost.ocks.org/mike/shuffle/
function shuffle(arr) {
    /*var m = arr.length, t, i;
    //While there remain elements to shuffle
    while (m) {
        //Pick a remaining element
        i = Math.floor(Math.random()*m--);
        //and swap it with the current element
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }*/
    for (var i=arr.length-1; i>0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1));
        var temp = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (guess <= 0 || guess > 100 || typeof guess !== 'number') {
        throw "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();    
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        //jquery additions
        $('#hint, #submit').prop("disabled", true);
        $('#subtitle').text("Press 'Reset' to play again!");
        return "You Win!";
    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
            return "You have already guessed that number.";
        } else {
            this.pastGuesses.push(this.playersGuess);
            //jquery addition
            $('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                //jquery additions
                $('#hint, #submit').prop("disabled", true);
                $('#subtitle').text("Press 'Reset' to play again!");
                return "You Lose.";
            } else {
                var diff = this.difference();
                //refactored with jquery additions
                if(this.isLower()) {
                    $('#subtitle').text('Higher!');
                } else {
                    $('#subtitle').text('Lower!');
                }
                if (diff<10) {
                    return "You\'re burning up!";
                } else if (diff<25) {
                    return "You\'re lukewarm.";
                } else if (diff<50) {
                    return "You\'re a bit chilly.";
                } else if (diff<100) {
                    return "You\'re ice cold!";
                }
            }
        }
    }
}

function newGame() {
    return new Game;
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

// jQuery starts here

function makeAGuess(game) {
    var guess1 = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess1,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();
    $('#submit').click(function() {
        makeAGuess(game);
    });
    $('#player-input').keypress(function(event) {
        // If the 'enter' or 'return' key is pressed
        if (event.which==13) {
            makeAGuess(game);
        };
    });
    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('*Psst!* Pick '+hints[0]+', '+hints[1]+', or '+hints[2]+'.')
    });
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100');
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
    });
});