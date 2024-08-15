import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Modal } from 'react-bootstrap';

const OrderList = ({ onOrderSelect }) => {
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([])
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
    
    async function fetchOrderList() {
        try {                
            const response = await axios.get('http://127.0.0.1:5000/orders')
            setOrderList(await response.data);
        } catch (error) {
            console.error("Error fetching order list:", error);
        }
    }

    useEffect(() => {
        fetchOrderList()
    }, [])

    const selectOrderID = (id) => {
        onOrderSelect(id)
        navigate(`/orders/form/${id}`)
    }

    const deleteOrder = async (id) => {
        try {
            // Delete from orders
            await axios.delete(`http://127.0.0.1:5000/orders/${id}`)
            .then(response => {
                console.log("order deleted from Order Table", response.data)
            })
            .catch(error => {
                console.error("Error deleting order from order list:", error);
            })

            setShowDeleteSuccessModal(true)
            // Refresh order list display
        } catch (error) {            
            console.error("Error deleting order:", error);
        }
        fetchOrderList()
    }

    const closeModal = () => {
        setShowDeleteSuccessModal(false)
        navigate('/orders/show')
    }

    return (
        <Container>
            <h2>List of Orders:</h2>
            <ListGroup>
                {orderList.map((order, index) => (
                    <ListGroup.Item key={index}>
                        <h4 onClick={() => selectOrderID(order.id)}>{order.date}</h4>
                        <h4 onClick={() => selectOrderID(order.id)}>{order.id}</h4>
                        <h4 onClick={() => selectOrderID(order.id)}>Customer: {order.customer_id}</h4>
                        <Button onClick={() => deleteOrder(order.id)}>Delete</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={showDeleteSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleted!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The Order has been successfully deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default OrderList