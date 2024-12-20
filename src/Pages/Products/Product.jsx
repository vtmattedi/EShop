import { Button } from 'bootstrap';
import Header from '../../Header/Header';
import React from 'react';

const Product = () => {

    return (<>
        <Header />
        <div>
            <img alt='product-image'></img>
            <p>
                Title
            </p>
            <p>
                Descrip
            </p>
            <Button>Add to Cart</Button>
            <h1>Product Page</h1>
            <p>Details about the product will go here.</p>
        </div>
    </>
    );
};

export default Product;