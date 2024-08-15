import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Modal } from 'react-bootstrap';

const CustomerList = ({ onCustomerSelect }) => {
    const navigate = useNavigate();
    const [customerList, setCustomerList] = useState([])
    const [selectedCustomerId, setSelectedCustomerId] = useState()
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
    
    async function fetchCustomerList() {
        try {                
            const response = await axios.get('http://127.0.0.1:5000/customers')
            setCustomerList(await response.data);
        } catch (error) {
            console.error("Error fetching customers list:", error);
        }
    }

    useEffect(() => {
        fetchCustomerList()
    }, [])

    const selectCustomerID = (id) => {
        setSelectedCustomerId(id)
        onCustomerSelect(id)
        navigate(`/customers/form/${id}`)
    }

    const deleteCustomer = async (id) => {
        try {
            let accountId = ''
            // Getting account id via customer id before deleting customer
            await axios.get(`http://127.0.0.1:5000/customer_accounts/${id}`)
            .then(response => {
                accountId = response.data.id
            })
            .catch(error => {
                console.error("Error getting account id by customer id", error)
            })

            // Delete from Customers
            await axios.delete(`http://127.0.0.1:5000/customers/${id}`)
            .then(response => {
                console.log("Customer deleted from Customer Table", response.data)
            })
            .catch(error => {
                console.error("Error deleting customer from customer list:", error);
            })

            // Delete from Customer Accounts from gotten id of customer account via customer_id above
            await axios.delete(`http://127.0.0.1:5000/customer_accounts/${accountId}`)
            .then(response => {
                console.log("Customer deleted from Customer Account Table", response.data)
            })
            .catch(error => {
                console.error("Error deleting customer from customer list:", error);
            })

            setShowDeleteSuccessModal(true)
            // Refresh customer list display
        } catch (error) {            
            console.error("Error deleting Customer:", error);
        }
        fetchCustomerList()
    }

    const closeModal = () => {
        setShowDeleteSuccessModal(false)
        navigate('/customers/show')
    }

    return (
        <Container>
            <h2>List of Customers:</h2>
            <ListGroup>
                {customerList.map((customer, index) => (
                    <ListGroup.Item key={index}>
                        <h4 onClick={() => selectCustomerID(customer.id)}>{customer.name}</h4>
                        <Button onClick={() => deleteCustomer(customer.id)}>Delete</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={showDeleteSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleted!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The customer has been successfully deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='senondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default CustomerList