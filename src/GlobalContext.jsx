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
    const [user, prsetUser] = useState(null);
    const cartUID = React.useRef(0);

    const clearCart = () => {
        const new_cart = [];
        localStorage.setItem('cart', JSON.stringify(new_cart));
        setCart(new_cart);
    }

    const setUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        prsetUser(user);
    }

    const addToCart = (item) => {
        if (!item) return
        if (item.id === undefined) return
        if (item.title === undefined) return
        if (item.price === undefined) return
        if (item.image === undefined) return
        item = { ...item, uid: cartUID.current++ };
        const new_cart = [...cart, item];
        localStorage.setItem('cart', JSON.stringify(new_cart));
        setCart(new_cart);
    }

    const removeFromCart = (uid) => {
        const new_cart = cart.filter((item) => item.uid !== uid);
        localStorage.setItem('cart', JSON.stringify(new_cart));
        setCart(new_cart);

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


    useEffect(() => {
        const _cart = localStorage.getItem('cart');
        if (_cart) {
            const __cart = JSON.parse(_cart);
            console.log("Loading cart from local storage", __cart);
            if (__cart.length > 0) {
                cartUID.current = __cart[__cart.length - 1].uid + 1;
                setCart(__cart);
            }
        }
        const _user = localStorage.getItem('user');
        if (_user) {
            const __user = JSON.parse(_user);
            prsetUser(__user);
        }
    }, []);

    return (
        <GlobalContext.Provider value={{ addAlert, closeAlert, getCurrentAlert, loadingText, setLoadingText, setShowLoading, showLoading, showAlert, setShowAlert, cart, removeFromCart, addToCart, user, setUser, filteredCart, user_demo, clearCart }}>
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