import { useContext } from 'react'
import {  useRoutes, BrowserRouter, Navigate } from 'react-router-dom'
import { ShoppingCartProvider, initializeLocalStorage, ShoppingCartContext } from '../../Context'
import Home from '../Home'
import MyAccount from '../MyAccount'
import MyOrder from '../MyOrder'
import MyOrders from '../MyOrders'
import NotFound from '../NotFound'
import SignIn  from '../SignIn'
import Navbar from '../../Components/Navbar'
import CheckoutSideMenu from '../../Components/CheckoutSideMenu'
import Form from '../Forms'
//ADMIN
import Admin from '../Admin'
import ShippingLavelTemplate from '../Admin/ShippingLavelTemplate'

//
import './App.css'
import CreateOrders from '../Admin/CreateOrders'

const AppRoutes = () => {
 
  const context = useContext(ShoppingCartContext)


 
  // Account
  const account = localStorage.getItem('account')
  const parsedAccount = JSON.parse(account)
  // Sign Out
  const signOut = localStorage.getItem('sign-out')
  const parsedSignOut = JSON.parse(signOut)
  // Private Routes
  const PrivateRoutes = (({})=>{})  
  // Has an account
  const noAccountInLocalStorage = parsedAccount ? Object.keys(parsedAccount).length === 0 : true
  const noAccountInLocalState = Object.keys(context.account).length === 0
  const hasUserAnAccount = !noAccountInLocalStorage || !noAccountInLocalState
  const isUserSignOut = context.signOut || parsedSignOut
  const isCustumerOrAdmin =  parsedAccount.role === "admin" ? true: false
 

  let routes = useRoutes([
    { path: '/', element: <Home />   },
    { path: '/clothes', element: hasUserAnAccount && !isUserSignOut ? <Home /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/electronics', element: hasUserAnAccount && !isUserSignOut ? <Home /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/furnitures', element: hasUserAnAccount && !isUserSignOut ? <Home /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/toys', element: hasUserAnAccount && !isUserSignOut ? <Home /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/others', element: hasUserAnAccount && !isUserSignOut ? <Home /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/my-account', element: <MyAccount /> },
    { path: '/my-order', element: <MyOrder /> },
    { path: '/my-orders', element: <MyOrders /> },
    { path: '/my-orders/last', element: <MyOrder /> },
    { path: '/my-orders/:id', element: <MyOrder /> },
    { path: '/admin', element: hasUserAnAccount && !isUserSignOut && isCustumerOrAdmin === true ? <Admin /> :<Navigate replace to={'/sign-in'}/>   },
    { path: '/admin/shipping-lavel-template', element: <ShippingLavelTemplate /> },
    { path: '/admin/create-orders', element: <CreateOrders /> },
    { path: '/sign-in', element: <SignIn /> },
    { path: '/recovery', element: <SignIn /> },
    { path: '/forms', element: <Form /> },
    { path: '/*', element: <NotFound /> },
  ])
  
  return routes
}

const App = () => {
  
  initializeLocalStorage()
  

  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <AppRoutes />
        <Navbar />
        <CheckoutSideMenu />
      </BrowserRouter>
    </ShoppingCartProvider>
  )
}

export default App
