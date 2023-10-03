import logo from './logo.svg';
import './App.css';
import ProductListText from './Component/ProductListText';
import SingleText from './Component/SingleText';
import Button from '@mui/material/Button';
import React, { useState, useRef, useEffect } from 'react';
import Quagga from "quagga";


function App() {

  const [productCode, setProductCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [massage, setMassage] = useState("購入処理完了まで少々お待ちください");
  const [purchaseButton, setPurchaseButton] = useState(false);

  const [EMP_CD, setEMP_CD] = useState("9999999999");
  const STORE_CD = "00030"
  const POS_NO = "090"
  const API_POST = null


  const[PRD_ID,setPRD_ID]=useState()
  const[PRD_NAME,setPRD_NAME]=useState("")
  const[PRD_PRICE,setPRD_PRICE]=useState()

  //時刻、時間差
  const[time1,setTime1]=useState(null)
  const[time2,setTime2]=useState(null)
  const[timeDef,setTimeDef]=useState(null)
 

  // APIのResponse格納
  const [API1_res, setAPI1_res] = useState({})
  const [singleProduct, setSingleProduct] = useState({})
  const [Item, setItem] = useState({})

  const [productList, setProductList] = useState([]); //React用
  const [items, setitems] = useState([]); //API用


  //API POST部分作成関数
  const constructFinalData = () => {
    return {
        EMP_CD,
        POS_NO,
        STORE_CD,
        items
    };
  };
  
  //input関連
  const [error, setError] = useState(''); // エラーメッセージを格納する
  const [error2, setError2] = useState(''); // エラーメッセージを格納するための状態

  const handleChangetext1 = (e) => {
    const value = e.target.value;
    setProductCode(value);
  };

  const handleChangetext2 = (e) => {
    const value = e.target.value;
    setEMP_CD(value);
  };

  useEffect(() => {
    // 10桁の整数かどうかを確認する正規表現
    const regex = /^\d{13}$/;

    if (productCode && !regex.test(productCode)) {
      setError('商品コードは13桁の整数で入力して下さい');
    } else {
      setError(''); // エラー状態をクリア
    }
  }, [productCode]);

  useEffect(() => {
    // 10桁の整数かどうかを確認する正規表現
    const regex = /^\d{10}$/;

    if (EMP_CD && !regex.test(EMP_CD)) {
      setError2('レジ担当者コードは10桁の整数で入力して下さい');
    } else {
      setError2(''); // エラー状態をクリア
    }
  }, [EMP_CD]);

  //バーコードの値をクエリパラメータとする/////////////////////////////////////////
  const handle1URL = `http://127.0.0.1:8000/products`

  // 一回だけ読み込む
  useEffect(() => {

    const handle1URL = `http://127.0.0.1:8000/products`
    fetch(handle1URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setAPI1_res(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });

  }, []); 

  useEffect(() => {
    setTimeDef((time2 - time1) / 1000); // 時間差（＝応答速度）を秒単位で記録
  }, [time2]); 

  
  // Button1の操作
  const handle1ButtonClick = () => {
    setTime1(new Date())
    console.log(time1)
    const searchItem = API1_res.products.find(item => item.PRD_CODE === productCode);

    if (!searchItem) {
      setError('存在しないProductCodeです。正しいProductCodeを入力してください。')
    }
  
    else {
      console.log(searchItem.PRD_NAME)

      setSingleProduct({
        PRD_NAME: searchItem.PRD_NAME,
        PRD_PRICE: searchItem.PRD_PRICE,
        Amount: 1,
        total_price: searchItem.PRD_PRICE
      });
        
            //   // itemステートの更新もsearchItemを使用して更新
      setItem({
        PRD_ID: searchItem.PRD_ID,
        PRD_CODE: productCode,
        PRD_NAME: searchItem.PRD_NAME,
        PRD_PRICE: searchItem.PRD_PRICE
      });
    };
          // // console.log(data); // 確認のため取得したデータをコンソールに表示
      
          // // FastAPIから返されたデータが空のオブジェクトでないか確認
          // if (Object.keys(data).length !== 0) {
          //   // APIの結果をsetAPI2_resで設定
          //   // setAPI1_res(data)
      
          //   // singleProductステートの更新

      
          //   setError(''); // エラー状態をクリア
      
          // } else {
          //   // エラーメッセージを設定して、再度正しいProductCodeの入力を促す
          //   setError('存在しないProductCodeです。正しいProductCodeを入力してください。');
          // }


    
  }


  const handle2ButtonClick = () => {
    if (!singleProduct.PRD_PRICE == "") {
      //リストの更新　※items appendの概念、関数もう一個
      setProductList([...productList, singleProduct]);
      setitems([...items, Item]);
      //データの中身を綺麗にする
      setSingleProduct({})

    }

  };


  const handle3ButtonClick = () => {
    if (items.length !== 0) {
        setPurchaseButton(true)
        const handle3URL = 'http://0.0.0.0:8000/create_purchase'
        const API_POST = constructFinalData()
        console.log('API POST', API_POST);

        fetch(handle3URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(API_POST),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          setTotalPrice(data.TOTAL_AMT);
          setMassage('ご購入ありがとうございました！！')
        })
        .catch(error => console.error('An error occurred:', error));
        
          setProductList([])
          setitems([])
          console.log(API_POST)
      }
      //API2（戻り値：合計学）

      // setTotalPrice(50000000000000)
    }

    //追加分//
    /////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    const [selectedTab, setSelectedTab] = useState(null);
    const [barcode,setBarcode] = useState("") // バーコードの値
    const [savedImage, setSavedImage] = useState(""); // スキャンした時のバーコード画像
    const [cameraActive, setCameraActive] = useState(false);  // 写真入力を判定する
 

    // Quagga初期化のおまじない
    const startCamera = () => {
      const config = {
        inputStream: {
          name : "Live",
          type : "LiveStream",        
          target: '#preview',
          size: 700,
          singleChannel: false
        },
        locator: {
          patchSize: "midium",
          halfSample: false
        },
        decoder: {
          readers: [{
            format: "ean_reader",
            config: {}
          }]
        },
        numOfWorker: navigator.hardwareConcurrency || 4,
        locate: true,
        src: null
      };

      Quagga.init(config, function(err) {
          if (err) {
              console.log(err);
              return;
          }
          Quagga.start();
        });
    };

    useEffect(() => {
        //Quaggaライブラリでバーコードが検出されたら実行される関数。引数のresultには検出情報が含まれる。
        Quagga.onDetected(result => {
          if (result !== undefined){
            setBarcode(result.codeResult.code);
            setProductCode(result.codeResult.code)
            const canvas = Quagga.canvas.dom.image;
            const imgSrc = canvas.toDataURL();  // Base64形式
            // このimgSrcをどこかのuseStateに保存して、後で表示する
            setSavedImage(imgSrc);

            Quagga.stop();  // ここでカメラを停止
            setCameraActive(false);  // カメラの状態をアップデート
              }
          });
        // カメラがアクティブなら起動
        if (cameraActive) {
            setBarcode("スキャン中")
            setSavedImage("");
            startCamera();
        }
        if(selectedTab == "manual") {
          Quagga.stop();
        }
    }, [cameraActive]);

    // 簡易なログイン機能の実装
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');
  
    const correctPassword = '9999999999'; 
    const handleLogin = () => {
      if (password === correctPassword) {
        setLoggedIn(true);
        setError('');
        setEMP_CD(password)
      } else {
        setLoginError('パスワードが異なります。');
      }
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
      <div className="App">
        <div className="leftSection">
          <p>Type2：Frontに全商品マスタ読み込み</p>

          {/* ログイン機能追加部分 */}
          {loggedIn ?(
          <div>
            <p>レジ担当者コード</p>
            <input type="text" value={EMP_CD} onChange={handleChangetext2} />
            {error2 && <p style={{ color: 'red' }}>{error2}</p>}

            <p>商品コード入力</p>
            <input type="text" value={productCode} onChange={handleChangetext1} placeholder="ここに手動入力する or 写真入力を選択" style={{width: "300px"}}/>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* 写真入力追加部分 */}
            <div>
              <button onClick={() => {setSelectedTab('photo'); setCameraActive(true); }}>写真入力開始</button>
              <button onClick={() => {setSelectedTab('manual'); setCameraActive(false);}}>写真入力終了</button>
            </div>
            {/* 追加ここまで */}

            <Button onClick={handle1ButtonClick}>
              商品コードの追加読み込み
            </Button>
          </div>
          ):(
          <div>
            <h2>ログインが必要です</h2>
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>ログイン</button>
              {loginError && <p>{loginError}</p>}
          </div>
          )}
          {/* 追加ここまで */}
  
          <div>
            <SingleText text={singleProduct.PRD_NAME} title={"商品名"} setTime2={setTime2}/>
            <SingleText text={singleProduct.PRD_PRICE} title={"単価"} setTime2={setTime2}/>
            <p>時間差は {timeDef}</p>
            <Button onClick={handle2ButtonClick}>
              追加
            </Button>
          </div>
        </div>
  
        <div className="rightSection">
          <div>
            <h3>購入リスト</h3>
            <ProductListText productList={productList} />
            <Button onClick={handle3ButtonClick}>
              購入
            </Button>
            {
              purchaseButton ?
                (
                  <>
                    <p>{massage}</p>
                  </>
                )
                :
                null
            }
            {
                totalPrice !== 0 ?
                (
                    <h3>合計金額 {totalPrice} 円</h3>
                )
                :
                null
            }
          </div>
          {/* カメラ起動用追加部分 */}
          {selectedTab === 'photo' && (
              <div>
                {barcode !== "" ? `バーコード：${barcode}` : "スキャン中"}
                {/* 写真入力を押したら、カメラ起動する */}
                {cameraActive && (<div id="preview"></div>)}
              </div>
            )}
            {selectedTab === null && (
              <div>
                
              </div>
            )}
            {savedImage && <img src={savedImage} width="300" height="300" />}
          {/* 追加部分ここまで */}
        </div>
      </div>
    )
}

export default App;
