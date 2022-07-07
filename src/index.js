import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/*
class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}
*/
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/*
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
*/

function Board(props) {
    const renderSquare = (i) => (
        <Square
            value={props.squares[i]}
            onClick={() => props.onClick(i)}
        />
    );

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stepNumber: 0,
            history: [{
                col: null,
                row: null,
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
        };
    }
    get next() { return this.state.xIsNext ? 'X' : 'O'; }
    get winner() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
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
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.winner || squares[i]) { return; }
        squares[i] = this.next;
        this.setState({
            stepNumber: history.length,
            history: history.concat([{
                col: i % 3,
                row: Math.floor(i / 3),
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: !(step % 2),
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.winner;
        const status = (winner) ? 'Winner: ' + winner : 'Next player: ' + this.next;
        const moves = this.state.history.map((step, move) => {
            const desc = (move ?
                'Go to move #' + move + ['O', 'X'][move % 2] + "(" + step.col + "," + step.row + ")" :
                'Go to game start');
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
