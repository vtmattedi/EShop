import React from 'react';
import styles from './About.module.css';
import logo from '../../assets/logo-inverted.png';
import Header from '../../Header/Header';
// I hate case sensitiveness
function About() {
    return (
        <>
            <Header></Header>
            <div className={styles.outerdiv}>
                <img src={logo} alt='MattediWorks Logo' className={styles.logo} />
                <div className={styles.innerdiv}>
                    <div>
                        <div className={styles.text}>
                            <hr />
                            <p>
                                Welcome to the MattediWorks E-Shop Here you can test
                                our latest products, explore various categories, and enjoy a seamless shopping experience. Our mission is to provide high-quality products at competitive prices, ensuring customer satisfaction with every purchase.
                            </p>
                            <p>
                                Founded in 2022, MattediWorks is a small company that offers a wide range of services, including designing web apps, developing a backend, and designing custom microcontroller solutions, including IoT and Alexa integrations, making your life easier and your productivity higher. Our team is dedicated to providing the best customer service and ensuring that our customers are satisfied with their purchases. We are committed to delivering high-quality products that meet the needs of our customers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
