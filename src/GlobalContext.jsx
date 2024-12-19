import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
const GlobalContext = createContext(undefined);

const user_demo = {
    "address": {
        "geolocation": {
            "lat": "-37.3159",
            "long": "81.1496"
        },
        "city": "kilcoole",
        "street": "new road",
        "number": 7682,
        "zipcode": "12926-3874"
    },
    "id": 1,
    "email": "john@gmail.com",
    "username": "johnd",
    "password": "m38rmF$",
    "name": {
        "firstname": "john",
        "lastname": "doe"
    },
    "phone": "1-570-236-7033",
    "__v": 0
};

export const GlobalProvider = ({ children }) => {
    const [loadingText, setLoadingText] = useState(null);
    const [alertStack, setAlertStack] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(user_demo);
    const cartUID = React.useRef(0);

    const addToCart = (item) => {
        item = { ...item, uid: cartUID.current++ };
        setCart((prevCart) => [...prevCart, item]);
    }

    const removeFromCart = (uid) => {
        setCart((prevCart) => prevCart.filter((item) => item.uid !== uid));
    }

    const filteredCart = () => {

        let items = [];
        for (let i = 0; i < cart.length; i++) {
            let found = false;
            for (let j = 0; j < items.length; j++) {
                if (items[j].id === cart[i].id) {
                    found = true;
                    items[j].quantity++;
                    break;
                }
            }
            if (!found) {
                items.push({ ...cart[i], quantity: 1 });
            }
        }
        return items;
    }

    const getCurrentAlert = () => {
        return alertStack.length > 0 ? alertStack[alertStack.length - 1] : null;
    }
    const pushAlertToStack = (alert) => {
        setAlertStack((prevStack) => [...prevStack, alert]);
    };

    const popAlertFromStack = () => {
        setAlertStack((prevStack) => prevStack.slice(0, -1));
    };

    const addAlert = ({ title, text, onClose }) => {
        pushAlertToStack({ title, text, onClose });
    }

    const closeAlert = () => {
        const alert = getCurrentAlert();
        if (alert) {
            alert.onClose?.();
            setTimeout(() => {
                popAlertFromStack()
            }, 100);
        }
    }

    useEffect(() => {
        if (alertStack.length > 0) {
            setShowAlert(true);
        }
        else {
            setShowAlert(false);
        }
    }, [alertStack]);

    return (
        <GlobalContext.Provider value={{ addAlert, closeAlert, getCurrentAlert, loadingText, setLoadingText, setShowLoading, showLoading, showAlert, setShowAlert, cart, removeFromCart, addToCart, user, setUser, filteredCart, user_demo }}>
            {children}
            <Modal show={showAlert} data-bs-theme={"dark"}>
                <Modal.Title> <div
                    style={{
                        color:  'white' ,
                        textAlign: 'center',
                        marginTop: '1vh',
                    }}

                >{getCurrentAlert()?.title}</div></Modal.Title>
                <Modal.Body
                    style={{ color: 'white' }}
                >
                    {getCurrentAlert()?.text}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeAlert} variant='danger'>Close</Button>
                </Modal.Footer>
            </Modal>
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};