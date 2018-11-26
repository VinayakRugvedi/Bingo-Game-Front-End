import React from 'react'
import './Square.css'

class Square extends React.Component {
  constructor (props) {
    super (props)
    this.assignValue = this.assignValue.bind(this)
  }

  assignValue () {
    if (!this.props.square.value) {
      this.props.updateSquareValue(this.props.square.position)
    }
  }

  render () {
    return (
      <div
        style={{backgroundColor : this.props.square.color}}
        className="squareContainer"
        title={this.props.square.value ? 'Click to mark this number' : 'Click to assign a number'}
        onClick={(this.props.square.value && this.props.boardSet)
                  ? () => {
                    if(!this.props.square.marked && this.props.myTurn)
                    this.props.talkToServer(this.props.square.position)
                  }
                  : this.assignValue}>
        <div className="valueHolder">{(this.props.square.value) ? this.props.square.value : ''}</div>
      </div>
    )
  }
}

export default Square
