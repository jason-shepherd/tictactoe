const gridSpaces = document.querySelectorAll('[data-spaces]');
const recordText = document.querySelector('[data-record]');
const gridWidth = Math.sqrt(gridSpaces.length);

ai = "O"
player = "X"

let record = {
    X: 0,
    O: 0,
    ties: 0
}
let moveCount = 0;
let inPlay = true;

function init() {
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
            if(win.length !== 0) {
                let condition = "win";

                if(win.length === gridSpaces.length) {
                    record.ties++;
                    condition = "draw";
                } else {
                    record[player]++;
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
    
            moveCount++;
        });
    }
}

function checkRowSpace(index, x, y) {
    return getGridSpace(index, y);
}

function checkColSpace(index, x, y) {
    return getGridSpace(x, index);
}

function checkDiagonal(index, x, y) {
    if(x == y)
        return getGridSpace(index, index);
    else
        return null;
}

function checkAntiDiagonal(index, x, y) {
    if(x + y == gridWidth - 1)
        return getGridSpace(index, gridWidth - 1 - index);
    else
        return null
}

const checkFunctions = [checkRowSpace, checkColSpace, checkDiagonal, checkAntiDiagonal];
function getWin(x, y, currentPlayer) {
    let winSequence = [];

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < gridWidth; j++) {
            let currentSpace = checkFunctions[i](j, x, y);

            if(getSpaceValue(currentSpace) != currentPlayer) {
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

function minimax(board, depth, maximizingPlayer) {
    if(depth == 0 )
        return
    if(maximizingPlayer) {
        value = -10

    }
}

function evaluateMove(x, y) {
    if(getWin(x, y, "O").length == 3)
        return 10;
    else if(getWin(x, y, "X").length == 3)
        return -10;
    else
        return 0;
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

function getSpaceValue(x, y) {
    if(x == null)
        return
    else if(typeof x === 'object')
        return x.firstChild.textContent;
    else if(y === undefined)
        return gridSpaces[x].firstChild.textContent;
    else
        return gridSpaces[y * gridWidth + x].firstChild.textContent;
}

function setSpaceValue(index, value) {
    gridSpaces[index].firstChild.textContent = value;
}

function getGridSpace(x, y) {
    return gridSpaces[y * gridWidth + x];
}

init();
