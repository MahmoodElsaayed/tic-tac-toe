const TicTacToeGame = (function () {
    function Gameboard(Cell) {
        const board = [];
        for (let i = 0; i < 9; i++) { board.push(Cell()) };

        const getBoard = () => board;

        const insertToken = (cellIndex, token) => {
            board[cellIndex].setValue(token);
        }

        const getAvailableCells = () => {
            return board.reduce((array, cell, index) => {
                if (!cell.getValue()) array.push(index);
                return array;
            }, [])
        }

        const resetBoard = () => {
            for (let i = 0; i < board.length; i++) {
                board[i].setValue(null);
            }
        }

        return {
            getBoard,
            insertToken,
            getAvailableCells,
            resetBoard,
        }
    }

    function Cell() {
        let value = null;

        const getValue = () => value;
        const setValue = (token) => {
            value = token;
        };

        return {
            getValue,
            setValue,
        }
    }

    function GameController(Cell, Gameboard, playerOneName="", playerTwoName="") {
        const gameboard = Gameboard(Cell);
        const players = [
            { name: (playerOneName || `Player X`), token: "X" },
            { name: (playerTwoName || `Player O`), token: "O" },
        ]
        let currentPlayer = players[0];

        const switchTurns = () => {
            currentPlayer = (currentPlayer.name === players[0].name) ? players[1] : players[0];
        }

        const getGameStatus = () => {
            let gameStatus = null;

            const winningPatterns = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ]

            const currentPlayerTokens = gameboard.getBoard().reduce((array, cell, index) => {
                if (cell.getValue() === currentPlayer.token) array.push(index);
                return array;
            }, [])

            winningPatterns.forEach(pattern => {
                if (pattern.every(element => currentPlayerTokens.includes(element))) {
                    gameStatus = `${currentPlayer.name} has won!`;
                }
            })

            if (!gameboard.getAvailableCells().length && !gameStatus) {
                gameStatus = `It's a draw!`;
            }

            return gameStatus;
        }

        const playTurn = (cellIndex) => {
            if (gameboard.getBoard()[cellIndex].getValue()) return;
            gameboard.insertToken(cellIndex, currentPlayer.token);
            const gameStatus = getGameStatus();
            if (gameStatus) return;
            switchTurns();
        }

        const getGameState = () => {
            return {
                currentPlayer,
                board: gameboard.getBoard(),
                gameStatus: getGameStatus(),
            }
        }

        return {
            playTurn,
            getGameState,
            resetBoard: gameboard.resetBoard,
        }
    }

    function ScreenController(Cell, Gameboard, GameController) {
        const outputPara = document.getElementById("output-para");
        const boardDiv = document.getElementById("gameboard");
        const resetBtn = document.getElementById("reset-btn");
        const gameController = GameController(Cell, Gameboard);

        const updateScreen = () => {
            const gameState = gameController.getGameState();
            outputPara.textContent = gameState.gameStatus || `${gameState.currentPlayer.name}'s Turn`;
            gameState.board.forEach((cell, index) => {
                document.querySelector(`#gameboard button[data-index="${index}"]`).textContent = cell.getValue() || "";
            })
        }

        function boardClickHandler(event) {
            const selectedCellIndex = +event.target.dataset.index;
            if ((selectedCellIndex >= 0 && selectedCellIndex <= 8) && !gameController.getGameState().gameStatus) { // execute if is a valid cell is clicked & game is still ongoing
                gameController.playTurn(selectedCellIndex);
                updateScreen();
            }
        }

        function resetBtnClickHandler(event) {
            gameController.resetBoard();
            updateScreen();
        }

        boardDiv.addEventListener("click", boardClickHandler);
        resetBtn.addEventListener("click", resetBtnClickHandler);

        updateScreen(); // Initial render
    }

    return ScreenController(Cell, Gameboard, GameController);
})();