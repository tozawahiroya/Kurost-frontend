import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ContactForm from './components/contactform/ContactForm';
import CustomTimer from './components/customtimer/CustomTimer';
import Recording from './components/recording/Recording';
import { Button } from '@mui/material';
import SelectFarms from './components/questions/SelectFarms';
import SelectQuestions from './components/questions/SelectQuestions';
import ThanksMessage from './components/contactform/ThanksMessage';
import moment from 'moment';
import SelectFeedback from './components/contactform/SelectFeedback';
import { SignalCellularNull } from '@mui/icons-material';


function App() {

//1.1 API間で使用する変数の定義

  //API Post用変数
  const [id, setId] = useState("");
  const blob = id
  const bucket = "ci-quest"
  const [farm, setFarm] = useState("");
  const [question, setQuestion] = useState("");
  const [contents, setContents] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [massage, setMassage] = useState("");



  //API get 設問　※TEST
  const [qdata, setQdata] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/farmQestion')
      .then(response => response.json())
      .then(qdata => setQdata(qdata))
      .catch(error => console.error("Error fetching data: ", error));
  }, []);



//1.2 API操作関連
  const [APIsubmit, setAPIsubmit] = useState(0);

  //API提出関数
  const APIPost = () => {
      //fetch追記

      //id設定（提出時の1回のみ）
      setId(moment.utc().add(9, 'hours').format('YYYY-MM-DD-HH-mm-ss'));

      //APIsubmitを1以外にして2回目以降の実行を防ぐ
      setAPIsubmit(APIsubmit+1); 

  };

  //API提出関数の実行
  if (APIsubmit === 1) {
    APIPost(); // 変数が1の場合にのみ関数が実行されます。
  }


//1.3 カウントダウン関連変数＆関数
  const [isRunningConsideration, setIsRunningConsideration] = useState(false); //検討時間
  const [isRunningRecording, setIsRunningRecording] = useState(false); //録音時間用
  const [initialTime, setInitialTime] = useState(60*5); //録音時間用

//1.4 Scroll関数 + 各種Trigger
  // 選択された項目の初期設定（プルダウンをnullにしておく）
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // 問題選択パートの表示
  const [showSelectQuestions, setSelectQuestions] = useState(false);
  const selectQuestionsRef = useRef(null);
  const handle1ButtonClick = () => {
    setSelectQuestions(true);
    scrollToTop(selectQuestionsRef);
  };

  // 検討パートの表示
  const [showConsideration, setShowConsideration] = useState(false);
  const considerationRef = useRef(null);
  const handle2ButtonClick = () => {
    setShowConsideration(true);
    setIsRunningConsideration(true); 
    scrollToTop(considerationRef);
  };
  // 録音パートの表示
  const [showRecording, setShowRecording] = useState(false);
  const recordingRef = useRef(null);
  const handle3ButtonClick = () => {
    setShowRecording(true);
    setIsRunningConsideration(false);
    setIsRunningRecording(true);
    scrollToTop(recordingRef);
  };
  // 録音確認パートの表示
  const [showConfirmRecording, setConfirmRecording] = useState(false);
  const confirmRecordingRef = useRef(null);
  const handle4ButtonClick = () => {
    setConfirmRecording(true); 
    setIsRunningRecording(false);
    scrollToTop(confirmRecordingRef);
  };

  // 提出パートの表示
  const [showContactForm, setContactForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [showModifyButton, setShowModifyButton] = useState(false); 
  const contactFormRef = useRef(null);
  const handle5ButtonClick = () => {
    setContactForm(true);
    scrollToTop(contactFormRef);
  };
  // フィードバックの選択が変更された時の処理
  const handleFeedbackChange = (event) => {
    setSelectedFeedback(event.target.value);
    // フィードバックが選ばれた場合にフォームを表示
    if (event.target.value === "フィードバックが欲しい！（2,200円/税込)"|| event.target.value === "解答例だけ欲しい！（1,100円/税込)") {
        setShowFeedbackForm(true);
        setShowConfirmButton(true); // 送信ボタンを表示
        setShowModifyButton(false); // 修正するボタンを非表示
      } else if (event.target.value === "録音データだけ欲しい！（無料)") {
        setShowFeedbackForm(false);
        setShowConfirmButton(false); // 送信ボタンを非表示
        setShowModifyButton(true); // 修正するボタンを表示
      } else {
        setShowFeedbackForm(false);
        setShowConfirmButton(false); // 送信ボタンを非表示
        setShowModifyButton(false); // 修正するボタンを非表示
      }
    };
  // 決済が完了した際のコールバック関数
  const handlePaymentComplete = () => {
    setContactForm(false); // フォームを非表示にする（例として非表示にするが、適宜適切な処理を実装してください）
  };

  // 再度回答する場合の関数 
  const [rerecoringFlag, setRerecoringFlag] = useState(true); //2回目以降の録音を判断する
  const [rerecoringCount, setRerecoringCount] = useState(1);//再録音回数
  const [recordedData, setRecordedData] = useState(null);
  const [audioKey, setAudioKey] = useState(Date.now());
  const handleButtonClick_return = () => {
    setShowRecording(true);
    setRerecoringFlag(false);
    setRerecoringCount(prevCount => prevCount + 1);

    setInitialTime(60*1); //タイマーリセットのきっかけである、Initialtimerを変更して
    setTimeout(() => {
      setInitialTime(60*5);
    }, 0);
    setContents(null);
    setAudioKey(Date.now()); 
    setIsRunningRecording(true);

    //伊藤さん追加パート？
    setConfirmRecording(false); // 録音確認部分を初期状態に戻す
    setRecordedData(null); // 録音データをリセットして、以前の録音データをクリア
    scrollToTop(recordingRef); 
  };

  // Recordingコンポーネント内の関数をAppコンポーネントで定義
  const handleRecordedData = (data) => {
    setRecordedData(data);
  };

  // ThanksMessageの表示
  const [showThanksMessage, setThanksMessage] = useState(false);
  const thanksMessageRef = useRef(null);
  const handle6ButtonClick = () => {
    setThanksMessage(true);
    scrollToTop(thanksMessageRef);
  };

  // スクロールする関数
  const scrollToTop = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

//スクロール処理
useEffect(() => {
  if (showSelectQuestions) {
    scrollToTop(selectQuestionsRef);
  }
}, [showSelectQuestions]);
useEffect(() => {
  if (showConsideration) {
    scrollToTop(considerationRef);
  }
}, [showConsideration]);
useEffect(() => {
  if (showRecording) {
    scrollToTop(recordingRef);
  }
}, [showRecording]);
useEffect(() => {
  if (showConfirmRecording) {
    scrollToTop(confirmRecordingRef);
  }
}, [showConfirmRecording]);
useEffect(() => {
  if (showContactForm) {
    scrollToTop(contactFormRef);
  }
}, [showContactForm]);
useEffect(() => {
  if (showThanksMessage) {
    scrollToTop(thanksMessageRef);
  }
}, [showThanksMessage]);

// 以下、JSX
  return (
    <div class="App">
      <header className="App-header">
        <h2>ケース面接Quest </h2>
        <h5>パソコンおよび安定した通信環境での実施を推奨します</h5>
        <div className="how-to-use">
          <p>「ケース面接Quest」は、1人でケース面接対策ができるアプリです<br/>
          回答録音をすると、フィードバック か 録音データ がもらえます
          </p>
          <p>【サービスの種類】</p>
          <ol>
            <li>フィードバックが欲しい！（2,200円/税込)</li>
            <li>解答例だけ欲しい！（1,100円/税込)</li>
            <li>録音データだけ欲しい！（無料)</li>
          </ol>
          <p>* 回答後に選べます</p>
        </div>
        <div className="button-container">
          <Button variant="outlined"> 使い方を確認する </Button>
          <Button variant="contained" onClick={handle1ButtonClick}> さっそくTry! </Button>
        </div>
      </header>



      <body className="App-body">

        {/* ※後で消す！ */}
        <div className="xxx">
          <div className="xxx-var-display">          
            <h2>id = {id}</h2>
            <h2>blob = {blob}</h2>
            <h2>bucket = {bucket}</h2>
            <h2>Farm = {farm}</h2>
            <h2>question = {question}</h2>
            <h2>name = {name}</h2>
            <h2>email = {email}</h2>
            <h2>massage = {massage}</h2>
            <h2>contents = {contents}</h2>
            {qdata && (
              <>
                {Object.entries(qdata).map(([key, value]) => (
                  <h2 key={key}>{value}</h2>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ※後で消す！ */}

        {/* 問題選択パート */}
        <div className="questions" ref={selectQuestionsRef}>
          {showSelectQuestions ? (
            <div className="questions-container">
              <p>練習したいファーム種別を選んでください</p>
              <SelectFarms  onChange={setSelectedFarm} setFarm={setFarm} />
              <p>問題を選んでください</p>
              <SelectQuestions setQuestion={setQuestion} />
              <div className="button-container">
                <Button variant="contained" onClick={handle2ButtonClick}>
                    検討を開始する
                </Button>
              </div>
            </div>
          ) : (
            <div>1 : 問題を選ぶ</div>
          )}
        </div>

        {/* 検討パート */}
        <div className="consideration" ref={considerationRef}>
          {showConsideration ? (
            <div className="consideration-container">
              <p>【問題】</p>
              <p>{question}</p> {/* onChange・propsに差替 */}
              <CustomTimer className="custom-timer" 
                initialTime={60*5} 
                autoStartDelay={5}  
                isRunning = {isRunningConsideration} 
                setIsRunning={setIsRunningConsideration} />
              <Button variant="outlined" onClick={handle3ButtonClick}>スキップする</Button>
            </div>
          ) : (
            <div>2 : 5分間で検討をする</div>
          )}
        </div>

        {/* 録音パート */}
        <div className="recording" ref={recordingRef}>

        {/* 
        2回目の以降の録音
        ・スクロールの基準になるRefはdivに指定
        ・次コンポーネントで「再度回答」のButtonが押されたのち、本divまでスクロール戻る
        ・戻った後にコンポーネント<CustomTimer/>を再読み込みする必要がある。
        
        方針
        ・以下の{showRecording ? ~ ~}を1回目、2回目移行で切り替えるコードを入れる？
        ・Usestate、Useeffect、ifが使用できる？　{}でJS埋め込む形？
        
        */}
        {rerecoringFlag ? 
          (showRecording ? (
            <div className="recording-container">
              <p>回答の録音を開始してください</p>
              <p>制限時間：５分</p>
              <p>録音回数 {1}</p>
              <CustomTimer className="custom-timer" 
                initialTime={initialTime} 
                isRunning = {isRunningRecording} 
                setIsRunning={setIsRunningRecording}
                />
              <Recording contents = {contents} setContents = {setContents}/>
              <audio src={contents} controls key={audioKey} />
              <div className='button-container'>
                <Button variant="contained" onClick={handle4ButtonClick}> 次へ </Button>
              </div>
            </div>
          ) : (
            <div>3 : 5分間で回答を録音する</div>
          )) : 
          (
            <div className="recording-container">
              <p>再度回答の録音を開始してください</p>
              <p>制限時間：５分</p>
              <p>5秒後にカウントダウンが開始します</p>
              <p>録音回数 {rerecoringCount}</p>
              <CustomTimer 
                className="custom-timer" 
                initialTime={initialTime} 
                isRunning = {isRunningRecording} 
                setIsRunning={setIsRunningRecording}
               />
              <Recording contents = {contents} setContents = {setContents}/>
              <audio src={contents} controls key={audioKey} />
              <div className='button-container'>
                <Button variant="contained" onClick={handle4ButtonClick}> 次へ </Button>
              </div>
            </div>
          )}

        </div>


        {/* 録音の確認・提出 */}
        <div className="confirm-recording" ref={confirmRecordingRef}>
         {showConfirmRecording ? (
            <div className="confirm-recording-container">
              <p>回答を確認して問題なければ提出ボタンを押してください</p>
              <p>録音に問題があった場合、再度実施することができます</p>
              {/*　Recordingは消して、録音のみ表示。　ContenstはApp.jsで定義 */}
              <div className="button-container">
                <Button variant="contained" onClick={handle5ButtonClick}> 回答を提出する </Button>
                <Button variant="outlined" onClick={handleButtonClick_return}> 再度回答する </Button>
                <Button variant="outlined" onClick={handle6ButtonClick}> 回答せずに終了する </Button>
              </div>
            </div>
          ) : (
            <div>4 : 回答を確認する</div>
          )}
        </div>


        {/* フィードバック申し込みフォーム */}
        <div className="submit-answer" ref={contactFormRef}>
        {showContactForm ? (
            <div>
              <p>おつかれさまでした！下記よりお申し込みください</p>
              
              <SelectFeedback onChange={handleFeedbackChange} />

              <ContactForm 
                setName = {setName} 
                setEmail = {setEmail} 
                setMassage = {setMassage} 
                APIsubmit = {APIsubmit} 
                setAPIsubmit = {setAPIsubmit}  
                setShowThanksMessage={setThanksMessage}
                thanksMessageRef={thanksMessageRef}
                handlePaymentComplete = {handlePaymentComplete}
                showFeedbackForm = {showFeedbackForm}
              />

              {/* {showFeedbackForm && (
              <Elements stripe={stripePromise}>
                <CheckoutForm onPaymentComplete={handlePaymentComplete}/>
              </Elements>
              )} */}
              
            </div>
          ) : (
            <div>5 : フィードバックを申し込む</div>
          )}
        </div>


        {/* ThanksMessage */}
        <div className="thanks-message" ref={thanksMessageRef}>
         {showThanksMessage ? (
            <div>
                <ThanksMessage/>
            </div>
          ) : (
            <div>6 : 終了！</div>
          )}
        </div>

        {/* TOPに戻る */}
        <div className="back-to-top">
          <Button variant="outlined" onClick={() => scrollToTop(window)} type="button">
            TOPに戻る
          </Button>
        </div>
        
      </body>
    </div>
  );
}

export default App;

