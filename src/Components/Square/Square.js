import React from 'react'
import './Square.css'

class Square extends React.Component {
  constructor(props) {
    super(props)
    this.assignValue = this.assignValue.bind(this)
  }

  assignValue() {
    let value = this.props.value
                ? () => null
                : (
                    this.props.getSquareValue(this.props.index)
                  )
  }

  render() {
    return (
      <div className="squareContainer" title="Click to add a random number" onClick={this.assignValue}>
        {(this.props.value) ? this.props.value : ''}
      </div>
    )
  }
}

export default Square
