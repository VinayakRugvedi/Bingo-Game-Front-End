import React from 'react'
import './Board.css'
import Square from '../Square/Square.js'

class Board extends React.Component {
  constructor() {
    super()
    this.state = {
      valueGenerator : 1,
      squareValues : new Array(25).fill(''),
      boardSet : 'none'
    }
  }

  updateSquareValue = (index) => {
    let squareValuesCopy = this.state.squareValues
    squareValuesCopy[index] = this.state.valueGenerator
    if (this.state.valueGenerator === 25) {
      this.setState({
        valueGenerator : this.state.valueGenerator + 1,
        squareValues : squareValuesCopy,
        boardSet : true
      })
    } else {
      this.setState({
        valueGenerator : this.state.valueGenerator + 1,
        squareValues : squareValuesCopy
      })
    }
  }

  renderSquares() {
    let Squares = this.state.squareValues.map( (item, index) => {
      return <Square
              key={index}
              getSquareValue={(index) => this.updateSquareValue(index)}
              value={item}
              index={index}/>
    }
    )
    return Squares
  }

  render() {
    const Squares = this.renderSquares()
    return (
      <div className="gameContainer">
      <div className="boardContainer">
        {Squares}
      </div>
      <div className="readyButton">
        <button style={{display : this.state.boardSet}}>I am set to play!</button>
      </div>
      </div>
    )
  }
}

export default Board
