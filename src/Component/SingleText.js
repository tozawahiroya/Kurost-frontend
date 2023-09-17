import React, { useState, useEffect } from 'react';
import './SingleText.css';

function SingleText(props) {

  
  useEffect(() => {
    props.setTime2(new Date()); // 現在の時刻をstateに設定
  }, [props.text]); 


  return (
    <div>
        <p>{props.title}</p>
        <h2 className="h2Style">{props.text}</h2>

    </div>
  )
}

export default SingleText