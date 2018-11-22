import React from 'react'
import './Square.css'

class Square extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      squareSet : false,
      valueSpoken : false
    }
    this.assignValue = this.assignValue.bind(this)
  }

  assignValue () {
    if (!this.props.square.value) {
      this.setState({
        squareSet : true
      }, () => this.props.updateSquareValue(this.props.square.position))
    }
  }

  render () {
    return (
      <div
        style={{backgroundColor : this.props.square.color}}
        className="squareContainer"
        title="Click to add a random number"
        onClick={(this.state.squareSet && this.props.boardSet)
                  ? () => {
                    if(!this.props.square.marked && this.props.myTurn)
                    this.props.talkToServer(this.props.square.position)
                  }
                  : this.assignValue}>
          {(this.props.square.value) ? this.props.square.value : ''}
      </div>
    )
  }
}

export default Square
