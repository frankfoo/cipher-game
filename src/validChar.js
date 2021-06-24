import React from 'react';

const validChar = (char, board) => {
    let flag = true;
    board.forEach((item) => {
        if (item == char) {
            console.log('false');
            flag = false;
        }
    });
    return flag;
}

export default validChar;