import React from 'react';

const Footer = () => {
    return (
        <footer style={{marginTop: '20px', position: 'fixed', bottom: '0', width: '100%'}}>
            <p>&copy; {new Date().getFullYear()} MattediWorks. All rights reserved.</p>
        </footer>
    );
};

export default Footer;