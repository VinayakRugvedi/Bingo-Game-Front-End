import React from 'react'
import './Square.css'

class Square extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      squareSet : false
    }
    this.assignValue = this.assignValue.bind(this)
    this.talkToServer = this.talkToServer.bind(this)
  }

  assignValue () {
    if (!this.props.value) {
      this.setState({
        squareSet : true
      })
      this.props.getSquareValue(this.props.index)
    }
  }

  talkToServer () {
    console.log('Server guy')
  }

  render () {
    return (
      <div
        className="squareContainer"
        title="Click to add a random number"
        onClick={(this.state.squareSet && this.props.boardSet)
                  ? this.talkToServer
                  : this.assignValue}>
          {(this.props.value) ? this.props.value : ''}
      </div>
    )
  }
}

export default Square
