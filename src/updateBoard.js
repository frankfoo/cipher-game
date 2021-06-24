import React from "react";

const updateBoard = (char, key, cipher, board) => {
    // Char is the character the user has entered 
    // Key is the index
    // Data is the array that contains the cipher quote 
    // Board is the array that contains the user answer 
    // Setboard is the function that changes Board
    
    let mappedKey = cipher[key]; // Doesn't matter if we're using the original quote or ciper quote
    for (let i = 0; i < cipher.length; i++) {
        if (cipher[i] === mappedKey) {
            board[i] = char.toUpperCase();
        }
    }
    //console.log(board);
    return board;
}

export default updateBoard;