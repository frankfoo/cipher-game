import styles from './App.module.css';
import React from 'react';
import mapping from './mapping.js';
import updateBoard from './updateBoard.js';
import validChar from './validChar.js';

import {Container, Button, Typography, Box, Grid, TextField, Link, Card } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';

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

  /* Material UI Styling*/
  const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Montserrat',
        'sans-serif'
      ].join(','),
      body1: {
        fontSize: 20,
      }
    },
    spacing: 8,
  });

  const useStyles = makeStyles({
    hiddenText: {
      color: 'white',
    }
  });
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box pb={4} pt={4}>
          <Typography variant="h3">Substitution Cipher Game</Typography>
        </Box>
        <Grid container pb={2} pt={2} alignItems='center'>
          {board.map((item, key) => (
            (/[A-Z]/.test(quote[key]) &&
              <Box display="flex" flexDirection="column" width="5%" alignItems='center' pb={1} pt={1}>
                <Typography variant="body1" >{cipher[key]}</Typography>
                <TextField variant="outlined" type="text" inputProps={{style:{textAlign:'center'}}} maxLength="1" id={key} value={item} 
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
                }></TextField>
              </Box>
              || /[.;',:]/.test(quote[key]) &&
              <Box display="flex" flexDirection="column" width="5%" alignItems='center'>
                <Typography variant="body1">{quote[key]}</Typography>
                <TextField variant="outlined" type="text" value={quote[key]} disabled></TextField>
              </Box>
              || 
              <Box display="flex" flexDirection="column" width="5%">
                <Typography variant="body1" className={classes.hiddenText}>a</Typography>
                <TextField variant="outlined" type="text" className={classes.disabledBox} disabled></TextField>
              </Box>
            )
          ))}
        </Grid>
        <Box display="flex" pb={4} pt={4} alignItems="center">
          <Button color="default" variant="outlined" pr={5} onClick={() => setReset(!reset)}>New Game</Button>
        </Box>
        <Box pb={4}>
          {win && 
            <Alert onClose={() => {}}>Correct Answer</Alert>
          }
        </Box>
        <Card variant="outlined">
          <Typography variant="body2">
            A substitution cipher is where each letter of the alphabet is mapped to a random letter, e.g. every A becomes a P, every B becomes an X.
            <br />
            Your job is to decipher the letters to get the original quote.
            <br />
            There are a few tricks that you can use:
            <br />
            Some letters in English occur more frequently than others e.g. ETAOIN are the top 6 most frequent letters
            <br />
            Do you see a single letter? It could be "A" or "I"
            <br /> 
            Do you see 2 letters that appear together? They could be "OO", "EE" etc...
            <br /> 
            Do you see apostrophes like xxx'x? That last letter could be a T, S etc...
            <br />
            There aren't that many 3 letter words
            <br />
            Good luck!
          </Typography>
        </Card>
        <Box display="flex" flexDirection="column" alignItems='flex-end' pb={2} pt={2}>
         <Typography variant="caption">Created by Frank Foo.</Typography>
         <Typography variant="caption">
          <Link href='https://github.com/frankfoo/cipher-game'>Github Repo.</Link>
        </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
