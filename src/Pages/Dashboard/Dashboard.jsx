import React from 'react';
import { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard/DashboardCard';
import { Mosaic } from 'react-loading-indicators';
import { useGlobalContext } from '../../GlobalContext';
import { useAxios, DATA_URL } from '../../axiosHook';
import styles from './Dashboard.module.css';
import Header from '../../Header/Header';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [Loading, setLoading] = useState(true);
    const { addToCart, cart } = useGlobalContext();
    const axios = useAxios();

    useEffect(() => {
        axios.get(DATA_URL + '/products?limit=6').then((response) => {
            setData(response.data);
          //  console.log(response.data)
            // for (let i = 0; i < response.data.length; i++) {
            //     const item = response.data[i]
            //     addToCart(item);
            // }
            setLoading(false);
        });
    }, [])

    return (
        <>
        <Header />
        <div className={styles.outterdiv}>
            {
                Loading && <Mosaic color="#32cd32" size="large" text="" textColor="" />
            }
            {!Loading && data.map(item => {
                return <div key={item.id}><DashboardCard item={item} /></div>
            }
            )}
        </div>
        </>
    );
};

export default Dashboard;