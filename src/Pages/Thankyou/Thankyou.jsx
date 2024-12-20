import React from 'react';
import styles from './Thankyou.module.css';
import logo from '../../assets/logo-inverted.png';
import Header from '../../Header/Header';
import { Button } from 'react-bootstrap';

function Thankyou() {
    return (
        <>
            <Header></Header>
            <div className={styles.outerdiv}>
                <img src={logo} alt='MattediWorks Logo' className={styles.logo} />

                <div className={styles.innerdiv}>
                    <div className={`bi bi-check2-circle ${styles.check}`}></div>
                    <div>
                        <div className={styles.text}>
                            Purchase Successful
                            <hr />
                            <p>
                                Thank You for shopping with us. Your order is confirmed and will be delivered soon.
                            </p>
                            <p>In the mean time, check some new produts:</p>
                            <Button
                            onClick={() => {
                                window.location.href = "/";
                            }}
                            >Check it out!</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Thankyou;