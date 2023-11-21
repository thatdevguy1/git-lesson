/*----- app's state (variables) -----*/
let game;

/*----- cached element references -----*/
const boardEl = document.getElementById("board");
const msgEl = document.getElementById("message");
const replayBtn = document.querySelector("button");

/*----- classes -----*/
class Square {
  constructor(domElement) {
    this.domElement = domElement;
    this.value = null;
  }

  static renderLookup = {
    1: "yellow",
    "-1": "red",
    null: "darkgrey",
  };

  render() {
    this.domElement.style.backgroundColor = Square.renderLookup[this.value];
  }
}

class ImageSquare extends Square {
  constructor(domElement, secondsPerRotation = 0) {
    super(domElement);
    this.domElement.style.animationDuration = `${secondsPerRotation}s`;
  }

  static renderLookup = {
    1: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHVwcHl8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    "-1": "https://hips.hearstapps.com/hmg-prod/images/cute-cat-photos-1593441022.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=640:*",
    null: "darkgrey",
  };

  render() {
    if (this.value) {
      this.domElement.style.backgroundImage = `url(${
        ImageSquare.renderLookup[this.value]
      })`;
    } else {
      this.domElement.style.backgroundImage = "";
    }
  }
}

class TicTacToeGame {
  constructor(boardElement, messageElement) {
    this.boardElement = boardElement;
    this.messageElement = messageElement;
    this.squareEls = [...boardElement.querySelectorAll("div")];
    this.turn = null;
    this.winner = null;

    this.boardElement.addEventListener("click", (evt) => {
      // Obtain index of square
      const idx = this.squareEls.indexOf(evt.target);
      // Guards
      if (
        // Didn't click <div> in grid
        idx === -1 ||
        // Square already taken
        this.squares[idx].value ||
        // Game over
        this.winner
      )
        return;
      // Update the square object
      this.squares[idx].value = this.turn; // common typo
      // Update other state (turn, winner)
      this.turn *= -1;
      this.winner = this.getWinner();
      // Render updated state
      this.render();
    });
  }

  static winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  play() {
    this.turn = 1;
    this.winner = null;
    this.squares = this.squareEls.map((el) => new ImageSquare(el, 3));
    this.render();
  }

  render() {
    this.squares.forEach((square) => square.render());
    if (this.winner === "T") {
      this.messageElement.textContent = "Rats, another tie!";
    } else if (this.winner) {
      this.messageElement.textContent = `Player ${
        this.winner === 1 ? 1 : 2
      } Wins!`;
    } else {
      this.messageElement.textContent = `Player ${
        this.turn === 1 ? 1 : 2
      }'s turn!`;
    }
  }

  toString() {
    return `Tic-Tac-Toe / winner -> ${this.winner}`;
  }

  getWinner() {
    // Shortcut variable
    const combos = TicTacToeGame.winningCombos;
    for (let i = 0; i < combos.length; i++) {
      if (
        Math.abs(
          this.squares[combos[i][0]].value +
            this.squares[combos[i][1]].value +
            this.squares[combos[i][2]].value
        ) === 3
      )
        return this.squares[combos[i][0]].value;
    }
    // Array.prototype.some iterator method!
    if (this.squares.some((square) => square.value === null)) return null;
    return "T";
  }

  static about() {
    console.log("I'm the TicTacToeGame class!");
  }
}

/*----- functions -----*/
initialize();

function initialize() {
  game = new TicTacToeGame(boardEl, msgEl);
  game.play();
}

replayBtn.addEventListener("click", initialize);
