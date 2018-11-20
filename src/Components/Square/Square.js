import React from 'react'
import './Square.css'

class Square extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="squareContainer">
        {this.props.value}
      </div>
    )
  }
}

export default Square
