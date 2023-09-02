import React from 'react'

function ProductListText({ productList = [] }) {
      
  return (
    <div>
        <ul>
          {productList.map(product => (
            <li key={product.id}>
              {product.product_name} {product.amount} {product.price} {product.total_amount}
            </li>
          ))}
        </ul>
    </div>
  )
}

export default ProductListText