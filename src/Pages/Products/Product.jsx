import { Button } from 'react-bootstrap';
import Header from '../../Header/Header';
import React, { useEffect, useState } from 'react';
import { useAxios, DATA_URL } from '../../axiosHook';
import { useLocation } from 'react-router-dom';
import { BlinkBlur } from 'react-loading-indicators';
import { Card } from 'react-bootstrap';
import styles from './Product.module.css';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../GlobalContext';
import { Mosaic } from 'react-loading-indicators';
const Product = () => {
    const location = useLocation();
    const [item, setItem] = useState({});
    const [relatedItems, setRelatedItems] = useState([]);
    const axios = useAxios();
    const navigator = useNavigate();
    const { addToCart } = useGlobalContext();
    const [mobile, setMobile] = useState(false)
    const maxTitle = (title) => {
        if (title.length > 23) {
            return title.slice(0, 20) + '...'
        }
        return title
    }

    useEffect(() => {
        setRelatedItems([]);
        const pid = location.pathname.split('/')[2];

        axios.get(DATA_URL + '/products/' + pid).then((response) => {
            setItem(response.data);
            console.log(item);
            console.log(response.data?.category);
            axios.get(DATA_URL + '/products/category/' + response.data?.category).then((response) => {
                let _data = [...response.data];
                _data = _data.filter((item) => item.id !== parseInt(pid));

                while (_data.length > 3) {
                    const randomIndex = Math.floor(Math.random() * _data.length);
                    _data.splice(randomIndex, 1);
                }

                setRelatedItems(_data);
            });
        });
    }, [location]);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 800) {
                setMobile(true);
            } else {
                setMobile(false);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>
            <Header />
            {

                !item.id && <div className={styles.loading}><Mosaic color="#32cd32" size="medium" text="" textColor="" /></div>

            }
            {
                item.id && !mobile ? (
                    <div className={styles.outterdiv}>

                        <div className={styles.productoutter} >
                            <div className={styles.productimagediv}>
                                <img src={item?.image} alt='product-image' className={styles.productimage}></img>
                            </div>
                            <div className={styles.productexts}>
                                <div className={styles.productextsinner}>
                                    <p className={styles.producttitle}>
                                        {item?.title}
                                    </p>
                                    <p>
                                        {item?.description}
                                    </p>
                                </div>
                                <div className={styles.addbuttondiv}>

                                    <Button className={styles.addbutton}
                                        onClick={() => { addToCart(item); }}>
                                        <div className='d-flex gap-2 justify-content-center'> <div className='bi bi-cart-plus'></div>Add to Cart</div>
                                    </Button>
                                    <p className={styles.productprice}>
                                        {"$" + item?.price?.toFixed(2)}
                                    </p>

                                </div>
                            </div>
                        </div>

                        <p className={styles.relatedconst}> Related Products:</p>
                        <div className={styles.relatedoutter}>
                            {
                                relatedItems.length > 0 ?
                                    relatedItems.map((item) => {
                                        return <div key={item.id}>
                                            <Card className={styles.relatedcard}
                                                onClick={() => {
                                                    navigator('/product/' + item.id);
                                                }}
                                            >
                                                <div className={styles.relatedinner}>
                                                    <Card.Img className={styles.relatedimg} variant="top" src={item.image} />
                                                    <Card.Body className={styles.relatedbody}>
                                                        <Card.Title className={styles.relatedtitle} >{maxTitle(item.title)}</Card.Title>
                                                        <Card.Text className={styles.relatedtext}>
                                                            {"$" + item.price.toFixed(2)}</Card.Text>
                                                    </Card.Body>
                                                </div>
                                            </Card>
                                        </div>
                                    })
                                    :
                                    <BlinkBlur color="#32cd32" size="medium" text="" textColor="" />
                            }
                        </div>
                    </div>
                ) : (<>
                    <div className='w-100 d-flex justify-content-center align-items-center flex-column' style={{ height: '100vh' }}>
                        <div className={styles.productimagediv}
                            style={{
                                height: '40vh'
                            }}
                        >
                            <img src={item?.image} alt='product-image' className={styles.productimage}></img>
                        </div>
                        <p className={styles.producttitle}
                            style={{
                                fontSize: '1.5rem', textAlign: 'center', marginTop: '0.5rem',
                                lineHeight: '1.5rem', width: '90%', marginBottom: '0.5rem'
                            }}>
                            {item?.title}
                        </p>
                        <div
                            style={{
                                backgroundColor: '#32cd32',
                                width: '90%', marginBottom: '0.5rem',
                                height: '2px',
                                borderRadius: '5px',
                            }}
                        ></div>
                        <p>
                            {item?.description}
                        </p>
                        <div className={styles.addbuttondiv}>

                            <p className={styles.productprice}>
                                {"$" + item?.price?.toFixed(2)}
                            </p>
                            <Button className={styles.addbutton}
                                onClick={() => { addToCart(item); }}>
                                <div className='d-flex gap-2 justify-content-center'
                                    style={{ fontSize: '1.1rem' }}
                                > <div className='bi bi-cart-plus'></div>Add to Cart</div>
                            </Button>

                        </div>

                        <p className={styles.relatedconst}> Related Products:</p>
                        <div
                            style={{
                                width: '90%',
                                display: 'flex',
                                gap: '1rem',
                                overflowX: 'scroll',
                                height: '12em',
                            }}
                        >
                            {
                                relatedItems.length > 0 ?
                                    relatedItems.map((item) => {
                                        return <div key={item.id}>
                                            <Card className={styles.relatedcard}
                                                onClick={() => {
                                                    navigator('/product/' + item.id);
                                                }}
                                            >
                                                <div className={styles.relatedinner}>
                                                    <Card.Img className={styles.relatedimg} variant="top" src={item.image} />
                                                    <Card.Body className={styles.relatedbody}>
                                                        <Card.Title className={styles.relatedtitle}
                                                            style={{ fontSize: '1rem' }}
                                                        >{maxTitle(item.title)}</Card.Title>
                                                        <Card.Text className={styles.relatedtext}
                                                            style={{ fontSize: '1.2rem' }}
                                                        >
                                                            {"$" + item.price.toFixed(2)}</Card.Text>
                                                    </Card.Body>
                                                </div>
                                            </Card>
                                        </div>
                                    })
                                    :
                                    <BlinkBlur color="#32cd32" size="medium" text="" textColor="" />
                            }
                        </div>

                    </div>

                </>)
            }


        </>
    );
};

export default Product;