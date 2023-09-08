import React from 'react'
import './SingleText.css';

function SingleText(props) {
  return (
    <div>
        <p>{props.title}</p>
        <h2 className="h2Style">{props.text}</h2>
    </div>
  )
}

export default SingleText