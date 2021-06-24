import styles from './App.module.css';
import React from 'react';
import mapping from './mapping.js';
import updateBoard from './updateBoard.js';
import validChar from './validChar.js';

function App() {
  // Original Quote
  const [quote, setQuote] = React.useState([]);
  // Cipher Quote
  const [cipher, setCipher] = React.useState([]);
  // Gameboard
  const [board, setBoard] = React.useState([]);
  // Winning state
  const [win, setWin] = React.useState(false);
  React.useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((data) => data.json())
      .then((data) => {
        let newQuote = data.content;
        newQuote = newQuote.toUpperCase();
        newQuote = newQuote.replaceAll(/[.;',:]/g, '');
        setQuote(newQuote.split("")); // We've cleaned the original quote, set it to 'quote'

        let re = /[A-Z]/;
        let re1 = /[.;',:]/;
        let cipherQuote = '';

        for (let i = 0; i < newQuote.length; i++) {
          if (re.test(newQuote[i])) {
            cipherQuote += mapping[newQuote[i]]
          } else if (re1.test(newQuote[i]) === false) {
            cipherQuote += newQuote[i]
          }
        }
        setCipher(cipherQuote.split(""));

        let newBoard = [];
        for (let i = 0; i < cipherQuote.length; i++) {
            newBoard[i] = '';
        }
        setBoard(newBoard);

      });
  }, []);

  React.useEffect(() => {
    let flag = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i] != quote[i] && /[A-Z]/.test(quote[i])) {
        flag = false;
      }
    }
    setWin(flag);
  }, [board, quote]);

  return (
    <div className={styles.container}>
      <p>{quote}</p>
      <p>{win && 
        <p>You win!</p>
        }
      </p>
      <div className={styles.inputBox}>
        {board.map((item, key) => (
          (quote[key] !== ' ' &&
            <div className={styles.box}>
              <p>{cipher[key]}</p>
              <input type="text" className={styles.input} maxLength="1" id={key} value={item} 
                onChange={(e) => {
                  let newChar = e.target.value.toUpperCase();
                  if (validChar(newChar, board) === true) {
                    setBoard([...updateBoard(e.target.value, key, cipher, board)])
                  }
                }
              }></input>
            </div>
            ||
            <div className={styles.box}>
              <p>-</p>
              <input type="text" className={styles.input} disabled></input>
            </div>
          )
        ))}
      </div>
    </div >
  );
}

export default App;
