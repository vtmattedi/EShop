import React, { useEffect } from 'react';
import { Alert, Button, NavLink, Spinner, Tooltip } from 'react-bootstrap';
import { useState } from 'react';
import { useGlobalContext } from '../../GlobalContext';
import CheckoutCard from './CheckoutCard/CheckoutCard';
import { useAxios, calcFrete, calcETD } from '../../axiosHook';
import styles from './Checkout.module.css';
import LoadIndicator from '../../Loadindicator';
import Header from '../../Header/Header';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger } from 'react-bootstrap'
const Checkout = () => {
    const [step, setStep] = useState(0);
    const { cart, clearCart, user, addAlert } = useGlobalContext();
    const [total, setTotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [zip, setZip] = useState('');
    const [searching, setSearching] = useState(false);
    const [region, setRegion] = useState('');
    const [address, setAddress] = useState({});
    const [shipment, setShipment] = useState([]);
    const [enableNext, setEnableNext] = useState(true);
    const [processingPayment, setProcessPayment] = useState(false);
    const steps = ['Review Order', 'Delivery Address', 'Shipping', 'Payment'];
    const paymentMethods = ['Credit Card', 'Debit Card', 'Wire', 'Bitcoin'];
    const axios = useAxios();
    const navigator = useNavigate();
    const handleZipCode = (e) => {
        const enable_dot = false;
        const write_index = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : -1;
        const rewrite = (str) => {
            let new_t = "";
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '.' || str[i] === '-')
                    continue;
                new_t += str[i];
                if (new_t.length === 2 && enable_dot)
                    new_t += "."
                else if (new_t.length === 5 + enable_dot)
                    new_t += "-";
            }
            return new_t
        }
        if (e.key === 'Enter') {
            getAddressFromZip();

        }
        if (e.key === 'Backspace') {
            let t = zip;
            console.log(t, zip)
            if (write_index < 0) {
                t = t.slice(0, e.target.selectionStart) + t.slice(e.target.selectionEnd);
                let new_t = rewrite(t);
                setZip(new_t);
                return;
            }


            if (t.length <= 0)
                return;
            if (write_index != zip.length) {
                t = t.slice(0, write_index - 1) + t.slice(write_index);
                t = rewrite(t);
            }

            else {
                t = t.slice(0, t.length - 1);
                if (t.length === 2 && enable_dot)
                    t = t.slice(0, t.length - 1);
                if (t.length === 5 + enable_dot)
                    t = t.slice(0, t.length - 1);
            }
            setZip(t);

        }
        else if (parseInt(e.key) >= 0) {

            let t = zip;
            if (write_index < 0) {
                t = t.slice(0, e.target.selectionStart) + t.slice(e.target.selectionEnd);
                t = rewrite(t);
            }
            if (t.length >= 9 + enable_dot)
                return


            if (write_index > 0 && write_index != zip.length) {
                t = t.slice(0, write_index) + e.key + t.slice(write_index);
                t = rewrite(t);
            }
            else {
                if (t.length === 2 && enable_dot)
                    t += '.';
                if (t.length === 5 + enable_dot)
                    t += '-';
            }
            t += e.key;
            setZip(t);
        }

        //setZip(e.target.value);

    }

    const getAddressFromZip = () => {
        const _zip = zip.replace('-', '').replace('.', '');
        setSearching(true);
        axios.get(`https://viacep.com.br/ws/${_zip}/json/`).then((response) => {
            if (response.data.erro) {
                const text = `
                The zip code: ${zip} is not a valid brazilian zip code.
                Please enter a valid address so we delivery your purchases!`
                addAlert({ title: 'Invalid Zip Code', text: text });
                return;
            }
            else {
                let data_addr = {
                    street: response.data.logradouro,
                    city: response.data.localidade,
                    state: response.data.estado,
                    neighborhood: response.data.bairro,
                }
                setRegion(response.data.regiao);
                setAddress(data_addr);
                setEnableNext(true);
            }
        }).finally(() => {
            setSearching(false);
        });

    }
    const getClassName = (index, icon) => {
        if (icon) {
            let str = 'bi bi-circle';
            if (index < step)
                str = 'bi bi-check-circle-fill';
            return str;
        }
        let str = styles.navitem;
        if (index === step)
            str += ' ' + styles.itemactive;
        else if (index < step)
            str += ' ' + styles.itemcompleted;
        return str;

    }
    useEffect(() => {
        console.log(step);
        if (step === 2)
            setShipping(0);
        if (step === 0 && cart.length > 0)
            setEnableNext(true);
        else
            setEnableNext(false);

        console.log(step);
        if (step === steps.length) {
            clearCart();
            //go to Thank you page
        }
    }, [step]);
    useEffect(() => {
        setTotal(cart.reduce((acc, item) => acc + item.price, 0));
        setStep(0);
        setEnableNext(cart.length > 0);

    }, [cart]);

    useEffect(() => {
        if (user) {
            const cap = (str) => {
                return str.split(" ").map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(" ");
            }
            let data_addr = {
                street: cap(user.address.street),
                city: cap(user.address.city),
                state: "-",
                neighborhood: "-",
            }
            setAddress(data_addr);
        }
        else {
            let data_addr = {
                street: "-",
                city: "-",
                state: "-",
                neighborhood: "-",
            }
            setAddress(data_addr);
        }

        if (step > 1) {
            setStep(1);
        }
    }, [user]);

    useEffect(() => {
        let price = [];
        let etd = [];
        let services = ['Sedex', 'PAC', 'Standard'];
        for (let i = 0; i < 3; i++) {
            price.push(calcFrete(region));
            etd.push(calcETD(region));
        }
        price.sort((a, b) => b - a);
        etd.sort((a, b) => a - b);

        let _shipment = [];
        for (let i = 0; i < 3; i++) {
            _shipment.push({ service: services[i], price: price[i], etd: etd[i] });
        }

        setShipment(_shipment);

    }, [region]);


    const renderTooltip = (props) => (

        <Tooltip id="button-tooltip" {...props}>
            This needs to be a valid brazilian zip code.
            Try out 70150-900.
        </Tooltip>
    );
    const nextTooltipText = () => {
        switch (step) {
            case 0:
                return "";
            case 1:
                return "Enter a valid Zip code and click to search the address.";
            case 2:
                return "Select a valid shipping method.";
            case 3:
                return "Select a valid payment method.";
            default:
                return "";
        }

    }
    const nextButtonTooltip = (props) => (
        nextTooltipText() && !enableNext ?
            <Tooltip id="button-tooltip" {...props}>
                {nextTooltipText()}
            </Tooltip> :
            <></>

    );


    return (<>
        <Header />
        <div className={styles.outerdiv}>
            <div>
                <div
                    className={styles.navcontainer}>
                    {
                        steps.map((step_name, i) => {
                            return <NavLink key={i}
                                onClick={() => {
                                    setStep(i);
                                }}
                                className={getClassName(i, false)}
                                disabled={step < i}>
                                <div className={getClassName(i, true)}></div>
                                <p>{step_name}</p>
                                {
                                    i < steps.length - 1 &&
                                    <div className={"bi bi-caret-right"}></div>
                                }
                            </NavLink>
                        })
                    }

                </div>
                {/*Steps:
                        0: Review Order	
                        1: Delivery Address
                        2: Shipping
                        3: Payment
                        4: Confirmation
                */}
                {
                    //Review Order
                    step == 0 &&

                    <div className={styles.cartcontainer}>
                        <div className={styles.cartheaderdiv}>
                            <div className="bi bi-handbag" style={{ fontSize: "5em" }}></div>
                            <div className={styles.cartheaderitems}>
                                <b>
                                    Items in Cart:
                                </b>
                                <b style={{ fontSize: "3em" }}>
                                    {cart.length}
                                </b>
                            </div>
                        </div>
                        <div className={styles.cartlist}>
                            {
                                cart.length > 0 ?
                                    cart.map(item => {
                                        return <div key={item.uid}><CheckoutCard
                                            item={item}
                                        /></div>
                                    }) :
                                    <Alert variant='info'>
                                        Your cart is empty
                                    </Alert>
                            }
                        </div>
                    </div>
                }
                {
                    // Delivery Address
                    step == 1 &&
                    <div className={styles.deliverydiv}>
                        <div className="bi bi-geo-alt" style={{ fontSize: "5em" }}></div>
                        <div className={styles.addrcontainer}>
                            <p className={styles.addrname}>State: </p>
                            <p className={styles.addrval}>{address?.state}</p>
                        </div>
                        <div className={styles.addrcontainer}>
                            <p className={styles.addrname} >City: </p>
                            <p className={styles.addrval}>{address?.city}</p>
                        </div>
                        <div className={styles.addrcontainer}>
                            <p className={styles.addrname} >Street: </p>
                            <p className={styles.addrval}>{address?.street}</p>
                        </div>
                        <div className={styles.addrcontainer}>
                            <p className={styles.addrname} >Neighbourhood: </p>
                            <p className={styles.addrval}>{address?.neighborhood}</p>
                        </div>

                        <div className={styles.zipdiv} id='zipdiv'>
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 500, hide: 400 }}
                                overlay={renderTooltip}
                            >
                                <input type='text' placeholder='Zip Code'
                                    onKeyDown={handleZipCode}
                                    onChange={() => { }}
                                    value={zip}
                                    style={{ textAlign: 'center' }} />
                            </OverlayTrigger>
                            <Button
                                className={styles.findbutton}
                                onClick={getAddressFromZip}
                                disabled={searching}
                            >
                                {
                                    !searching ?
                                        <div className={styles.findinner}>
                                            Search
                                            <div className='bi bi-search'></div>
                                        </div> :
                                        <div className={styles.findinner}>
                                            {LoadIndicator(styles.loading)}
                                        </div>
                                }
                            </Button>
                        </div>




                    </div>
                }
                {
                    /*Shipment */
                    step == 2 &&
                    <div>
                        <div className="bi bi-airplane" style={{ fontSize: "5em" }}></div>
                        <div>
                            Shipping to {address?.city} {address?.state === "-" ? "" : ", " + address?.state}.
                        </div>
                        <div>
                            Please select the shippment method:
                        </div>
                        <div className={styles.shipmentcontainer}>
                            <Form>
                                {
                                    shipment.map((option, index) => {
                                        const _id = `shipment-${index}`;
                                        return <div key={index} className={styles.shipmentoption}>
                                            <div className={styles.shipmentinnerdiv}
                                            onClick={() => {
                                                document.getElementById(_id).checked = true;
                                                setEnableNext(true);
                                                setShipping(option.price)
                                            }}
                                        >
                                            <Form.Check // prettier-ignore
                                                type="radio"
                                                name="group2"
                                                id={_id}
                                                onClick={() => { setEnableNext(true) }}
                                            />
                                            <p className={styles.shipmentservice}>{option.service}</p>
                                            </div>
                                            <p>${option.price.toFixed(2)}</p>
                                            <p>{option.etd} {option.etd > 1 ? " days" : "day"}</p>
                                        </div>
                                    })
                                }

                            </Form>
                        </div>
                    </div>
                }
                {
                    //Payment
                    step == 3 &&
                    <div>
                        <div className="bi bi-credit-card" style={{ fontSize: "5em" }}></div>

                        <p>Please Select the Payment Method</p>
                        <div className={styles.paymentcontainer}>
                            <Form>
                                {
                                    paymentMethods.map((method, index) => {
                                        const _id = method.replace(' ', '_').toLowerCase();
                                        return <div key={index} className={styles.paymentoption}
                                            onClick={() => {
                                                setEnableNext(true);
                                                document.getElementById(_id).checked = true;
                                            }}>
                                            <Form.Check // prettier-ignore
                                                type="radio"
                                                name="group1"
                                                id={_id}
                                                onClick={() => { setEnableNext(true) }}
                                            />
                                            <p>{method}</p>
                                        </div>
                                    })
                                }

                            </Form>
                        </div>

                    </div>
                }
            </div>
            <div className={styles.bottomdiv}>
                {
                    (step === 0 || step >= 2) &&
                    <div className={styles.totaldiv}>
                        <p className={styles.totalname}>
                            Total:
                        </p>
                        <p className={styles.totalval}>
                            ${(step === 0 ? total : total + shipping).toFixed(2)}
                        </p>
                    </div>
                }
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 1000, hide: 500 }}
                    overlay={nextButtonTooltip}
                >
                    <div>
                        <Button onClick={() => {
                            if (step < steps.length - 1)
                                setStep((prev) => prev + 1);
                            else {
                                setProcessPayment(true);
                                setTimeout(() => {
                                    navigator('/thankyou');
                                    clearCart();
                                    setProcessPayment(false);
                                }, 1500);
                            }
                        }}
                            className={`${styles.nextbutton} ${step < steps.length - 1 ? '' : styles.lastbutton}`}
                            disabled={!enableNext}
                        >
                            {
                                step < steps.length - 1 ?
                                    <div className={styles.buttontext}> Next <div className='bi bi-arrow-right'></div></div> :
                                    processingPayment ?
                                        <div className={styles.buttontext}>{LoadIndicator()} </div> :
                                        <div className={styles.buttontext}> Pay </div>


                            }
                        </Button>
                    </div>
                </OverlayTrigger>
            </div >
        </div >
    </>
    );
};

export default Checkout;