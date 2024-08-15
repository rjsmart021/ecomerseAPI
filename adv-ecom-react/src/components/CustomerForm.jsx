import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Modal, Form } from 'react-bootstrap';

const CustomerForm = ({ customerId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        "name": "",
        "email": "",
        "phone": "",
        "username": "",
        "password": ""
    });
    const [selectedCustomerId, setSelectedCustomerId] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedCustomerId(customerId)
        if (customerId) {
            try {                
                async function setCustomerFields(customerId) {
                    const customerResponse = await axios.get(`http://127.0.0.1:5000/customers/${customerId}`)
                    const customerData = await customerResponse.data
                    setName(customerData.name)
                    setEmail(customerData.email)
                    setPhone(customerData.phone)

                    const accountResponse = await axios.get(`http://127.0.0.1:5000/customer_accounts/${customerId}`)
                    const accountData = await accountResponse.data
                    setUsername(accountData.username)
                    setPassword(accountData.password)
                }
                setCustomerFields(customerId)
            } catch (error) {
                console.error("Problem setting state variables from drilled customerId:", error)
            }
        }
    }, [])

    const handleChange = (event) => {
        const {name, value} = event.target;
        if (name == "name") {
            setName(value)
        } else if (name == "email") {
            setEmail(value)
        } else if (name == "phone") {
            setPhone(value)
        } else if (name == "username") {
            setUsername(value)
        } else if (name == "password") {
            setPassword(value)
        }
    }

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!email) errors.email = "Email is required";
        if (!phone) errors.phone = "Phone is required";
        if (!username) errors.username = "Username is required";
        if (!password) errors.password = "Password is required";
        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {

            const customerData = {
                "name": name.trim(),
                "email": email.trim(),
                "phone": phone.trim()
            }

            const customerAccountData = {
                "username": username.trim(),
                "password": password.trim(),
                "customer_id" : customerId ? customerId : ""
            }

            const placeCustomer = async () => {
                try {
                    await axios.post('http://127.0.0.1:5000/customers', customerData)
                    .then(response => {
                        console.log("Customer Data successfully submitted", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error posting to customers from form:", error)
                    })
        
                    // Add customer account via some get request to get customer id of newly created customer
                    const response =  await axios.get('http://127.0.0.1:5000/customers')
                    const lastIndex = await response.data.length - 1
                    const newCustomerId = await response.data[lastIndex].id
                    customerAccountData.customer_id = await newCustomerId
        
                    await axios.post('http://127.0.0.1:5000/customer_accounts', customerAccountData)
                    .then(response => {
                        console.log("Customer account Data successfully submitted", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error posting to customer accounts from form:", error)
                    })

                    console.log("Customer and account inserted successfully")
                } catch (error) {
                    console.error("Issue adding new customer", error)
                }    
            }

            const updateCustomer = async () => {                
                let accountId = ''
                try {
                    // Getting account id via customer id before updating
                    await axios.get(`http://127.0.0.1:5000/customer_accounts/${selectedCustomerId}`)
                    .then(response => {
                        accountId = response.data.id
                    })
                    .catch(error => {
                        console.error("Error getting account id by customer id", error)
                    })

                    // Updating Customer Table
                    await axios.put(`http://127.0.0.1:5000/customers/${selectedCustomerId}`, customerData)
                    .then(response => {
                        console.log("Customer Data successfully updated", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error updating customers form:", error)
                    })
        
                    // Updating Customer Account Table
                    console.log(customerData)
                    console.log(customerAccountData)
                    console.log(accountId)
                    await axios.put(`http://127.0.0.1:5000/customer_accounts/${accountId}`, customerAccountData)
                    .then(response => {
                        console.log("Customer account successfully updated", response.data);
                    })
                    .catch(error => {
                        console.error("There was an error updating customer accounts from form:", error)
                    })
                    
                    console.log("Customer and account updated successfully")
                } catch (error) {
                    console.error("Issue updating customer", error)
                } 
            }

            selectedCustomerId ?  updateCustomer() : placeCustomer();
            setShowSuccessModal(true)
        } else {
            setErrors(errors);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false)
        navigate('/customers/show')
    }

    return (
        <Container>
            {selectedCustomerId ? (
                <h2>Edit Customer</h2>
            ) : (
                <h2>Add Customer</h2>
            )}
            <Form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type='text' name='name' value={name} onChange={handleChange}/>
                </label>
                {errors.name && <div style={{ color: 'red'}}>{errors.name}</div>}
                <br />
                <label>
                    Email:
                    <input type='email' name='email' value={email} onChange={handleChange}/>
                </label>
                {errors.email && <div style={{ color: 'red'}}>{errors.email}</div>}
                <br />
                <label>
                    Phone:
                    <input type='tel' name='phone' value={phone} onChange={handleChange}/>
                </label>
                <br />
                {errors.phone && <div style={{ color: 'red'}}>{errors.phone}</div>}
                <label>
                    Username:
                    <input type='text' name='username' value={username} onChange={handleChange}/>
                </label>
                {errors.username && <div style={{ color: 'red'}}>{errors.username}</div>}
                <br />
                <label>
                    Password:
                    <input type='text' name='password' value={password} onChange={handleChange}/>
                </label>
                {errors.password && <div style={{ color: 'red'}}>{errors.password}</div>}
                <br />
                <Button type='submit'>Submit</Button>
            </Form>
            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {customerId ? ("Updated!") : ("Added")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {customerId ? (
                        "The customer has been successfully updated."
                    ) : (
                        "The customer has been successfully added."
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default CustomerForm