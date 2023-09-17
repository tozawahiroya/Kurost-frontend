import logo from './logo.svg';
import './App.css';
import ProductListText from './Component/ProductListText';
import SingleText from './Component/SingleText';
import Button from '@mui/material/Button';
import React, { useState, useRef, useEffect } from 'react';


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
      }
      //API2（戻り値：合計学）

      // setTotalPrice(50000000000000)
    }

    return (
      <div className="App">
        <div className="leftSection">
          <div>
            <p>レジ担当者コード</p>
            <input type="text" value={EMP_CD} onChange={handleChangetext2} />
            {error2 && <p style={{ color: 'red' }}>{error2}</p>}
          </div>
  
          <div>
            <p>商品コード入力</p>
            <input type="text" value={productCode} onChange={handleChangetext1} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button onClick={handle1ButtonClick}>
              商品コードの追加読み込み
            </Button>
          </div>
  
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
        </div>
      </div>
  );
  
  
}

export default App;
