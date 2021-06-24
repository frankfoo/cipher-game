import React from "react";

const updateBoard = (char, key, cipher, board, flag) => {
    // Char is the character the user has entered 
    // Key is the index
    // Data is the array that contains the cipher quote 
    // Board is the array that contains the user answer 
    // Setboard is the function that changes Board
    // Flag determines if we're adding a letter or removing it from the board 
    
    // Add the letter in
    if (flag === 0) {
        let mappedKey = cipher[key]; // Doesn't matter if we're using the original quote or ciper quote
        for (let i = 0; i < cipher.length; i++) {
            if (cipher[i] === mappedKey) {
                board[i] = char.toUpperCase();
            }
        }
    }

    // Remove the letter
    if (flag === 1) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] == char) {
                board[i] = '';
            }
        }
    }
    return board;
}

export default updateBoard;