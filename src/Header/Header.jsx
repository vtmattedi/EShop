import React, { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Dropdown, DropdownItem, NavLink, DropdownButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useGlobalContext } from '../GlobalContext';
import CartCard from '../CartCard/CartCard';
import styles from './Header.module.css';
import logo from '../assets/logo-inverted.png';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { user, cart } = useGlobalContext();
    const [total, setTotal] = useState(0);
    const [openLogin, setOpenLogin] = useState(false);
    const closeLogin = () => { setOpenLogin(false) };

    const navigator = useNavigate();

    const getUserName = () => {
        if (user) {
            user.name.firstname = user.name.firstname.charAt(0).toUpperCase() + user.name.firstname.slice(1);
            user.name.lastname = user.name.lastname.charAt(0).toUpperCase() + user.name.lastname.slice(1);
            return `${user.name.firstname[0]}. ${user.name.lastname}`;
        }
        return "Login";
    }

    useEffect(() => {
        setTotal(cart.reduce((acc, item) => acc + item.price, 0));
    }, [cart])

    return (
        <div className={styles.outerdiv} >
            {/* <img src={logo} alt='MattediWorks Logo' className={styles.logo} /> */}
            <div className={styles.navcontainer}>
                <NavLink onClick={() => { navigator("/") }}><div className='bi bi-house'></div>Home</NavLink>
                <NavLink onClick={() => { navigator("/checkout") }} ><div className='bi bi-bag-check'></div>Checkout</NavLink>
                <NavLink onClick={() => { navigator("/about") }} ><div className='bi bi-info-circle'></div>About</NavLink>

            </div>
            <div className={styles.spacer}>
                <div className={styles.spacerinner}>
                    <img src={logo} alt='MattediWorks Logo' className={styles.logo} />
                    <div className={styles.spacerinner_two}>
                        <p className={styles.shop}> MattediWorks E-Shop</p>
                    </div>

                </div>


            </div>
            <div >
                <Button variant="outline" className={styles.loginbutton}
                    onClick={() => setOpenLogin(true)}
                >{"" + getUserName()}</Button>
            </div>
            <div className={styles.cartcontainer}>
                <Button variant="primary" onClick={handleShow} className={styles.cartbutton}>
                    <div className={styles.cartcontainer}>
                        <div className={'bi bi-cart4 '}></div><p className={styles.carttext}>{cart.length === 0 ? "" : cart.length}</p>
                    </div>
                </Button>
            </div>
            <LoginForm visibile={openLogin} handleClose={closeLogin}></LoginForm>
            <Offcanvas show={show} onHide={handleClose}
                placement='end' >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Shopping Cart
                        {
                            cart.length > 0 &&
                            `   ${cart.length} ${cart.length > 1 ? 'items' : 'item'}`
                        }
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className={styles.offcanvasbody} >
                    {
                        cart.length === 0 &&
                        <Alert variant='info'>
                            Your cart is empty
                        </Alert>
                    }

                    {cart.map((item, index) => {
                        return (
                            <CartCard key={index} item={item} />
                        )
                    })}
                </Offcanvas.Body>
                {
                    total > 0 &&
                    <div className='d-flex justify-content-center'>
                        <Button variant="secondary"
                            onClick={() => { navigator("/checkout") }}
                            className={styles.checkoutbutton} >Go to Check Out{`  $${total.toFixed(2)}`} </Button>
                    </div>
                }
            </Offcanvas>

        </div>

    );
};

export default Header;