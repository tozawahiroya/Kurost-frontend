import React,  { useState, useRef  }  from 'react';
import { useForm } from 'react-hook-form';
import './ContactForm.css';
import Button from '@mui/material/Button';
import CheckboxesGroup1 from './CheckboxesGroup1';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../stripe/CheckoutForm';


function ContactForm (props) {

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange" // onChangeを指定することで、フィールドが変更された際にバリデーションが行われます
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);  // 追加：エラーメッセージ用のステート

  const formContainerRef = useRef(null);

  const onSubmit = (data) => {
    setFormData(data);
    setSubmitted(true);
    setErrorMessage(null)
    console.log(data); // フォームのデータを表示する例としてコンソールに出力します
  };

  const fixFromData = (event) => {
    // 名前とメールアドレスが入力されており、かつ決済が完了している場合のみ処理を実行します
    if (formData.name && formData.email && paidFlag) {
      event.preventDefault();
      props.setName(formData.name);
      props.setEmail(formData.email);
      props.setMassage(formData.message);
      //API提出フラグ
      props.setAPIsubmit(props.APIsubmit + 1)
      props.setShowThanksMessage(true);
      setErrorMessage(null);  // エラーメッセージをクリア
    } else {
      // 必要に応じて、エラーメッセージを表示します
      setErrorMessage("決済を完了させてください");  // エラーメッセージをセット
      setSubmitted(false);
    }
  }
  // ContactForm上部に戻すonClick
  const handle1ButtonClick = () => {
    setSubmitted(false);
    setFormData(null);
    scrollToTop(formContainerRef);
  };
  // スクロールする関数
  const scrollToTop = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  // 1.5 Stripe関連
  const stripePromise = loadStripe('pk_test_51MoNbJK46q36zELWZjHJvoVDDpccdm41Wtp0zoHLprBxCJrKeJacB1IUjOP3PB8FVqA0H69QDttItmMEIUHVQNw000Kt9y1KYR'); // YOUR_STRIPE_API_KEYには、Stripeダッシュボードで取得したAPIキーを記述
  const [paidFlag, setPaidFlag] = useState(false); //Stripe決済フラグ CheckoutFromに渡す。


  return (
    <div className="form-container" ref={formContainerRef}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 名前 */}
        <div className='form'>
          <label htmlFor="name">名前　＊必須＊</label>
          {errors.name && <p className="error-message">名前を入力してください</p>}
          <input type="text" {...register("name", { required: true })} />
        </div>

        {/* メールアドレス */}
        <div className='form'>
          <label htmlFor="email">メールアドレス　＊必須＊</label>
          {errors.email && <p className="error-message">正しいメールアドレスを入力してください</p>}
          <input
            type="email"
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
          />
        </div>

        {/* アンケート：サービスの利用目的は何ですか？ */}
        <div className='form'>
          <CheckboxesGroup1 />
        </div>

        {/* 決済フォーム */}
        {props.showFeedbackForm && (
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              onPaymentComplete={props.handlePaymentComplete} 
              paidFlag = {paidFlag}
              setPaidFlag = {setPaidFlag}
              />
          </Elements>
          )}

        {/* フリーコメント */}
        <label htmlFor="message">メッセージ</label>
        <textarea {...register("message")} />
        {/* テキスト入力なしでエラー返す場合：{errors.message && <p className="error-message">メッセージを入力してください</p>} */}

        {/* 送信ボタン */}
        <Button variant="contained" type="submit">入力内容を確認する</Button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {submitted && (
        <div className="hover-message">
          <p>以下の内容で送信しますか？</p>
          <p>名前: {formData.name}</p>
          <p>メールアドレス: {formData.email}</p>
          <p>決済状況: {paidFlag ? '決済済み' : '未決済'}</p>
          <p>メッセージ: {formData.message}</p>
          <p>プライバシーポリシーに同意して送信をします</p>
          <Button variant="contained" type="submit" onClick={fixFromData}>送信する</Button> 
          <Button variant="contained" type="submit" onClick={handle1ButtonClick} >修正する</Button> {/* App.js の　<ThanksMessage/>に飛ばしたい*/}
        </div>
      )}
    </div>
  );
};

export default ContactForm;

