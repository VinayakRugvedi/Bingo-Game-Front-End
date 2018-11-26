import React from 'react'

import './Board.css'
import Square from '../Square/Square.js'

import socketIoClient from 'socket.io-client'

class Board extends React.Component {
  constructor () {
    super ()
    this.state = {
      valueGenerator : 1,
      squares : new Array(25).fill().map(function (item, index) {
        return ({
          value : 0,
          color : '#00a8b5',
          marked : false,
          position : index
        })
      }),
      boardSet : false,
      myTurn : false,
      buttonSet : 'none',
      myRoom : '',
      playerAvailable : false,
      status : {rows : [5,5,5,5,5], cols : [5,5,5,5,5], diags : [5,5]}
    }
    this.readyToPlay = this.readyToPlay.bind(this)
    this.setSocketListeners = this.setSocketListeners.bind(this)
    this.setTheBoard = this.setTheBoard.bind(this)
  }

  setSocketListeners() {
    this.socket.on('sendRoomName', (room) => {
      console.log(room.roomName);
      this.setState({
        myRoom : room.roomName
      })
    })

    this.socket.on('playerAvailable', (size) => {
      console.log(size)
      this.setState({
        playerAvailable : true
      })
    })

    this.socket.on('update', (valueObj) => {
      let squaresCopy = this.state.squares, position, statusCopy = this.state.status
      for (let square of squaresCopy) {
        if(square.value === valueObj.value) {
          square.color = '#f67e7d'
          square.marked = 'true'
          position = square.position
          break
        }
      }
      statusCopy.cols[position % 5] -= 1
      this.setState({
        squares : squaresCopy,
        myTurn : true,
        status : statusCopy
      })
    })
  }

  updateSquareValue = (index) => {
    let squaresCopy = this.state.squares
    squaresCopy[index].value = this.state.valueGenerator
    if (this.state.valueGenerator === 25) {
      this.socket = socketIoClient.connect('http://localhost:8000')
      this.setSocketListeners()
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

  setTheBoard () {
    let values = [], done = true, boundary = 25, randomValues = []
    for(let i = 1; i < 26; i++) values[i-1] = i
    while(values.length !== 0) {
      let index = Math.floor(Math.random() * boundary)
      randomValues.push(values[index])
      values.splice(index, 1)
      boundary--
    }

    let squaresCopy = this.state.squares
    for(let square of squaresCopy) {
      square.value = randomValues[boundary++]
    }

    this.socket = socketIoClient.connect('http://localhost:8000')
    this.setSocketListeners()

    this.setState({
      valueGenerator : 26,
      squares : squaresCopy,
      buttonSet : ''
    })
  }

  readyToPlay () {
    this.setState({
      boardSet : true,
      buttonSet : 'none',
      myTurn : true
    })
  }

  talkToServer = (position) => {
    console.log('server');
    let squaresCopy = this.state.squares, statusCopy = this.state.status
    squaresCopy[position].color = '#f67e7d'
    squaresCopy[position].marked = true
    statusCopy.cols[position % 5] -= 1
    console.table(statusCopy)
    this.socket.emit('myValue', squaresCopy[position].value, this.state.myRoom)
    this.setState({
      squares : squaresCopy,
      myTurn : false,
      status : statusCopy
    })
  }

  renderSquares () {
    let squares = this.state.squares.map( (square, index) => {
      return <Square
              key={index}
              updateSquareValue={(e, index) => this.updateSquareValue(e, index)}
              talkToServer={(index) => this.talkToServer(index)}//read
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
        <div className="checkpointButtons">
          { this.state.valueGenerator <= 25
            ? <button className="buttonBeforeBoardSet"
              onClick={this.setTheBoard}>
              Setup your Board or click here to set it up!</button>
            : !this.state.playerAvailable
              ? <span className="buttonWaiting">Waiting for a player...</span>
              : !this.state.boardSet
                ? <button className="buttonAfterBoardSet"
                    style={{display : this.state.buttonSet}}
                    onClick={this.readyToPlay}>
                    Click here & Start your Game!</button>
                : this.state.myTurn
                  ? <span className="myTurnButton">Your turn dude!</span>
                  : <span className="myTurnButton">Wait for your turn...</span>
          }
        </div>
      </div>
    )
  }
}

export default Board
