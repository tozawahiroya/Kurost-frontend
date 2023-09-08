import React from 'react'
import './ProductListText.css';


function ProductListText({ productList = [] }) {
  return (
    <div className="productListContainer">
      <ul>
        {productList.map(product => (
          <li key={product.PRD_ID}>
            {product.PRD_NAME} / {product.Amount}個 / 単価 {product.PRD_PRICE}円 / 合計{product.total_price}円
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductListText
