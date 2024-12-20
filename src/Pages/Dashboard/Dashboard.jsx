import React from 'react';
import { useState, useEffect, useRef } from 'react';
import DashboardCard from './DashboardCard/DashboardCard';
import { Mosaic } from 'react-loading-indicators';
import { useGlobalContext } from '../../GlobalContext';
import { useAxios, DATA_URL } from '../../axiosHook';
import styles from './Dashboard.module.css';
import Header from '../../Header/Header';
import { Button } from 'react-bootstrap';
import LoadIndicator from '../../Loadindicator';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [itemsSize, setItemsSize] = useState(8);
    const [Loading, setLoading] = useState(true);
    const axios = useAxios();
    const products = useRef(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const requestMoreData = () => {
        setLoadingMore(true);
        let newItemsSize = itemsSize + 8;
        setItemsSize(newItemsSize);
        console.log('requesting', newItemsSize);
        axios.get(DATA_URL + `/products?limit=${newItemsSize}`).then((response) => {
            let _data = [...data];
            for (let i = 0; i < response.data.length; i++) {
                if (_data.find((item) => item.id === response.data[i].id)) {
                    continue;
                }
                else
                    _data.push(response.data[i]);
            }
            setData(_data);


        }).finally(() => {
            setTimeout(() => {
                products.current.scrollTo({ top: 7000, behavior: 'smooth' });
                setLoadingMore(false);
            }, 1);
        });
    }

    useEffect(() => {
        axios.get(DATA_URL + '/products?limit=8').then((response) => {
            setData(response.data);
            setLoading(false);
        });
    }, [])

    return (
        <>
            <Header />
            <div className={styles.outterdiv}
                ref={products}>

                {
                    Loading &&
                    <div className={styles.loadingdiv}>
                        <Mosaic color="#32cd32" size="large" text="" textColor="" />
                        {/* Loading items */}
                    </div>
                }
                {
                    !Loading &&
                    <div className={styles.innerdiv}>
                        <div className={styles.griddiv}>
                            {data.map(item => {
                                return <div key={item.id}><DashboardCard item={item} /></div>
                            })}
                        </div>
                        {
                            ((itemsSize < 20 || loadingMore) && !Loading) &&
                            <div className={styles.buttondiv}>
                                <Button
                                    onClick={requestMoreData}
                                    disabled={loadingMore}
                                    className={styles.loadmorebutton}
                                >
                                    <div className={styles.insidebutton}>
                                        {
                                            loadingMore ? LoadIndicator() : 'Load More'
                                        }
                                    </div>
                                </Button>
                            </div>
                        }
                    </div>
                }

            </div>



        </>
    );
};

export default Dashboard;