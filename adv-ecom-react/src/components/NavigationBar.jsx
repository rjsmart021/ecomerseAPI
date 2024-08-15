import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom'
import '../NavigationBar.css'

const NavigationBar = () => {
    return (
        <nav className='rounded'>
            <NavLink to='/' activeclassname='active'>Home</NavLink>
            <NavLink to='/customers/show' activeclassname='active'>Customers List</NavLink>
            <NavLink to='/customers/form' activeclassname='active'>Customer Editing</NavLink>
            <NavLink to='/products/show' activeclassname='active'>Products List</NavLink>
            <NavLink to='/products/form' activeclassname='active'>Product Editing</NavLink>
            <NavLink to='/orders/show' activeclassname='active'>Orders</NavLink>
            <NavLink to='/orders/form' activeclassname='active'>Place Order</NavLink>
        </nav>
    );
};

export default NavigationBar;