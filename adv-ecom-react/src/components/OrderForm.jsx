import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Modal, Form, Dropdown } from 'react-bootstrap';

const OrderForm = ({ orderId }) => {
    const [date, setDate] = useState('');
    const [customer_id, setCustomer_id] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [productInOrder, setProductInOrder] = useState([]);
    const [productSelected, setProductSelected] = useState([]);
    const [errors, setErrors] = useState({
        "customer_id": "",
        "productList": []
    });
    const [selectedOrderId, setSelectedOrder] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Getting product data to add to order from.
        async function getProductList() {
            const productResponse = await axios.get(`http://127.0.0.1:5000/products`);
            const products = await productResponse.data;
            setProductList(products);
        }
        
        // Getting customer data to add to order from.
        async function getCustomerList() {
            const customerResponse = await axios.get(`http://127.0.0.1:5000/customers`);
            const customers = await customerResponse.data;
            setCustomerList(customers);
        }   

        try {            
            getProductList();
            getCustomerList();
        } catch (error) {
            console.error("Problem getting Customer or Product List", error);
        }
    }, []);

    useEffect(() => {
        if (orderId) {
            setSelectedOrder(orderId);
            async function setOrderFields(orderId) {
                const orderResponse = await axios.get(`http://127.0.0.1:5000/orders/${orderId}`);
                const orderData = await orderResponse.data;
                console.log(orderData)
                setDate(await orderData.date);
                setCustomer_id(await orderData.customer.id);
                // Get customer name using the customer ID
                const customerName = await orderData.customer.name;
                setCustomerName(customerName);
                setProductInOrder(orderData.order_items);
            }
    
            try {
                setOrderFields(orderId);
            } catch (error) {
                console.error("Problem setting state variables from drilled orderId:", error);
            }
        }
    }, [customerList])

    const validateForm = () => {
        const errors = {};
        if (!customer_id) errors.customer_id = "Customer is required";
        if (!productInOrder) errors.productInOrder = "Products are required";
        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
    
            let orderItemString = productInOrder.join(",")

            const orderData = {
                "customer_id": customer_id.trim(),
                "date": Date.now(),
                "order_items": orderItemString
            }
    
            const placeOrder = async () => {
                try {
                    await axios.post('http://127.0.0.1:5000/orders', orderData)
                    .then(response => {
                        console.log("Order Data successfully submitted", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error posting to orders from form:", error);
                    });
    
                    console.log("Order inserted successfully");
                } catch (error) {
                    console.error("Issue adding new order", error);
                }    
            };
    
            const updateOrder = async () => {
                try {
                    // Updating Order Table
                    await axios.put(`http://127.0.0.1:5000/orders/${selectedOrderId}`, orderData)
                    .then(response => {
                        console.log("Order Data successfully updated", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error updating orders form:", error);
                    });
    
                    console.log("Order updated successfully");
                } catch (error) {
                    console.error("Issue updating order", error);
                } 
            };
    
            selectedOrderId ? updateOrder() : placeOrder();
            setShowSuccessModal(true);
        } else {
            setErrors(errors);
        }
    };


    const closeSuccessModal = () => {
        setShowSuccessModal(false)
        navigate('/orders/show')
    }
    
    const openProductModal = () => {
        setShowProductModal(true)
    }

    const closeProductModal = () => {
        setShowProductModal(false)
    }

    const handleProductChange = (event) => {
        setProductSelected(event.target.value)
        console.log(productSelected)
    }

    const handleCustomerChange = (event) => {
        setCustomer_id(event.target.value)
        console.log(customer_id)
    }

    const addProductToOrder = () => {
        let productCopy = productInOrder
        productCopy.push(productSelected)
        console.log(productInOrder)
        setProductInOrder(productCopy)
    }

    // useEffect(() => {
        
    // }, [productInOrder]) 

    return (
        <Container>
            {selectedOrderId ? (
                <h2>Edit Order</h2>
            ) : (
                <h2>Add Order</h2>
            )}
            <Form onSubmit={handleSubmit}>
                {date &&
                    <div>
                        Date ordered: {date}
                    </div>
                }
                <label>                    
                    {customerName ? (
                        <h3>Customer: {customerName}</h3>
                    ) : (
                        <h3>Customer:</h3>
                    )}
                        <Form.Select onChange={handleCustomerChange} aria-label="Select Customer">
                            {selectedOrderId ? (
                                <option>Change Customer</option>
                            ) : (
                                <option>Select Customer</option>
                            )}
                            {customerList.map((customer, index) => (
                                <option key={index} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </Form.Select>
                </label>
                {errors.customer_id && <div style={{ color: 'red'}}>{errors.customer_id}</div>}
                <br />
                <label>
                    Products:
                    {productInOrder.map((productId, index) => (
                        <div key={index}>{productList.find(product => product.id === productId)}: {productList.find(product => product.id === productId)}</div>
                    ))}
                </label>
                <br />
                <Button type='button' onClick={openProductModal}>Add Product</Button>
                <br />
                <Button type='submit'>Submit</Button>
            </Form>
            
            {/* Product Modal */}
            <Modal show={showProductModal} onHide={closeProductModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add Product
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select onChange={handleProductChange} aria-label="Select Product">
                        {/* <option>Select Product</option> */}
                        {productList.map((product, index) => (
                            <option key={index} value={product.id}>{product.name}: ${product.price}</option>
                        ))}
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant='primary'>Add</Button> */}
                    <Button variant='primary' onClick={addProductToOrder}>Add</Button>
                    <Button variant='danger' onClick={closeProductModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {orderId ? ("Updated!") : ("Added")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {orderId ? (
                        "The order has been successfully updated."
                    ) : (
                        "The order has been successfully added."
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeSuccessModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default OrderForm