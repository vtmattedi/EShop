import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (

        <div className={styles.outterdiv}>
            <div className={styles.divleft}>
                <a
                    className={`bi bi-github ${styles.link}`}
                    href="https://github.com/vtmattedi/" >/vtmattedi</a>
                <a
                    className={`bi bi-linkedin ${styles.link}`}
                    href="https://www.linkedin.com/in/vitor-mattedi-dev" >/vitor-mattedi-dev</a>
            </div>
            <div className={styles.divmiddle}>
                    <p>&copy; {new Date().getFullYear()} MattediWorks. All rights reserved.</p>
            </div>
            <div className={styles.divright}>
                <div className={styles.divrightinner}>
                    <div className='bi bi-shop'></div>
                    <a href='https://g.co/kgs/9QBCgMB'>Escola Politecnica</a>
                </div>
                <div className={styles.divrightinner}>
                    <div className='bi bi-telephone'></div>
                    <a href='https://www.youtube.com/watch?v=14C28JSO-sg&ab_channel=GusttavoLimaOficial'>+55 (71) 99125003</a>
                </div>
            </div>

        </div>

    );
};

export default Footer;