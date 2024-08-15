import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import NavigationBar from './components/NavigationBar'
import CustomerList from './components/Customerlist'
import CustomerForm from './components/CustomerForm'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import OrderList from './components/OrderList'
import OrderForm from './components/OrderForm'

const App = () => {
  const [selectedCustomerID, setCustomerID] = useState()
  const [selectedProductID, setProductID] = useState()
  const [selectedOrderID, setOrderID] = useState()

  const handleCustomerSelect = (customerId) => {
    setCustomerID(customerId)
  }

  const handleProductSelect = (productId) => {
    setProductID(productId)
  }

  const handleOrderSelect = (orderId) => {
    setOrderID(orderId)
  }

  useEffect(() => {
  },[selectedOrderID])

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/customers/show' element={<CustomerList onCustomerSelect={handleCustomerSelect}/>} />
        <Route path='/customers/form' element={<CustomerForm />} />
        <Route path='/customers/form/:id' element={<CustomerForm customerId={selectedCustomerID}/>} />

        <Route path='/products/show' element={<ProductList onProductSelect={handleProductSelect}/>} />
        <Route path='/products/form' element={<ProductForm />} />
        <Route path='/products/form/:id' element={<ProductForm productId={selectedProductID}/>} />

        <Route path='/orders/show' element={<OrderList onOrderSelect={handleOrderSelect}/>} />
        <Route path='/orders/form' element={<OrderForm />} />
        <Route path='/orders/form/:id' element={<OrderForm orderId={selectedOrderID}/>} />
      </Routes>
    </>
  )
}

export default App