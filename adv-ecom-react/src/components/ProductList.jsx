import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Modal } from 'react-bootstrap';

const ProductList = ({ onProductSelect }) => {
    const navigate = useNavigate();
    const [productList, setProductList] = useState([])
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
    
    async function fetchProductList() {
        try {                
            const response = await axios.get('http://127.0.0.1:5000/products')
            setProductList(await response.data);
        } catch (error) {
            console.error("Error fetching products list:", error);
        }
    }

    useEffect(() => {
        fetchProductList()
    }, [])

    const selectProductID = (id) => {
        onProductSelect(id)
        navigate(`/products/form/${id}`)
    }

    const deleteProduct = async (id) => {
        try {
            // Delete from Products
            await axios.delete(`http://127.0.0.1:5000/products/${id}`)
            .then(response => {
                console.log("Product deleted from Product Table", response.data)
            })
            .catch(error => {
                console.error("Error deleting Product from Product list:", error);
            })

            setShowDeleteSuccessModal(true)
            // Refresh Product list display
        } catch (error) {            
            console.error("Error deleting Product:", error);
        }
        fetchProductList()
    }

    const closeModal = () => {
        setShowDeleteSuccessModal(false)
        navigate('/products/show')
    }

    return (
        <Container>
            <h2>List of Products:</h2>
            <ListGroup>
                {productList.map((product, index) => (
                    <ListGroup.Item key={index}>
                        <h4 onClick={() => selectProductID(product.id)}>{product.name}</h4>
                        <Button onClick={() => deleteProduct(product.id)}>Delete</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={showDeleteSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleted!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The Product has been successfully deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default ProductList