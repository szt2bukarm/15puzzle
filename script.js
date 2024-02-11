const board = document.querySelector('.puzzle-board');
const bottomBar = document.querySelector('.bottom-bar')
const startScreen = document.querySelector('.puzzle-startscreen')
const results = document.querySelector('.results')
const numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const counter = document.querySelector('.counter-num');
const counterResult = document.querySelector('.results-tries')
let emptyField = 14;
let counterNum = 0;

const checkTile = function(e) {
    const offsets = [1,-1,4,-4]
    if (!e.target.closest('.puzzle-board__tile')) return;
    const clickedTileIndex = e.target.closest('.puzzle-board__tile').dataset.index
    const clickedTile = e.target

    
    for(const offset of offsets) {
        const checkedTile = document.querySelector(`[data-index="${+clickedTileIndex + offset}"]`)
        if (checkedTile && checkedTile.innerHTML == "") {
            counterNum++
            counter.innerHTML = counterNum
            clickedTile.classList.add('puzzle-board__tile--empty')
            checkedTile.classList.remove('puzzle-board__tile--empty')
            checkedTile.innerHTML = clickedTile.innerHTML
            clickedTile.innerHTML = ""
            emptyField = clickedTile.dataset.index
            checkBoard()
        }
    }
}

const checkBoard = function() {
    const boardState = [...document.querySelectorAll('.puzzle-board__tile')]
    
    const boardNumbers = [];
    boardState.forEach(tile => {
        if (tile.innerText != "") boardNumbers.push(+tile.innerText)
    });

    let counter = 0;
    boardNumbers.forEach((number,index) => {
        if (number == index + 1) {
            counter++
        }
    })    
    const lastTile = document.querySelector('[data-index="15"');
    if (counter == 15 && lastTile.innerText == "") {
        setTimeout(() => {
            lastTile.innerText = "16";
            lastTile.classList.remove('puzzle-board__tile--empty')    
        }, 150);
        setTimeout(() => {
            showResults()
        }, 500);
    }
}

const reset = function() {
    results.classList.add('paused')
    initBoard()
    counterNum = 0;
    counter.innerText = counterNum
}

const showResults = function () { 
    results.classList.remove('paused')
    counterResult.innerHTML = counterNum
}

const start = function () { 
    startScreen.style.scale = 0;
    startScreen.style.opacity = 0;
    setTimeout(() => {
        startScreen.remove();
        board.classList.remove('paused')
        bottomBar.classList.remove('paused')    
    }, 150);
}

const countInversions = function(arr) {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j] && arr[j] !== "") {
                inversions++;
            }
        }
    }
    return inversions;
}

const isSolvable = function(numbers) {
    const inversions = countInversions(numbers);
    if (numbers.length % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        const emptyIndex = numbers.findIndex(num => num === "");
        const emptyRowFromBottom = Math.floor((numbers.length - emptyIndex) / 4);
        return (emptyRowFromBottom % 2 === 0 && inversions % 2 === 1) || (emptyRowFromBottom % 2 === 1 && inversions % 2 === 0);
    }
}

let shuffledNumbers
const initBoard = function() {
    let solvable = false;
    while (!solvable) {
        shuffledNumbers = numbers.sort(() => .5 - Math.random());
        solvable = isSolvable(shuffledNumbers);
    }
    board.innerHTML = ""
    emptyField = Math.trunc(Math.random() * 16)
    let index = 0;
    for (let i = 0; i < 16; i++) {
        if (i == emptyField) {
            const html = `<div data-index=${i} class="puzzle-board__tile puzzle-board__tile--empty"></div>`
            board.insertAdjacentHTML('beforeend',html)
        } else {
            const html = `<div class="puzzle-board__tile" data-index=${i}>${shuffledNumbers[index]}</div>`
            board.insertAdjacentHTML('beforeend',html)
            index++;
        }
    }
}

document.addEventListener('keyup', function (e) { 
    const button = e.key;
    try {
        switch(button) {
            case 'ArrowUp':
                document.querySelector(`[data-index="${+emptyField + 4}"]`).click();
                break;
            case 'ArrowDown':
                document.querySelector(`[data-index="${+emptyField - 4}"]`).click();
                break;
            case 'ArrowLeft':
                document.querySelector(`[data-index="${+emptyField + 1}"]`).click();
                break;
            case 'ArrowRight':
                document.querySelector(`[data-index="${+emptyField - 1}"]`).click();
                break;
            default:
                break;
        }    
    } catch (err) {
    }
})


// initBoard()
board.addEventListener('click',checkTile)
