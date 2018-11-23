import React from 'react'
import './Board.css'
import Square from '../Square/Square.js'
import socketIoClient from 'socket.io-client'

class Board extends React.Component {
  constructor () {
    super ()
    this.state = {
      valueGenerator : 1,
      squares : new Array(5).fill().map(function (item, index) {
        return ({
          value : 0,
          color : '#843b62',
          marked : false,
          position : index
        })
      }),
      boardSet : false,
      myTurn : false,
      buttonSet : 'none',
      myRoom : '',
      playerAvailable : false
    }
    this.readyToPlay = this.readyToPlay.bind(this)
    this.setSocketListeners = this.setSocketListeners.bind(this)
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
      let squaresCopy = this.state.squares
      for (let square of squaresCopy) {
        if(square.value === valueObj.value) {
          square.color = '#f67e7d'
          square.marked = 'true'
          break
        }
      }
      this.setState({
        squares : squaresCopy,
        myTurn : true
      })
    })
  }

  updateSquareValue = (index) => {
    let squaresCopy = this.state.squares
    squaresCopy[index].value = this.state.valueGenerator
    if (this.state.valueGenerator === 5) {
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

  readyToPlay () {
    this.setState({
      boardSet : true,
      buttonSet : 'none',
      myTurn : true
    })
  }

  talkToServer = (position) => {
    console.log('server');
    let squaresCopy = this.state.squares
    squaresCopy[position].color = '#f67e7d'
    squaresCopy[position].marked = true
    this.socket.emit('myValue', squaresCopy[position].value, this.state.myRoom)
    this.setState({
      squares : squaresCopy,
      myTurn : false
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
          { this.state.valueGenerator <= 5
            ? <button className="buttonBeforeBoardSet">Setup your Board!</button>
            : !this.state.playerAvailable
              ? <button>Waiting for a player!</button>
              : !this.state.boardSet
                ? <button className="buttonAfterBoardSet" style={{display : this.state.buttonSet}}     onClick={this.readyToPlay}>Start the Game!</button>
                : this.state.myTurn
                  ? <button className="myTurnButton">Your turn dude!</button>
                  : ''
          }
        </div>
      </div>
    )
  }
}

export default Board
