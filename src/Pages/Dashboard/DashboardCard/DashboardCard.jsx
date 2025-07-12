import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from "./DashboardCard.module.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useGlobalContext } from '../../../GlobalContext';
import { useNavigate } from 'react-router-dom';
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

const DashboardCard = ({ item }) => {
    const {addToCart, cart} = useGlobalContext();
    const [maxText, setMaxText] = React.useState(23)
    const maxTitle = (title) =>{
        if(title.length > maxText){
          return title.slice(0,maxText - 3) + '...'
        }
        return title
      }
      const navigator = useNavigate();
    
      useEffect(() => {
              const handleResize = () => {
                  if (window.innerWidth < 800) {
                      setMaxText(50);
                  } else {
                      setMaxText(23);
                  }
              }
      
              window.addEventListener('resize', handleResize);
              handleResize();
      
              return () => {
                  window.removeEventListener('resize', handleResize);
              };
          }, []);
 
    return (
        <Card className={styles.card} onClick={() => {
            navigator('/product/' + item.id);
        }}>
            <div className={styles.cardContainer}>

            <Card.Img variant="top" src={item.image} className={styles.cardimg}/>
            </div>
            <Card.Body className={styles.cardbody}>
                <Card.Title className={styles.cardtitle}>{maxTitle(item.title)}</Card.Title>
                <Card.Text className={styles.cardcontent}>
                    {"$" + item.price.toFixed(2)}
                </Card.Text>

            </Card.Body>
        </Card>
    );
};

export default DashboardCard;