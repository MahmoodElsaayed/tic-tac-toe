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