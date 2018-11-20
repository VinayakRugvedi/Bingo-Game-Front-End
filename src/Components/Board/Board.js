import React from 'react'
import './Board.css'
import Square from '../Square/Square.js'

class Board extends React.Component {
  constructor() {
    super()
    this.state = {
      squareValue : 1
    }
    // this.prepareAllSquares = this.prepareAllSquares.bind(this)
  }

  prepareAllSquares() {
    let allSquares = []
    for( let i = 1; i <= 25; i++) {
      allSquares.push(<Square key={i} value={i}/>)
    }
    return allSquares
  }

  render() {
    const allSquares = this.prepareAllSquares()
    return (
      <div className="boardContainer">
        {allSquares}
      </div>
    )
  }
}

export default Board
