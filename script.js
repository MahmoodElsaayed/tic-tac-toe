function Gameboard() {
    const board = [];
    for (let i = 0; i < 9; i++) { board.push(Cell()) };

    const getBoard = () => board;

    const insertToken = (cellIndex, token) => {
        board[cellIndex].setValue(token);
    }

    const getAvailableCells = () => {
        return board.reduce((array, cell, index) => {
            if (cell.getValue() === "-") array.push(index);
            return array;
        }, [])
    }

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i].setValue("-");
        }
    }

    const printBoard = () => {
        const boardRows = [board.slice(0, 3), board.slice(3, 6), board.slice(6)];
        boardRows.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                boardRows[rowIndex][cellIndex] = cell.getValue();
            })
        })
        boardRows.forEach(row => console.log(row))
    }

    return {
        getBoard,
        insertToken,
        getAvailableCells,
        resetBoard,
        printBoard,
    }
}

function Cell() {
    let value = "-";

    const getValue = () => value;
    const setValue = (token) => {
        value = token;
    };

    return {
        getValue,
        setValue,
    }
}

function GameController(playerOneName = "", playerTwoName = "") {
    const gameboard = Gameboard();
    const board = gameboard.getBoard();
    const players = [
        { name: (playerOneName || `Player X`), token: "X" },
        { name: (playerTwoName || `Player O`), token: "O" },
    ]
    let currentPlayer = players[0];

    const switchTurns = () => {
        currentPlayer = (currentPlayer.name === players[0].name) ? players[1] : players[0];
    }

    const checkForGameEnd = () => {
        let gameEnded = false;

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

        const currentPlayerTokens = board.reduce((array, cell, index) => {
            if (cell.getValue() === currentPlayer.token) array.push(index);
            return array;
        }, [])

        winningPatterns.forEach(pattern => {
            if (pattern.every(element => currentPlayerTokens.includes(element))) {
                console.log(`${currentPlayer.name} has won`);
                gameEnded = true;
            }
        })

        if (!gameboard.getAvailableCells().length) {
            console.log("It's a draw!");
            gameEnded = true;
        }

        return gameEnded;
    }

    const startRound = (pos) => {
        if (board[pos].getValue() !== "-") {
            console.log("Position is occupied. Try another position.");
            return;
        }
        gameboard.insertToken(pos, currentPlayer.token);
        gameboard.printBoard();
        if (checkForGameEnd()) {
            gameboard.resetBoard();
        };
        switchTurns();
    }

    return {
        startRound,
    }
}

const game = GameController("Mahmoud", "John");