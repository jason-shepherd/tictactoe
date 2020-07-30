const gridSpaces = document.querySelectorAll('[data-spaces]');
const recordText = document.querySelector('[data-record]');
const difficultySelect = document.querySelector('[data-select]')
const gridWidth = Math.sqrt(gridSpaces.length);

let opponent = "O"
let player = "X"

let difficulty;

let record = {
    X: 0,
    O: 0,
    ties: 0
}
let moveCount = 0;
let inPlay = true;

function init() {
    updateDifficulty();
    for(let i = 0; i < gridSpaces.length; i++) {
        gridSpaces[i].addEventListener('click', () => {
            if(!inPlay) {
                reset();
                return;
            }
            if(getSpaceValue(i) != '') return;

            setSpaceValue(i, player);
            gridSpaces[i].style.cursor = "default";
            win = getWin(Math.floor(i % gridWidth), Math.floor(i / gridWidth), player);
            displayWin(win, player);
            moveCount++;
            
            if(inPlay) {
                if(difficulty != 0)
                    makeAiMove();
                else 
                    player = player == "O" ? "X" : "O";
            }
        });
    }
}

function displayWin(win, currentPlayer) {
    if(win.length !== 0) {
        let condition = "win";

        if(win.length === gridSpaces.length) {
            record.ties++;
            condition = "draw";
        } else {
            record[currentPlayer]++;
        }
        recordText.textContent = `X ${record.X}-${record.ties}-${record.O} O`;

        win.forEach(space => {
            space.firstChild.classList.add(condition);
        });

        gridSpaces.forEach(space => {
            space.style.cursor = "pointer";
        });
        inPlay = false;
        return;
    }
}

function checkRowSpace(index, x, y, board) {
    return getGridSpace(index, y, board);
}

function checkColSpace(index, x, y, board) {
    return getGridSpace(x, index, board);
}

function checkDiagonal(index, x, y, board) {
    if(x == y)
        return getGridSpace(index, index, board);
    else
        return null;
}

function checkAntiDiagonal(index, x, y, board) {
    if(x + y == gridWidth - 1)
        return getGridSpace(index, gridWidth - 1 - index, board);
    else
        return null
}

const checkFunctions = [checkRowSpace, checkColSpace, checkDiagonal, checkAntiDiagonal];
function getWin(x, y, currentPlayer, board) {
    let winSequence = [];

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < gridWidth; j++) {
            let currentSpace = checkFunctions[i](j, x, y, board);
            
            if(board == undefined) {
                if(getSpaceValue(currentSpace) != currentPlayer) {
                    winSequence = [];
                    break;
                }
            } else if(currentSpace != currentPlayer) {
                winSequence = [];
                break;
            }

            winSequence.push(currentSpace);
            if(j == gridWidth - 1) {
                return winSequence;
            }
        }
    }

    if(moveCount == Math.pow(gridWidth, 2) - 1) {
        return gridSpaces; 
    }

    return winSequence;

}

function makeAiMove() {
    let bestVal = -11;
    let bestMove;
    let newBoard = [];

    gridSpaces.forEach(space => {
        newBoard.push(getSpaceValue(space));
    });

    for(let i = 0; i < newBoard.length; i++) {
        if(newBoard[i] == '') {
            newBoard[i] = 'O';
            let value = minimax(newBoard, difficulty, false);
            if(value > bestVal) {
                bestVal = value;
                bestMove = i;
            }
            newBoard[i] = '';
        }
    }

    setSpaceValue(bestMove, 'O');
    win = getWin(Math.floor(bestMove % gridWidth), Math.floor(bestMove / gridWidth), opponent);
    displayWin(win, opponent);
    moveCount++;
}

function minimax(board, depth, maximizingPlayer) {
    let score = scoreBoard(board, depth);
    if(depth == 0 || isTerminating(board) || score != 0)
        return score;
    if(maximizingPlayer) {
        let value = -10;
        for(let i = 0; i < board.length; i++) {
            if(board[i] == '') {
                board[i] = 'O';
                value = Math.max(value, minimax(board, depth - 1, false));
                board[i] = '';
            }
        }
        return value;
    } else {
        let value = 10;
        for(let i = 0; i < board.length; i++) {
            if(board[i] == '') {
                board[i] = 'X';
                value = Math.min(value, minimax(board, depth - 1, true));
                board[i] = '';
            }
        }
        return value;
    }
}

function isTerminating(board) {
    for(let i = 0; i < board.length; i++) {
        if(board[i] == '')
            return false;
    }
    return true;
}

function scoreBoard(board, depth) {
    let currentPlayer = "O";
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 3; j++) {
            if(getWin(j, j, currentPlayer, board).length == 3) {
                if(currentPlayer == "O")
                    return 10 - (difficulty - depth);
                else
                    return -10 + (difficulty - depth);
            }
        }
        currentPlayer = "X";
    }
    return 0;
}

function updateDifficulty() {
    if(difficultySelect.value != "friend") {
        switch(difficultySelect.value) {
            case "easy":
                difficulty = 3;
                break;
            case "medium":
                difficulty = 4;
                break;
            case "hard":
                difficulty = 5;
                break;
            case "unbeatable":
                difficulty = 9;
                break;
        }
        if(player == "O") {
            player = "X";
            makeAiMove();
        }
    } else {
        difficulty = 0;
    }
}

function reset() {
    player = "X";
    moveCount = 0;
    inPlay = true;

    for(let i = 0; i < gridSpaces.length; i++) {
        gridSpaces[i].firstChild.classList.remove("win");
        gridSpaces[i].firstChild.classList.remove("draw");
        setSpaceValue(i, "");
    }
}

function getSpaceValue(x, y, board) {
    if(x == null)
        return;
    else if(typeof x === 'object')
        return x.firstChild.textContent;
    else if(y == undefined)
        return gridSpaces[x].firstChild.textContent;
    else
        return gridSpaces[y * gridWidth + x].firstChild.textContent;
}

function setSpaceValue(index, value) {
    gridSpaces[index].firstChild.textContent = value;
}

function getGridSpace(x, y, board) {
    if(board != undefined)
        return board[y * gridWidth + x];
    else
        return gridSpaces[y * gridWidth + x];
}

init();
