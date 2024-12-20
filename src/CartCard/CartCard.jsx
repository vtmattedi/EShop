import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from "./CartCard.module.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useGlobalContext } from '../GlobalContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const test = {
    "id": 2,
    "title": "Mens Casual Premium Slim Fit T-Shirts ",
    "price": 22.3,
    "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    "rating": {
        "rate": 4.1,
        "count": 259
    }
}

const CartCard = ({ item }) => {
    const { removeFromCart } = useGlobalContext();
    const maxTitle = (title) => {
        if (!title) return ""
        if (title.length > 23) {
            return title.slice(0, 20) + '...'
        }

        return title
    }
    useEffect(() => {

    }, []);
    return (
        <Card className={styles.card}  >
            <div className={styles.outerdiv}>


                <Card.Img src={item.image} className={styles.cardimg} />
                <div className={styles.innerdiv}>
                    <Card.Title className={styles.cardtitle}>{maxTitle(item.title)}</Card.Title>
                    <div className={styles.pricebutton}>
                        <Card.Text className={styles.pricetext}>
                            {"$" + item.price.toFixed(2)}
                        </Card.Text>
                        <Button variant="danger" className={styles.cardbutton}
                            onClick={() => {
                                removeFromCart(item.uid);
                            }}
                        >Remove
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CartCard;