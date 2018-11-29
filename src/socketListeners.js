function setSocketListeners(self) {
  self.socket.on('sendRoomName', (room) => {
    console.log(room.roomName);
    self.setState({
      myRoom : room.roomName
    })
  })

  self.socket.on('playerAvailable', (size) => {
    console.log(size)
    self.setState({
      playerAvailable : true
    })
  })

  self.socket.on('update', (valueObj) => {
    let squaresCopy = self.state.squares, position, statusCopy = self.state.status
    for (let square of squaresCopy) {
      if(square.value === valueObj.value) {
        square.color = '#f67e7d'
        square.marked = true
        position = square.position
        break
      }
    }
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
      self.socket.emit('winner')
      self.setState({
        modalWindow : {
          display : true,
          heading : 'Congratulations!',
          description : 'Finally, you have won the game...'
        }
      })
    } else {
      self.setState({
        squares : squaresCopy,
        myTurn : true,
        status : statusCopy
      })
    }
  })

  self.socket.on('lost', () => {
    self.setState({
      modalWindow : {
        display : true,
        heading : 'Disappointment',
        description : 'You lost, better luck next time...'
      }
    })
  })

  self.socket.on('playerDisconnected', () => {
    // self.socket.close()
    self.setState({
      modalWindow : {
        display : true,
        heading : 'OOPS!',
        description : 'Looks like the other player has left'
      }
    })
  })
}

export default setSocketListeners
