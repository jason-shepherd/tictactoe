//Get the board, record, and select html elements
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
    //Init the board spaces with an event listener
    for(let i = 0; i < gridSpaces.length; i++) {
        gridSpaces[i].addEventListener('click', () => {
            if(!inPlay) {
                reset();
                return;
            }
            if(getSpaceValue(i) != '') return;

            //Player's move
            setSpaceValue(i, player);
            gridSpaces[i].style.cursor = "default";
            win = getWin(Math.floor(i % gridWidth), Math.floor(i / gridWidth), player);
            displayWin(win, player);
            moveCount++;
            
            //AI move
            if(inPlay) {
                if(difficulty != 0)
                    makeAiMove();
                else 
                    player = player == "O" ? "X" : "O";
            }
        });
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

function makeAiMove() {
    let bestVal = -11;
    let bestMove;
    let newBoard = [];

    gridSpaces.forEach(space => {
        newBoard.push(getSpaceValue(space));
    });
    
    let possibleMoves = getBoardChildren(newBoard, "O");
    if(difficulty != 9)
        possibleMoves.sort((a, b) => {return 0.5 - Math.random()})
    possibleMoves.forEach(child => {
        let value = minimax(child, difficulty, false);
        if(value > bestVal) {
            bestVal = value;
            bestMove = child;
        }
    });

    for(let i = 0; i < bestMove.length; i++) {
        if(getSpaceValue(i) != bestMove[i]) {
            setSpaceValue(i, 'O');
            let win = getWin(Math.floor(i % gridWidth), Math.floor(i / gridWidth), opponent);
            displayWin(win, opponent);
        }
    }
    moveCount++;
}

function minimax(board, depth, maximizingPlayer) {
    let score = scoreBoard(board, depth);
    if(depth == 0 || isTerminating(board) || score != 0)
        return score;
    if(maximizingPlayer) {
        let value = -10;
        getBoardChildren(board, opponent).forEach(child => {
            value = Math.max(value, minimax(child, depth - 1, false));
        });
        return value;
    } else {
        let value = 10;
        getBoardChildren(board, player).forEach(child => {
            value = Math.min(value, minimax(child, depth - 1, true));
        });
        return value;
    }
}

function getBoardChildren(board, currentPlayer) {
    let children = [];
    for(let i = 0; i < board.length; i++) {
        if(board[i] == '') {
            board[i] = currentPlayer;
            children.push([...board]);
            board[i] = '';
        }
    }
    return children;
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
                difficulty = 1;
                break;
            case "medium":
                difficulty = 4;
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
