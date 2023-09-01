import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentFlag, setPaymentFlag] = useState(false); 

  if (paymentFlag && !errorMessage) {
    props.setPaidFlag(true);
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // This may not be necessary anymore

    // 支払いステータス表示用
    setPaymentFlag(true);
    
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setErrorMessage(error.message);
      props.setPaidFlag(false);
    } else {
      // `paymentMethod`には決済に必要な情報が含まれています。
      // この情報をサーバーサイドに送信して、最終的な決済を行います。
      // 例えば：
      // fetch('/api/pay', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify(paymentMethod),
      // });
    }
  };

  return (
    <div className="form-container">
      <form>
        <CardElement />
        <button onClick={handleSubmit} type="button" disabled={!stripe}>
          決済する
        </button>
      </form>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      {
        props.paidFlag ? (
          <div>
            支払い完了
          </div>
        ) : null
      }
    </div>
  );
}

export default CheckoutForm;
