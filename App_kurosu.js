import logo from './logo.svg';
import './App.css';
import ProductListText from './Component/ProductListText';
import SingleText from './Component/SingleText';
import Button from '@mui/material/Button';
import React, { useState, useRef, useEffect } from 'react';


function App() {

  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productIdCounter, setProductIdCounter] = useState(0); // 一意のID生成のためのカウンター
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [massage, setMassage] = useState("");

  // バーコードrefに入力した値を取得する
  const [singleProduct,setSingleproduct] = useState([])
  const addproductRef = useRef(); 

  let productInfo = {
    id: productIdCounter,
    "product_name": productName,
    "amount": 1,
    "price": price,
    "total_amount":5000
  }
  
  //input関連
  const [error, setError] = useState(''); // エラーメッセージを格納するための状態

  const handleChangetext1 = (e) => {
    const value = e.target.value;
    setProductCode(value);
  };

  useEffect(() => {
    // 10桁の整数かどうかを確認する正規表現
    const regex = /^\d{10}$/;

    if (productCode && !regex.test(productCode)) {
      setError('商品コードは10桁の整数で入力して下さい');
    } else {
      setError(''); // エラー状態をクリア
    }
  }, [productCode]);

  // 中身確認用
  // useEffect(() => {
  //   console.log(productIdCounter);
  // }, [productIdCounter]);
  
  // Button1の操作
  const handle1ButtonClick = () => {
    //バーコードの値をクエリパラメータとする/////////////////////////////////////////
    const handle1URL = `http://127.0.0.1:8000/productcode/${addproductRef.current.value}`

    if (!error && productCode !== "") {
      // ここでAPI1叩く
      // ... API call ...
      fetch(handle1URL)
      .then((res) => {
        return res.json();
        })
        .then((data) => {
          // console.log(data.product);
          setSingleproduct(data.product); 
        });
      // エラーがない場合のみ更新
      setPrice(2000);
      setProductName('おーいお茶');
    }
  };

  const handle2ButtonClick = () => {
    if (!price == "") {
      //リストの更新
      setProductList([...productList, singleProduct]);
      setProductIdCounter(prev => prev + 1);
      //データの中身を綺麗にする
      setSingleproduct("")

      //消去 //いらない
      setPrice();
      setProductName('');
      setProductCode('');
    }

  };

  const handle3ButtonClick = () => {
    if (productIdCounter >= 1) {
      const handle3URL = "http://127.0.0.1:8000/productcode/api"
      const sendURL = `http://127.0.0.1:8000/productcode/api/${productList.length}`
      // console.log(productList.length)
      for (let count = 0; count < productList.length; count++){
        fetch(handle3URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(productList[count]),
        }).catch(error => console.error('An error occurred:', error));
      }
      // 送付したら商品一覧をリセット
      if (productList.length > 0){
        console.log(sendURL)
        fetch(sendURL)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setTotalPrice(data.total_price); 
        })
        .catch(error => console.error('An error occurred:', error));
      }
      setProductList([])
    
      //API2（戻り値：合計学）
      setMassage('ご購入ありがとうございました！！')
      // setTotalPrice(50000000000000)
    }

  };



  
  return (
    <div className="App">
      <div>
        <p>商品コード入力</p>
        <input type="text" value={productCode}
        ref={addproductRef} 
        onChange={handleChangetext1} />
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button onClick={handle1ButtonClick}>
          商品コードの追加読み込み
        </Button>

      </div>

      <div>
        <p>商品追加</p>
        {/* singleProductに埋め込みました */}
        <SingleText text = {singleProduct.product_name}/>
        <SingleText text = {singleProduct.price}/>
        {/* <SingleText text = {productName}/>
        <SingleText text = {price}/> */}
        <Button onClick={handle2ButtonClick}>
          追加
        </Button>

      </div>

      <div>
        <h2>購入リスト</h2>
        <ProductListText productList={productList}/>

        <Button onClick={handle3ButtonClick}>
          購入
        </Button>
        
        <p>{massage}</p>
        <p>合計金額 {totalPrice} 円</p>

      </div>

    </div>
  );
}

export default App;
