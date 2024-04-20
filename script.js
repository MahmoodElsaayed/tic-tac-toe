const TicTacToeGame = (function () {
    function BoardController(Cell) {
        const board = [];
        const availableCells = [];

        for (let i = 0; i < 9; i++) {
            board.push(Cell());
            availableCells.push(i);
        };

        const getBoard = () => board;

        const getAvailableCells = () => availableCells;

        const insertToken = (cellIndex, token) => {
            board[cellIndex].setValue(token);
            availableCells.splice(availableCells.indexOf(cellIndex), 1); // remove item with the value `cellIndex` not item with the index `cellIndex`
        }

        const resetBoard = () => {
            board.forEach((cell, index) => {
                cell.setValue("");
                availableCells[index] = index;
            })
        };

        return { getBoard, insertToken, getAvailableCells, resetBoard };
    }

    function Cell() {
        let value = "";

        const getValue = () => value;
        const setValue = (token) => {
            value = token;
        };

        return { getValue, setValue }
    }

    function GameController(Cell, BoardController, playerOneName = "", playerTwoName = "") {
        const boardController = BoardController(Cell);
        const board = boardController.getBoard();
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

            const currentPlayerTokens = board.reduce((playerTokens, currentCell, index) => {
                if (currentCell.getValue() === currentPlayer.token) playerTokens.push(index);
                return playerTokens;
            }, [])

            winningPatterns.forEach(pattern => {
                if (pattern.every(element => currentPlayerTokens.includes(element))) {
                    gameStatus = `${currentPlayer.name} has won!`;
                }
            })

            if (!boardController.getAvailableCells().length && !gameStatus) {
                gameStatus = `It's a draw!`;
            }

            return gameStatus;
        }

        const playTurn = (cellIndex) => {
            if (board[cellIndex].getValue()) return;
            boardController.insertToken(cellIndex, currentPlayer.token);
            if (getGameStatus()) return;
            switchTurns();
        }

        const getGameState = () => {
            return {
                currentPlayer,
                board,
                gameStatus: getGameStatus(),
            }
        }

        return {
            playTurn,
            getGameState,
            resetBoard: boardController.resetBoard,
        }
    }

    function ScreenController(Cell, BoardController, GameController) {
        const outputPara = document.getElementById("output-para");
        const boardDiv = document.getElementById("gameboard");
        const resetBtn = document.getElementById("reset-btn");
        const gameController = GameController(Cell, BoardController);

        const updateScreen = () => {
            const gameState = gameController.getGameState();
            outputPara.textContent = gameState.gameStatus || `${gameState.currentPlayer.name}'s Turn`;
            gameState.board.forEach((cell, index) => {
                document.querySelector(`#gameboard button[data-index="${index}"]`).textContent = cell.getValue();
            })
        }

        function boardClickHandler(event) {
            const selectedCell = event.target;
            if (selectedCell && !gameController.getGameState().gameStatus) { // execute if it's a valid cell & game is still ongoing
                gameController.playTurn(selectedCell.dataset.index);
                updateScreen();
            }
        }

        function resetBtnClickHandler() {
            gameController.resetBoard();
            updateScreen();
        }

        boardDiv.addEventListener("click", boardClickHandler);
        resetBtn.addEventListener("click", resetBtnClickHandler);

        updateScreen(); // Initial render
    }

    return ScreenController(Cell, BoardController, GameController);
})();