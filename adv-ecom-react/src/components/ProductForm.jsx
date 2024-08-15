import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Modal, Form } from 'react-bootstrap';

const ProductForm = ({ productId }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({
        "name": "",
        "price": ""
    });
    const [selectedProductId, setSelectedProductId] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedProductId(productId)
        if (productId) {
            try {                
                async function setProductFields(productId) {
                    const productResponse = await axios.get(`http://127.0.0.1:5000/products/${productId}`)
                    const productData = await productResponse.data
                    setName(productData.name)
                    setPrice(productData.price)
                }
                setProductFields(productId)
            } catch (error) {
                console.error("Problem setting state variables from drilled productId:", error)
            }
        }
    }, [])

    const handleChange = (event) => {
        const {name, value} = event.target;
        if (name == "name") {
            setName(value)
        } else if (name == "price") {
            setPrice(value)
        }
    }

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!price) errors.price = "Price is required";
        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {

            const productData = {
                "name": name.trim(),
                "price": price.trim()
            }

            const placeProduct = async () => {
                try {
                    await axios.post('http://127.0.0.1:5000/products', productData)
                    .then(response => {
                        console.log("Product Data successfully submitted", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error posting to products from form:", error)
                    })

                    console.log("Product and account inserted successfully")
                } catch (error) {
                    console.error("Issue adding new product", error)
                }    
            }

            const updateProduct = async () => {
                try {
                    // Updating Product Table
                    await axios.put(`http://127.0.0.1:5000/products/${selectedProductId}`, productData)
                    .then(response => {
                        console.log("Product Data successfully updated", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error updating products form:", error)
                    })
                    
                    console.log("Product and account updated successfully")
                } catch (error) {
                    console.error("Issue updating product", error)
                } 
            }

            selectedProductId ?  updateProduct() : placeProduct();
            setShowSuccessModal(true)
        } else {
            setErrors(errors);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false)
        navigate('/products/show')
    }

    return (
        <Container>
            {selectedProductId ? (
                <h2>Edit Product</h2>
            ) : (
                <h2>Add Product</h2>
            )}
            <Form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type='text' name='name' value={name} onChange={handleChange}/>
                </label>
                {errors.name && <div style={{ color: 'red'}}>{errors.name}</div>}
                <br />
                <label>
                    Price:
                    <input type="number" step="0.01" name='price' value={price} onChange={handleChange}/>
                </label>
                {errors.price && <div style={{ color: 'red'}}>{errors.price}</div>}
                <br />
                <Button type='submit'>Submit</Button>
            </Form>
            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {productId ? ("Updated!") : ("Added")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productId ? (
                        "The product has been successfully updated."
                    ) : (
                        "The product has been successfully added."
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default ProductForm