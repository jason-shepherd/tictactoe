const gridSpaces = document.querySelectorAll('[data-spaces]');
const recordText = document.querySelector('[data-record]');
const gridWidth = Math.sqrt(gridSpaces.length);

let player = 'X';
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
            if(gridSpaces[i].innerHTML != '') return;
            gridSpaces[i].innerHTML = player;
            win = getWin(Math.floor(i % gridWidth), Math.floor(i / gridWidth));
            if(win.length !== 0) {
                let condition = "win";

                if(win.length > 3) {
                    record.tie++;
                    condition = "draw";
                } else {
                    record[player]++;
                }
                recordText.innerHTML = `X ${record.X}-${record.ties}-${record.O} O`;

                win.forEach(space => {
                    space.className += ` ${condition}`;
                });
                inPlay = false;
                return;
            }
    
            player = player == 'O' ? 'X' : 'O';
            moveCount++;
        });
    }
}

function getWin(x, y) {
    let winSequence = [];

    for(let row = 0; row < gridWidth; row++) {
        if(getGridSpace(row, y).innerHTML != player) {
            winSequence = []
            break;
        } 

        winSequence.push(getGridSpace(row, y));
        if(row == gridWidth - 1) {
            return winSequence;
        }
    }
    
    for(let col = 0; col < gridWidth; col++) {
        if(getGridSpace(x, col).innerHTML != player) {
            winSequence = [];
            break;
        }

        winSequence.push(getGridSpace(x, col));
        if(col == gridWidth - 1) {
            return winSequence;
        }
    }
    
    if(x == y) {
        for(let dia = 0; dia < gridWidth; dia++) {
            if(getGridSpace(dia, dia).innerHTML != player) {
                winSequence = [];
                break;
            }

            winSequence.push(getGridSpace(dia, dia));
            if(dia == gridWidth - 1) {
                return winSequence;
            }
        }
    }
    
    if(x + y == gridWidth - 1) {
        for(let redia = 0; redia < gridWidth; redia++) {
            if(getGridSpace(redia, gridWidth - 1 - redia).innerHTML != player) {
                winSequence = [];
                break;
            }

            winSequence.push(getGridSpace(redia, gridWidth - 1 - redia));
            if(redia == gridWidth - 1) {
                return winSequence;
            }
        }
    }
    
    if(moveCount == Math.pow(gridWidth, 2) - 1) {
        return gridSpaces; 
    }

    return [];
}


function reset() {
    player = "X";
    moveCount = 0;
    inPlay = true;

    gridSpaces.forEach(space => {
        space.className = "grid-item";
        space.innerHTML = '';
    });
}

function getGridSpace(x, y) {
    return gridSpaces[y * gridWidth + x];
}

init();
