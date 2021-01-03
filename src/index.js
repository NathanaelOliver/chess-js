import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let color_const = {
  black: "black",
  white: "white",
};
let color_direction = {
  "white": [-1, 0],
  "black": [1, 0],
}
let type_const = {
  rook: "rook",
  knight: "knight",
  queen: "queen",
  king: "king",
  bishop: "bishop",
  pawn: "pawn",
}
let board_stats = {
  width: 8,
  height: 8,
  range: 8,
}


class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        style={{background:this.props.color}}
        onClick={() => this.props.onClick()}
      >
        {this.props.piece === null ? '' : this.props.piece.get_image()}
      </button>
    );
  }
}

class Piece {
    constructor(color, type) {
      this.state = {
        type: type,
        color: color,
        image: `${process.env.PUBLIC_URL}/images/${color}/${type}.png`,
        moved: false,
      }
    }

    set_type = (type) => {
      this.setState({
        type: type,
      });
    }
  
    get_color = () => {
      return this.state.color;
    }

    get_image = () => {
      return <img src={this.state.image} alt ={this.state.image}/>
    }

    get_type = () => {
      return this.state.type;
    }

    can_take = (piece) => { 
      return this.state.color !== piece.get_color()
    }

    set_moved = (bool) => {
      this.state.moved= bool
    }

    has_moved = () => {
      return this.state.moved;
    }
  }

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: [[new Piece(color_const.black, type_const.rook), new Piece(color_const.black, type_const.knight), new Piece(color_const.black, type_const.bishop), new Piece(color_const.black, type_const.queen), new Piece(color_const.black, type_const.king), new Piece(color_const.black, type_const.bishop), new Piece(color_const.black, type_const.knight), new Piece(color_const.black, type_const.rook)], 
                [new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn), new Piece(color_const.black, type_const.pawn)],
                [null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null], 
                [new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn), new Piece(color_const.white, type_const.pawn)], 
                [new Piece(color_const.white, type_const.rook), new Piece(color_const.white, type_const.knight), new Piece(color_const.white, type_const.bishop), new Piece(color_const.white, type_const.queen), new Piece(color_const.white, type_const.king), new Piece(color_const.white, type_const.bishop), new Piece(color_const.white, type_const.knight), new Piece(color_const.white, type_const.rook)]],
      color_turn: color_const.white,
      selected_piece: null,
      possible_moves: [],
    };
  }

  handle_click = (i, j) => {
    if (this.state.selected_piece === null) {
      if (this.is_right_color(this.state.squares[i][j])) {
        this.select_piece(i, j);
      }
    } else if (this.is_valid_move(i, j)) {
      this.move(i, j);
    } else {
      this.deselect();
    }
  }

  is_right_color = (piece) => {
    return piece !== null && piece.get_color() === this.state.color_turn
  }

  select_piece = (i, j) => {
    var a = this.get_possible_moves(this.state.squares[i][j], i, j)
    if (a !== []) {
      this.setState({
        selected_piece: [i, j],
        possible_moves: a,
      });
    }
  }

  get_possible_moves = (piece, i, j) => {
    switch (piece.get_type()) {
      case type_const.rook:
        return this.symmetry(i,j,0,1,board_stats.range,true);
      case type_const.bishop:
        return this.symmetry(i,j,1,1,board_stats.range,true);
      case type_const.knight:
        return this.symmetry(i,j,1,2,1,true);
      case type_const.king:
        return [].concat(this.symmetry(i,j,0,1,1,true), this.symmetry(i,j,1,1,1,true));
      case type_const.queen:
        return [].concat(this.symmetry(i,j,0,1,board_stats.range,true), this.symmetry(i,j,1,1,board_stats.range,true));
      case type_const.pawn:
        var range = !piece.has_moved() ? 2 : 1;
        return [].concat(this.extend(i, j, color_direction[piece.get_color()][0], color_direction[piece.get_color()][1], range, false), this.pawn_attacks());
      default:
        break;
    }
  }

  symmetry = (i, j, x, y, range, captures) => {
    var moves = [].concat(this.extend(i, j, x, y, range, captures), this.extend(i, j, -x, y, range, captures), this.extend(i, j, x, -y, range, captures), this.extend(i, j, -x, -y, range, captures));
    if (x !== y) {
      moves = [].concat(this.extend(i, j, y, x, range, captures), this.extend(i, j, -y, x, range, captures), this.extend(i, j, y, -x, range, captures), this.extend(i, j, -y, -x, range, captures));
    }
    return moves
  }

  extend (i, j, a, b, range, captures) {
    var moves = [];
    for (var count = 0, s = i + a, t = j + b; s < board_stats.height && t < board_stats.width && s >= 0 && t >= 0 && count < range; s += a, t += b, count += 1) {
      if (this.state.squares[s][t] === null) {
        moves.push([s,t])
      } else {
        if (captures && this.state.squares[i][j].can_take(this.state.squares[s][t])) {
          moves.push([s,t])
        }
        break;
      }
    }
    return moves;
  }

  is_valid_move = (i, j) => {
    for (var a = 0; a < this.state.possible_moves.length; a++) {
      if (this.state.possible_moves[a][0] === i && this.state.possible_moves[a][1] === j) {
        return true;
      }
    }
    return false;
  }

  move = (i, j) => {
    const squares = this.state.squares.slice();
    squares[i][j] = this.state.squares[this.state.selected_piece[0]][this.state.selected_piece[1]]
    squares[i][j].set_moved(true);
    squares[this.state.selected_piece[0]][this.state.selected_piece[1]] = null;
    this.setState({
      squares: squares,
      color_turn: this.next_color(this.state.color_turn),
    });
    this.deselect();
  }

  next_color = (color) => {
    switch (color) {
      case color_const.white:
        return color_const.black
      case color_const.black:
        return color_const.white
      default:
        return color_const.white
    }
  }

  deselect = () => {
    this.setState({
      selected_piece: null,
      possible_moves: [],
    })
  }

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//    METHODS FOR RENDERING THE BOARD                                                   //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////

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
        {this.render_board()}
      </div>
    );
  }

  render_board = () => {
    const board = [];
    for (var i = 0; i < board_stats.height; i++) {
      board.push(this.render_row(i));
    }
    return board;
  }

  render_row = (i) => {
    const row = [];
    for (var j = 0; j < board_stats.width; j++) {
      row.push(this.render_square(i, j));
    }
    return <div className="board-row" key={i}> {row} </div>
  }

  render_square(i, j) {
    return <Square 
      color={this.is_valid_move(i, j) ? "#bdb" :  (((i+j)%2 === 0) ? "#fdb" : "#b86")}
      piece={this.state.squares[i][j]}
      onClick={() => this.handle_click(i, j)}
      key={j}
    />;
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
          <div>
            Side Text
          </div>
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
  
  return null;
}