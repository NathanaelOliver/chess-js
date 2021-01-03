import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import bb from './images/black/bishop.png';
import bp from './images/black/pawn.png';
import bn from './images/black/knight.png';
import bq from './images/black/queen.png';
import bk from './images/black/king.png';
import br from './images/black/rook.png';
import wr from './images/white/rook.png';
import wb from './images/white/bishop.png';
import wp from './images/white/pawn.png';
import wn from './images/white/knight.png';
import wq from './images/white/queen.png';
import wk from './images/white/king.png';

class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        style={{background:this.props.color}}
        onClick={() => this.props.onClick()}
      >
        <img src={this.props.value} alt=''/>
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squareValues:[[ br,   bn,   bb,   bq,   bk,   bb,   bn,   br ], 
                    [ bp,   bp,   bp,   bp,   bp,   bp,   bp,   bp ],
                    [null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null], 
                    [ wp,   wp,   wp,   wp,   wp,   wp,   wp,   wp ], 
                    [ wr,   wn,   wb,   wq,   wk,   wb,   wn,   wr ]],
      whiteIsNext: true,
      selectedx: null,
      selectedy: null,
      selectedPiece: null,
      selectedImage: null,
      possibleMoves: [[]],
    };
  }

  pieceOn = (i, j) => {
    if (this.state.squareValues[i][j] == null){
      return null;
    }
    switch (this.state.squareValues[i][j]) {
      case br:
        return "black rook";
      case bn:
        return "black knight";
      case bb:
        return "black bishop";
      case bk:
        return "black king";
      case bq:
        return "black queen";
      case bp:
        return "black pawn";
      case wr:
        return "white rook";
      case wn:
        return "white knight";
      case wb:
        return "white bishop";
      case wk:
        return "white king";
      case wq:
        return "white queen";
      case wp:
        return "white pawn";
      default:
        return null;
    }
  }

  isWhite = (piece) => {
    return piece.indexOf('white') !== -1;
  }

  deselect = () => {
    this.setState({
      selectedx: null,
      selectedy: null,
      selectedPiece: null,
      selectedImage: null,
      possibleMoves: [],
    })
  }

  isWhitepiece = (i, j) => {
    var piece = this.pieceOn(i, j);
    return piece !== null && piece.indexOf("black") === -1;
  }

  isBlackpiece = (i, j) => {
    var piece = this.pieceOn(i, j);
    return piece !== null && piece.indexOf("white") === -1;
  }

  selected = () => {
    return this.state.selectedx !== null;
  }

  possibleMoves = (i, j) => {
    if (this.state.squareValues[i][j] == null){
      return null;
    }
    var moves = [];
    var a = 0, b = 0;
    switch (this.state.squareValues[i][j]) {
      case br:
      case wr: 
        for (a = 0; a < i; a ++) {
          if (this.isNotEmpty(a, j) || this.isRightColor(a, j)) {
            moves.push([a,j])
          } else {
            break;
          }
        }
        for (a = i + 1; a < 8; a ++) {
          if (this.isNotEmpty(a, j) || this.isRightColor(a, j)) {
            moves.push([a,j])
          } else {
            break;
          }
        }
        for (a = 0; a < j; a ++) {
          if (this.isNotEmpty(i, a) || this.isRightColor(i, a)) {
            moves.push([i,a])
          } else {
            break;
          }
        }
        for (a = j + 1; a < 8; a ++) {
          if (this.isNotEmpty(i, a) || this.isRightColor(i, a)) {
            moves.push([i, a])
          } else {
            break;
          }
        }
        break;
      case bn:
      case wn:
        if (this.isNotEmpty(i-2, j-1) || this.isRightColor(i-2, j-1)) {
          moves.push([i-2,j-1])
        }
        if (this.isNotEmpty(i-2, j+1) || this.isRightColor(i-2, j+1)) {
          moves.push([i-2,j+1])
        }
        if (this.isNotEmpty(i-1, j-2) || this.isRightColor(i-1, j-2)) {
          moves.push([i-1,j-2])
        }
        if (this.isNotEmpty(i-1, j+2) || this.isRightColor(i-1, j+2)) {
          moves.push([i-1,j+2])
        }
        if (this.isNotEmpty(i+1, j-2) || this.isRightColor(i+1, j-2)) {
          moves.push([i+1,j-2])
        }
        if (this.isNotEmpty(i+1, j+2) || this.isRightColor(i+1, j+2)) {
          moves.push([i+1,j+2])
        }
        if (this.isNotEmpty(i+2, j-1) || this.isRightColor(i+2, j-1)) {
          moves.push([i+2,j-1])
        }
        if (this.isNotEmpty(i+2, j+1) || this.isRightColor(i+2, j+1)) {
          moves.push([i+2,j+1])
        }
        break;
      case bb:
      case wb:
        for (a = i + 1, b = j + 1; a >= 0 && b >= 0 && a < 8 && b < 8; a++, b++) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = i - 1, b = j + 1; a >= 0 && b >= 0 && a < 8 && b < 8; a--, b++) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = i + 1, b = j - 1; a >= 0 && b >= 0 && a < 8 && b < 8; a++, b--) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = i - 1, b = j - 1; a >= 0 && b >= 0 && a < 8 && b < 8; a--, b--) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        break;
      case bk:
      case wk:
        if (this.isNotEmpty(i, j+1) || this.isRightColor(i, j+1)) {
          moves.push([i,j+1])
        }
        if (this.isNotEmpty(i+1, j+1) || this.isRightColor(i+1, j+1)) {
          moves.push([i+1,j+1])
        }
        if (this.isNotEmpty(i+1, j) || this.isRightColor(i+1, j)) {
          moves.push([i+1,j])
        }
        if (this.isNotEmpty(i+1, j-1) || this.isRightColor(i+1, j-1)) {
          moves.push([i+1,j-1])
        }
        if (this.isNotEmpty(i, j-1) || this.isRightColor(i, j-1)) {
          moves.push([i,j-1])
        }
        if (this.isNotEmpty(i-1, j-1) || this.isRightColor(i-1, j-1)) {
          moves.push([i-1,j-1])
        }
        if (this.isNotEmpty(i-1, j) || this.isRightColor(i-1, j)) {
          moves.push([i-1,j])
        }
        if (this.isNotEmpty(i-1, j+1) || this.isRightColor(i-1, j+1)) {
          moves.push([i-1,j+1])
        }
        break;
      case bq:
      case wq:
        for (a = i + 1, b = j + 1; a >= 0 && b >= 0 && a < 8 && b < 8; a++, b++) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = i - 1, b = j + 1; a >= 0 && b >= 0 && a < 8 && b < 8; a--, b++) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = i + 1, b = j - 1; a >= 0 && b >= 0 && a < 8 && b < 8; a++, b--) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = i - 1, b = j - 1; a >= 0 && b >= 0 && a < 8 && b < 8; a--, b--) {
          if (this.isNotEmpty(a, b) || this.isRightColor(a,b)) {
            moves.push([a, b]);
          } else {
            break;
          }
        }
        for (a = 0; a < i; a ++) {
          if (this.isNotEmpty(a, j) || this.isRightColor(a, j)) {
            moves.push([a,j])
          } else {
            break;
          }
        }
        for (a = i + 1; a < 8; a ++) {
          if (this.isNotEmpty(a, j) || this.isRightColor(a, j)) {
            moves.push([a,j])
          } else {
            break;
          }
        }
        for (a = 0; a < j; a ++) {
          if (this.isNotEmpty(i, a) || this.isRightColor(i, a)) {
            moves.push([i,a])
          } else {
            break;
          }
        }
        for (a = j + 1; a < 8; a ++) {
          if (this.isNotEmpty(i, a) || this.isRightColor(i, a)) {
            moves.push([i, a])
          } else {
            break;
          }
        }
        break;
      case bp:
        break;
      case wp:
        break;
      default:
        break;
    }
    return moves;
  }

  selectPiece = (i, j) => {
    this.setState({
      selectedx: i,
      selectedy: j,
      selectedPiece: this.pieceOn(i, j),
      selectedImage: this.state.squareValues[i][j],
      possibleMoves: this.possibleMoves(i, j),
    });
  }

  isRightColor = (i, j) => {
    return (this.state.whiteIsNext && !this.isWhitepiece(i,j)) || (!this.state.whiteIsNext && !this.isBlackpiece(i,j))
  }

  isNotEmpty = (i, j) => {
    try {
      return this.state.squareValues[i][j] !== null;
    } catch (TypeError) {
      return true;
    }
  }

  validMove = (i, j) => {
    return this.inMoves(i, j);
  }

  move = (i, j) => {
    const squares = this.state.squareValues.slice();
    squares[this.state.selectedx][this.state.selectedy] = null;
    squares[i][j] = this.state.selectedImage;
    this.setState({
      squareValues: squares,
      whiteIsNext: !this.state.whiteIsNext,
    });
    this.deselect();
  }

  inMoves = (i, j) => {
    for (var a = 0; a < this.state.possibleMoves.length; a++) {
      if (this.state.possibleMoves[a][0] === i && this.state.possibleMoves[a][1] === j) {
        return true;
      }
    }
    return false;
  }

  handleClick = (i, j) => {
    if (this.selected()) {
      if (this.validMove(i, j)) {
        this.move(i, j);
      } else {
        this.deselect();
      }
    } else /*select*/ {
      if (this.state.whiteIsNext && this.isWhitepiece(i, j)) {
        this.selectPiece(i,j);
      } else if (!this.state.whiteIsNext && this.isBlackpiece(i, j)) {
        this.selectPiece(i,j);
      }
    }
  }

  renderSquare(i,j) {
    return <Square 
      color={ this.inMoves(i, j) ? "#bdb" : (((i+j)%2 === 0) ? "#fdb" : "#b86")}
      value={this.state.squareValues[i][j]}
      onClick={() => this.handleClick(i, j)}
      key={j}
    />;
  }

  renderRow = (i) => {
    const row = [];
    for (var j = 0; j < 8; j++) {
      row.push(this.renderSquare(i, j));
    }
    return <div className="board-row" key={i}> {row} </div>
  }

  renderBoard = () => {
    const board = [];
    for (var i = 0; i < 8; i++) {
      board.push(this.renderRow(i));
    }
    return board;
  }

  render() {
    const winner = calculateWinner(this.state.squareValues);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
        
    return (
      <div>
        <div className="status">{status}</div>
        {this.renderBoard()}
      </div>
    );
  }
}
  
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{"Side Text"}</div>
          <ol>{"/* TODO */"}</ol>
        </div>
      </div>
    );
  }
}
  
// ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}