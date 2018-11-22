import React from 'react'
import './Board.css'
import Square from '../Square/Square.js'
import socketIoClient from 'socket.io-client'

const socket = socketIoClient.connect('http://localhost:8080')

class Board extends React.Component {
  constructor () {
    super ()
    this.state = {
      valueGenerator : 1,
      squares : new Array(7).fill().map(function (item, index) {
        return ({
          value : 0,
          color : 'white',
          marked : false,
          position : index
        })
      }),
      boardSet : false,
      buttonSet : 'none'
    }
    this.readyToPlay = this.readyToPlay.bind(this)
  }

  updateSquareValue = (index) => {
    let squaresCopy = this.state.squares
    squaresCopy[index].value = this.state.valueGenerator
    if (this.state.valueGenerator === 7) {
      this.setState ({
        valueGenerator : this.state.valueGenerator + 1,
        squares : squaresCopy,
        buttonSet : ''
      })
    } else {
      this.setState ({
        valueGenerator : this.state.valueGenerator + 1,
        squares : squaresCopy
      })
    }
  }

  readyToPlay () {
    this.setState({
      boardSet : true,
      buttonSet : 'none'
    })
  }

  talkToServer = (position) => {
    console.log('hee');
    let squaresCopy = this.state.squares
    squaresCopy[position].color = 'red'
    squaresCopy[position].marked = true
    socket.emit('myValue', squaresCopy[position].value, 'done')
    this.setState({
      squares : squaresCopy
    })
  }

  renderSquares () {
    let squares = this.state.squares.map( (square, index) => {
      return <Square
              key={index}
              updateSquareValue={(e, index) => this.updateSquareValue(e, index)}
              talkToServer={(index) => this.talkToServer(index)}
              square={square}
              boardSet={this.state.boardSet}/>
    }
    )
    return squares
  }

  render () {
    const Squares = this.renderSquares()
    return (
      <div className="gameContainer">
      <div className="boardContainer">
        {Squares}
      </div>
      <div className="readyButton">
        <button style={{display : this.state.buttonSet}} onClick={this.readyToPlay}>I am set to play!</button>
      </div>
      </div>
    )
  }
}

export default Board
