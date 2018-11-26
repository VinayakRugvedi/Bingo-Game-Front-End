import React from 'react'
import './ModalWindow.css'

function ModalWindow(props) {
  return (
    <div className="modalWindowBG">
      <div className="modalWindowContent">
        <div className="content">
          <p>{props.modalData.heading}</p>
          <p>{props.modalData.description}</p>
          <button onClick={props.startGameAgain}>Play Again!</button>
        </div>
      </div>
    </div>
  )
}

export default ModalWindow
