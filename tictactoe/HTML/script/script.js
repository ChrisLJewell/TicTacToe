let currentPlayer = Math.random() < 0.5;
const NUM_ROWS = 3;
const NUM_COLS = 3;
let startTime;


let gameBoard = [
    ['','',''],
    ['','',''],
    ['','','']
  ]; //end gameBoard 2D array


const grid = document.getElementById('grid');
const cells = document.querySelectorAll(".gameCell");
 let changeH1 = document.querySelector('#status');
 let timerDisplay = document.querySelector('#time');


 function testForWinner() {
    let winner = 'N';  // We can use 'N' to mean 'no winner'
    let winnerSpan = document.querySelector('#status');

    /* Check rows for winner */
    for (let i = 0; i < NUM_ROWS; i++) {
        if (gameBoard[i][0] !== '' && gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][1] === gameBoard[i][2]) {
            winner = gameBoard[i][0];
            break;
        }
    }

    /* Check columns for winner */
    for (let j = 0; j < NUM_COLS; j++) {
        if (gameBoard[0][j] !== '' && gameBoard[0][j] === gameBoard[1][j] && gameBoard[1][j] === gameBoard[2][j]) {
            winner = gameBoard[0][j];
            break;
        }
    }

    /* Check diagonals for winner */
    if ((gameBoard[0][0] !== '' && gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2]) ||
        (gameBoard[0][2] !== '' && gameBoard[0][2] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][0])) {
        winner = gameBoard[1][1];
    }

    /* Check for tie */
    let isBoardFull = true;
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            if (gameBoard[row][col] === '') {
                isBoardFull = false;
                break;
            }
        }
        if (!isBoardFull) {
            break;
        }
    }
    if (winner === 'N' && isBoardFull) {
        winner = 'T'; // Tie
    }

    // Set the winner message
    if (winner === 'X') {
        winnerSpan.innerHTML = "The winner is X.";
       
       
    } else if (winner === 'O') {
        winnerSpan.innerHTML = "The winner is O.";
      
      
    } else if (winner === 'T') {
        winnerSpan.innerHTML = "It's a tie!";
       
        
    }

    if (winner === 'X' || winner === 'O' || winner === 'T') {
        endTime = new Date();
        let durationMilliseconds = endTime - startTime;
        let durationSeconds = durationMilliseconds / 1000;
        let durationMinutes = durationSeconds / 60;
        timerDisplay.innerHTML = "The game was played for " + durationSeconds + " seconds";

         //Remove event listeners from cells
        cells.forEach(cell => {
            cell.removeEventListener('click', cellClicked);
           cell.removeEventListener('click', playerVsAI);
        });

       playAgain();
      


    }
    
} 

 
function playAgain() {
   
    let playAgainButton = document.querySelector('#playAgain');
    playAgainButton.style.display = "block";

    // Determine the selected game mode
    const selectedMode = document.querySelector('input[name="selection"]:checked').value;

}

function resetGame() {
    startTime = new Date();
    timerDisplay.innerHTML = "0";
    gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = 'white';
        // Remove both event listeners first to avoid duplicate listeners
        cell.removeEventListener('click', cellClicked);
        cell.removeEventListener('click', playerVsAI);
    });

    // Clear all radio buttons
    const radioButtons = document.querySelectorAll('input[name="selection"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });

    // Hide the play again button
    document.querySelector('#playAgain').style.display = "none";

    // Optionally, you might want to reset the display indicating the turn
    changeH1.innerHTML = "Select game mode to start";
}




   
  


const playerVsPlayerRadio = document.getElementById('playerVsPlayer');
const playerVsComputerRadio = document.getElementById('playerVsComputer');


playerVsPlayerRadio.addEventListener('change', function() {
    
    cells.forEach(cell => {
        cell.addEventListener('click', cellClicked);
        cell.removeEventListener('click', playerVsAI);
    });
});

playerVsComputerRadio.addEventListener('change', function() {
    
    cells.forEach(cell => {
        cell.addEventListener('click', playerVsAI);
        cell.removeEventListener('click', cellClicked);
    });
});


function cellClicked(event){
  
 let cell = event.target;
 let cellId = cell.id;
 let cellNumber = parseInt(cellId.split('_')[1]); 


 let row = Math.floor(cellNumber / 3);
 let col = cellNumber % 3; 



    if(currentPlayer) {

    if(gameBoard[row][col] == '') {
         gameBoard[row][col] = 'X'; 
         cell.textContent = "X";  
         cell.style.backgroundColor = "#D0BFF5";
         changeH1.innerHTML= "O's turn";
         }

    

  }

    else {
        if(gameBoard[row][col] == '') {
gameBoard[row][col] = 'O'; 
            cell.textContent = "O";
            cell.style.backgroundColor = "#AF93EE";
            changeH1.innerHTML= "X's turn";
        }
    
  
 
  }


 
  currentPlayer = !currentPlayer;  //flip turn

  testForWinner();


}//end handleCellClick

function playerVsAI(event) {
    
    if (event) {
        let cell = event.target;
        let cellId = cell.id;
        let cellNumber = parseInt(cellId.split('_')[1]);
        let row = Math.floor(cellNumber / 3);
        let col = cellNumber % 3;

        // Player's move
        if (gameBoard[row][col] == '') {
            gameBoard[row][col] = 'X';
            cell.textContent = "X";
            cell.style.backgroundColor = "#D0BFF5";
            changeH1.innerHTML = "O's turn";
            testForWinner(); 
            makeAIMove(); 
        }
    } else {
        
        makeAIMove();
    }
}

function makeAIMove() {
    let emptyCells = []; // Array to store indices of empty cells

    // Find all empty cells and store their indices
    for (let i = 0; i < NUM_ROWS; i++) {
        for (let j = 0; j < NUM_COLS; j++) {
            if (gameBoard[i][j] === '') {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    // If there are no empty cells, return (board is full)
    if (emptyCells.length === 0) {
        return;
    }

    // Choose a random empty cell
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let randomCell = emptyCells[randomIndex];

    // Update game board and UI for AI's move
    gameBoard[randomCell.row][randomCell.col] = 'O';
    let cellIdAi = 'cell_' + (randomCell.row * NUM_COLS + randomCell.col);
    let cellAi = document.getElementById(cellIdAi);
    cellAi.textContent = "O";
    cellAi.style.backgroundColor = "#1ECBE1";
    changeH1.innerHTML = "X's turn"; 
    testForWinner();
    
}







