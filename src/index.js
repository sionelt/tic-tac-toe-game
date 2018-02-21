import React from "react";
import { render } from "react-dom";
import "./style.css";

const WINNING_COMBINATIONS = [
  [6, 7, 8],
  [3, 4, 5],
  [2, 4, 6],
  [2, 5, 8],
  [1, 4, 7],
  [0, 4, 8],
  [0, 3, 6],
  [0, 1, 2]
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      turn: "",
      isComputer: false,
      moveX: false,
      moves: Array(9).fill(null),
      score1: 0,
      score2: 0,
      notify: "",
      type1: "player 1",
      type2: "player 2"
    };
    this.movesArr = Array(9).fill(null);
    this.handleChoosePlayer = this.handleChoosePlayer.bind(this);
    this.handleStartNewGame = this.handleStartNewGame.bind(this);
    this.handlePickAvator = this.handlePickAvator.bind(this);
    this.handleRestartGame = this.handleRestartGame.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleGame = this.handleGame.bind(this);
  }

  handleChoosePlayer(e) {
    e.preventDefault();
    this.choosePlayerDOM.style.display = "none";
    this.pickAvatorDOM.style.display = "block";

    this.setState({
      isComputer: e.target.textContent === "one player" ? true : false,
      type1: e.target.textContent === "one player" ? "player" : "player 1",
      type2: e.target.textContent === "one player" ? "computer" : "player 2"
    });
  }

  handlePickAvator(e) {
    e.preventDefault();
    this.gameViewDOM.style.display = "block";
    this.pickAvatorDOM.style.display = "none";
    let avator = e.target;

    this.setState({
      turn: this.state.isComputer ? "player" : "player 2",
      moveX: this.state.isComputer
        ? avator.textContent === "X" ? true : false
        : avator.textContent === "X" ? false : true
    });
  }

  handleStartNewGame() {
    this.choosePlayerDOM.style.display = "block";
    this.pickAvatorDOM.style.display = "none";
    this.gameViewDOM.style.display = "none";

    this.handleRestartGame();
  }

  handleRestartGame() {
    this.movesArr = Array(9).fill(null);

    this.setState(
      !this.state.notify
        ? { score1: 0, score2: 0, notify: "", moves: Array(9).fill(null) }
        : { notify: "", moves: Array(9).fill(null) }
    );
  }

  handleNotification() {
    this.showWinnerID = setTimeout(() => {
      this.winningPos.forEach(move => {
        this.squaresDOM[move].style.backgroundColor = "transparent";
      });
      this.boardViewDOM.style.backgroundColor = "#000000a3";
      this.notifyDOM.style.display = "block";
    }, 1000);

    this.hideWinnerID = setTimeout(() => {
      this.boardViewDOM.style.backgroundColor = "transparent";
      this.notifyDOM.style.display = "none";
      this.handleRestartGame();
    }, 3000);
  }

  handleMove(squareOccupy, pos) {
    //- prevent duplicates & paint moves.
    if (!squareOccupy) {
      this.movesArr[pos] = this.state.moveX ? "X" : "O";
      this.setState({
        turn:
          this.state.turn === this.state.type1
            ? this.state.type2
            : this.state.type1,
        moves: this.movesArr,
        moveX: !this.state.moveX
      });
    } else {
      this.movesArr[pos] = this.state.moves[pos];
      this.setState(prevState => ({
        turn: prevState.turn,
        moves: this.movesArr,
        moveX: prevState.moveX
      }));
    }

    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      this.winningPos = WINNING_COMBINATIONS[i];
      this.xWin = this.winningPos.filter(pos => this.movesArr[pos] === "X");
      this.oWin = this.winningPos.filter(pos => this.movesArr[pos] === "O");
      //- when there's a winner.
      if (this.xWin.length === 3 || this.oWin.length === 3) {
        this.winnerFound = true;
        this.setState(
          (prevState, state) =>
            this.state.turn.substr(-1) == 1 ||
            (this.computerWon
              ? state.turn === "player"
              : this.state.turn === "player")
              ? {
                  score1: prevState.score1 + 1,
                  notify: `the winner is ${prevState.type1}!`
                }
              : {
                  score2: prevState.score2 + 1,
                  notify: `the winner is ${prevState.type2}!`
                }
        );
        //- paint the winning positions.
        this.winningPos.forEach(move => {
          this.squaresDOM[move].style.backgroundColor = "#f7f7f7";
        });
        //- notify winner and clear for next round.
        this.handleNotification();
        break;
      }
    }
    //- its a tie break
    if (
      !this.movesArr.includes(null) &&
      this.xWin.length !== 3 &&
      this.oWin.length !== 3
    ) {
      this.setState({ notify: "its a tie!" });
      this.handleNotification();
      this.winnerFound = true;
      this.itsTie = true;
    }
  }

  handleGame(e, ID) {
    e.preventDefault();
    this.winnerFound = false;
    this.computerWon = false;
    this.itsTie = false;
    let squareOccupy = e.target.textContent,
      computerPos = 0;
    //- manually tricker human moves.
    this.handleMove(squareOccupy, ID);
    //- generate computer move position.
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      let winningPos = WINNING_COMBINATIONS[i],
        human = winningPos.filter(
          pos => this.movesArr[pos] === (this.state.moveX ? "X" : "O")
        ),
        computer = winningPos.filter(
          pos => this.movesArr[pos] === (this.state.moveX ? "O" : "X")
        ),
        opens = winningPos.filter(pos => this.movesArr[pos] === null);
      //- set position for computer next move.
      if (opens.length > 0) {
        if (computer.length === 2) {
          computerPos = winningPos.find(pos => this.movesArr[pos] === null);
          break;
        }
        if (human.length === 2) {
          computerPos = winningPos.find(pos => this.movesArr[pos] === null);
          break;
        } else {
          computerPos = winningPos.find(pos => this.movesArr[pos] === null);
        }
      }
    }
    console.log(computerPos);
    //- tricker computer moves
    if (this.state.isComputer && !this.winnerFound) {
      //- set when to fire computer move.
      this.computerMoveID = setTimeout(() => {
        this.computerWon = true;
        this.handleMove(squareOccupy, computerPos);
      }, 1000);
    }
    //- computer first move.
    if (
      this.state.isComputer &&
      this.winnerFound &&
      this.state.turn === "player"
    ) {
      this.computerMoveFirstID = setTimeout(() => {
        this.handleMove(squareOccupy, computerPos);
      }, 4000);
    }
  }

  componentDidMount() {
    //- DOMs access references.
    this.choosePlayerDOM = document.querySelector(".choose-player-wrap");
    this.pickAvatorDOM = document.querySelector(".pick-avator-wrap");
    this.gameViewDOM = document.querySelector(".game-view");
    this.boardViewDOM = document.querySelector(".board-view");
    this.notifyDOM = document.querySelector(".notify-winner");
    this.squaresDOM = document.querySelectorAll(".square");
  }

  componentWillUnmount() {
    clearTimeout(this.showWinnerID);
    clearTimeout(this.hideWinnerID);
    clearTimeout(this.computerMoveID);
    clearTimeout(this.computerFirstMoveID);
  }

  render() {
    const { turn, moves, type1, type2, score1, score2, notify } = this.state;
    return (
      <div className="container">
        <div>
          <ChoosePlayer playersFunc={this.handleChoosePlayer} />
          <PickAvator
            pickAvatorFunc={this.handlePickAvator}
            newGameFunc={this.handleStartNewGame}
          />
          <BoardView
            playerTurn={turn}
            playerMoves={moves}
            player1Type={type1}
            player2Type={type2}
            player1Score={score1}
            player2Score={score2}
            winNotify={notify}
            gameFunc={this.handleGame}
            restartGameFunc={this.handleRestartGame}
            newGameFunc={this.handleStartNewGame}
          />
        </div>
      </div>
    );
  }
}

const ChoosePlayer = props => {
  return (
    <div className="choose-player-wrap">
      <h2>How would you like to play?</h2>
      <div className="one-player" onClick={e => props.playersFunc(e)}>
        one player
      </div>
      <div className="two-player" onClick={e => props.playersFunc(e)}>
        two players
      </div>
    </div>
  );
};

const PickAvator = props => {
  return (
    <div className="pick-avator-wrap">
      <h2>Pick:</h2>
      <div className="pick-options">
        <div className="pick-x" onClick={e => props.pickAvatorFunc(e)}>
          X
        </div>
        <span>or</span>
        <div className="pick-o" onClick={e => props.pickAvatorFunc(e)}>
          O
        </div>
      </div>
      <StartNewGame text="back" newGameFunc={props.newGameFunc} />
    </div>
  );
};

const StartNewGame = props => {
  return (
    <button className="start-new-btn" onClick={props.newGameFunc}>
      {props.text}
    </button>
  );
};

const SingleSquare = props => {
  return (
    <button className="square" onClick={props.clickMove}>
      {props.move}
    </button>
  );
};

class BoardView extends React.Component {
  squareView(ID) {
    return (
      <SingleSquare
        dataID={ID}
        move={this.props.playerMoves[ID]}
        clickMove={e => this.props.gameFunc(e, ID)}
      />
    );
  }

  render() {
    const {
      playerTurn,
      player1Type,
      player2Type,
      player1Score,
      player2Score,
      winNotify,
      restartGameFunc,
      newGameFunc
    } = this.props;
    
    return (
      <div className="game-view">
        <div className="player-turn">{playerTurn}'s turn</div>
        <div className="board-view">
          <div className="board-row">
            {this.squareView(0)}
            {this.squareView(1)}
            {this.squareView(2)}
          </div>
          <div className="board-row">
            {this.squareView(3)}
            {this.squareView(4)}
            {this.squareView(5)}
          </div>
          <div className="board-row">
            {this.squareView(6)}
            {this.squareView(7)}
            {this.squareView(8)}
          </div>
        </div>
        <div className="score-board">
          <div>
            {player1Type}'s score: {player1Score}
          </div>
          <div>
            {player2Type}'s score: {player2Score}
          </div>
        </div>
        <div className="notify-winner">{winNotify}</div>
        <button className="restart-btn" onClick={restartGameFunc}>
          restart game
        </button>
        <StartNewGame text="start new game" newGameFunc={newGameFunc} />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
