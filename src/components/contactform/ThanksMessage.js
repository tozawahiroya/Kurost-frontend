import React from "react";
import TwitterIcon from '@mui/icons-material/Twitter';
import { Button } from '@mui/material';
import './ThanksMessage.css';

function ThanksMessage() {
    return (
      <div className='container-message'>
          <p>ご利用ありがとうございました！</p>
          <p>素晴らしい成果が出せますように・・・</p>

          <TwitterIcon className='twitter-icon'/>

          <Button variant='contained' className='tweet-button' fullWidth>@casequest0
          </Button>

      </div>
  
    );
  };
  
  
export default ThanksMessage;