import React from 'react'

import './Board.css'
import Square from '../Square/Square.js'
import ModalWindow from '../ModalWindow/ModalWindow.js'

import socketIoClient from 'socket.io-client'
import setSocketListeners from '../../socketListeners.js'

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
      status : {rows : [5,5,5,5,5], cols : [5,5,5,5,5], diags : [5,5]},
      modalWindow : {
        display : 'none',
        heading : '',
        description: ''
      }
    }
    this.readyToPlay = this.readyToPlay.bind(this)
    this.setTheBoard = this.setTheBoard.bind(this)
    this.startGameAgain = this.startGameAgain.bind(this)
  }

  componentDidMount () {
    this.initialState = JSON.parse(JSON.stringify(this.state))
  }

  updateSquareValue = (index) => {
    let squaresCopy = this.state.squares
    squaresCopy[index].value = this.state.valueGenerator
    if (this.state.valueGenerator === 25) {
      const port = process.env.PORT || 8000
      this.socket = socketIoClient.connect('http://localhost'+port)
      setSocketListeners(this)
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
    let values = [], boundary = 25, randomValues = []
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
    const port = process.env.PORT || 8000
    this.socket = socketIoClient.connect('http://localhost:'+port)
    setSocketListeners(this)

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
    let squaresCopy = this.state.squares, statusCopy = this.state.status
    squaresCopy[position].color = '#f67e7d'
    squaresCopy[position].marked = true

    statusCopy.cols[position % 5] -= 1
    statusCopy.rows[Math.floor(position / 5)] -= 1
    if(position === 12) {
      statusCopy.diags[0] -= 1
      statusCopy.diags[1] -= 1
    }
    else if(position % 6 === 0) statusCopy.diags[0] -= 1
    else if(position % 4 === 0) statusCopy.diags[1] -= 1

    let count = 0
    for(let item of statusCopy.rows) {
      if(item === 0) count++
    }
    for(let item of statusCopy.cols) {
      if(item === 0) count++
    }
    for(let item of statusCopy.diags) {
      if(item === 0) count++
    }

    if(count >= 5) {
      this.socket.emit('winner')
      this.setState({
        modalWindow : {
          display : true,
          heading : 'Congratulations!',
          description : 'Finally, you have won the game...'
        }
      })
    } else {
      this.socket.emit('myValue', squaresCopy[position].value, this.state.myRoom)
      this.setState({
        squares : squaresCopy,
        myTurn : false,
        status : statusCopy
      })
    }
  }

  startGameAgain () {
    if(this.socket.id) this.socket.close()
    this.setState(JSON.parse(JSON.stringify(this.initialState)))
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
        <div style={{display:this.state.modalWindow.display}}>
          <ModalWindow modalData={this.state.modalWindow} startGameAgain={this.startGameAgain}/>
        </div>
      </div>
    )
  }
}

export default Board
