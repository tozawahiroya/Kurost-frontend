import logo from './logo.svg';
import './App.css';
import ProductListText from './Component/ProductListText';
import SingleText from './Component/SingleText';
import Button from '@mui/material/Button';
import React, { useState, useRef, useEffect } from 'react';


function App() {

  let product_name = "おーいお茶"
  let product_price = 20000
  let product_list = {
      "product_name": "おーいお茶",
      "amount": 1,
      "unit_price": 5000,
      "total_amount":5000
    }

  
  return (
    <div className="App">
      <div>
        <p>商品コード入力</p>
        <input type="text"/>
        <Button>商品コードの追加読み込み</Button>
      </div>

      <div>
        <p>商品追加</p>
        <SingleText text = {product_name}/>
        <SingleText text = {product_price}/>
        <Button>追加</Button>

      </div>

      <div>
        <p>購入</p>
        <ProductListText product_list={product_list}/>
        <Button>購入</Button>

      </div>

    </div>
  );
}

export default App;
