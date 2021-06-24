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
  // Reset
  const [reset, setReset] = React.useState(false);
  React.useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((data) => data.json())
      .then((data) => {
        let newQuote = data.content;
        newQuote = newQuote.toUpperCase();
        //newQuote = newQuote.replaceAll(/[.;',:]/g, '');
        setQuote(newQuote.split("")); // We've cleaned the original quote, set it to 'quote'

        let re = /[A-Z]/;
        //let re1 = /[.;',:]/;
        let cipherQuote = '';

        for (let i = 0; i < newQuote.length; i++) {
          if (re.test(newQuote[i])) {
            cipherQuote += mapping[newQuote[i]]
          } else {
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
  }, [reset]);

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
      <h1 className={styles.title}>Substitution Cipher Game</h1>
      <div className={styles.gameBox}>
        <div className={styles.inputBox}>
          {board.map((item, key) => (
            (/[A-Z]/.test(quote[key]) &&
              <div className={styles.box}>
                <p>{cipher[key]}</p>
                <input type="text" className={styles.input} maxLength="1" id={key} value={item} 
                  onChange={(e) => {
                    if (e.target.value == '') {
                      let targetChar = board[key];
                      setBoard([...updateBoard(targetChar, key, cipher, board, 1)])
                    }
                    let newChar = e.target.value.toUpperCase();
                    if (validChar(newChar, board) === true) {
                      setBoard([...updateBoard(e.target.value, key, cipher, board, 0)])
                    }
                  }
                }></input>
              </div>
              || /[.;',:]/.test(quote[key]) &&
              <div className={styles.box}>
                <p>{quote[key]}</p>
                <input type="text" className={styles.input} value={quote[key]} disabled></input>
              </div>
              || 
              <div className={styles.box}>
                <p className={styles.hidden}>a</p>
                <input type="text" className={styles.input} disabled></input>
              </div>
            )
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <button className={styles.button} onClick={() => setReset(!reset)}>New Game</button>
        {win && 
          <p className={styles.correct}>CORRECT!</p>
        }
      </div>
      <div className={styles.gameInfo}>
        <h2 className={styles.gameInfoTitle}>Game Info:</h2>
        <p>A substitution cipher is where each letter of the alphabet is mapped to a random letter, e.g. every A becomes a P, every B becomes an X.</p>
        <p>Your job is to decipher the letters to get the original quote.</p>
        <p>There are a few tricks that you can use:</p>
        <p>Some letters in English occur more frequently than others e.g. ETAOIN are the top 6 most frequent letters</p>
        <p>Do you see a single letter? It could be "A" or "I"</p>
        <p>Do you see 2 letters that appear together? They could be "OO", "EE" etc...</p>
        <p>Do you see apostrophes like xxx'x? That last letter could be a T, S etc...</p>
        <p>There aren't that many 3 letter words</p>
        <p>Good luck!</p>
      </div>
    </div>
  );
}

export default App;
