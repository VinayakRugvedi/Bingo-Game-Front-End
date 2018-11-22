import React from 'react'
import './Board.css'
import Square from '../Square/Square.js'
import socketIoClient from 'socket.io-client'

const socket = socketIoClient.connect('http://localhost:8000')

class Board extends React.Component {
  constructor () {
    super ()
    this.state = {
      valueGenerator : 1,
      squares : new Array(25).fill().map(function (item, index) {
        return ({
          value : 0,
          color : '#c3073f',
          marked : false,
          position : index
        })
      }),
      boardSet : false,
      myTurn : true,
      buttonSet : 'none',
      myRoom : ''
    }
    this.readyToPlay = this.readyToPlay.bind(this)
  }

  componentDidMount () {
    socket.on('sendRoom', (room) => {
      console.log(room.room)
      this.setState({
        myRoom : room.room
      })
    })

    socket.on('update', (valueObj) => {
      let squaresCopy = this.state.squares
      for (let square of squaresCopy) {
        if(square.value === valueObj.value) {
          square.color = 'red'
          square.marked = 'true'
          break
        }
      }
      this.setState({
        squares : squaresCopy,
        // myTurn : this.state.myTurn ? false : true
      })
    })
  }

  updateSquareValue = (index) => {
    let squaresCopy = this.state.squares
    squaresCopy[index].value = this.state.valueGenerator
    // 843b62
    squaresCopy[index].color = 'red'
    if (this.state.valueGenerator === 25) {
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
    socket.emit('myValue', squaresCopy[position].value, this.state.myRoom)
    this.setState({
      squares : squaresCopy,
      // myTurn : !this.state.myTurn
    })
  }

  renderSquares () {
    let squares = this.state.squares.map( (square, index) => {
      return <Square
              key={index}
              updateSquareValue={(e, index) => this.updateSquareValue(e, index)}
              talkToServer={(index) => this.talkToServer(index)}
              square={square}
              myTurn={this.state.myTurn}
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
          { this.state.valueGenerator <= 25
            ? <button className="buttonBeforeBoardSet">Setup your Board!</button>
            : <button className="buttonBeforeBoardSet" style={{display : this.state.buttonSet}} onClick={this.readyToPlay}>I am set to play!</button>
          }
        </div>
      </div>
    )
  }
}

export default Board
