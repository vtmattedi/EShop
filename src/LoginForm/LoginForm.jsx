import React, { useEffect, useState } from 'react';
import { useAxios } from '../axiosHook';
import { Button, Image, Modal, Tooltip } from 'react-bootstrap';
import { useGlobalContext } from '../GlobalContext';
import profile from '../assets/noprofile.svg';
import logo from '../assets/logo-inverted.png';
import LoadIndicator from '../Loadindicator';
import styles from './LoginForm.module.css';
import { OverlayTrigger } from 'react-bootstrap'

const LoginForm = ({ visibile, handleClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const axios = useAxios();
    const { user, setUser, addAlert } = useGlobalContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        logIn(username, password);
    };

    const logIn = (username, password) => {
        setLoading(true);
        const body = JSON.stringify({ username, password });
        axios.post('https://fakestoreapi.com/auth/login', body)
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                axios.get('https://fakestoreapi.com/users',
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                ).then((response) => {
                        console.log(response);
                        const users = response.data;
                        const parsed_user = users.find((user) => {
                            return user.username === username;
                        });
                        if (parsed_user) {
                            setUser(parsed_user);
                        }
                        else{
                            addAlert({ text: "Auth Server Failed!", title: 'Login Failed' });
                        }
                        setLoading(false);

                    })
                    .catch((error) => {
                        addAlert({ text: "Server Error: " + error.message, title: 'Login Failed' });
                        setLoading(false);
                    })
            })
            .catch((error) => {
                console.error(error);
                addAlert({ text: "Invalid User and/or password.", title: 'Login Failed' });
                setLoading(false);
            })
        return;
        
    }
    const logintooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            You can use any user from the <a href='https://fakestoreapi.com/docs#u-all'
                target='_blank'>API</a>.
        </Tooltip>
    );

    const setSelected = (id) => {
        const _user = userList.find(user => user.id == id);
        setUsername(_user.username);
        setPassword(_user.password);

    }

    const getFullUserName = (_user) => {
        if (_user) {
            _user.name.firstname = _user.name.firstname.charAt(0).toUpperCase() + _user.name.firstname.slice(1);
            _user.name.lastname = _user.name.lastname.charAt(0).toUpperCase() + _user.name.lastname.slice(1);
            return `${_user.name.firstname} ${_user.name.lastname}`;
        }
        return "-";
    }

    useEffect(() => {
        axios.get('https://fakestoreapi.com/users')
            .then((response) => {
                setUserList(response.data);
            })
    }, []);
    useEffect(() => {
        setUsername('');
        setPassword('');
    }, [visibile]);

    return (
        <Modal
            show={visibile}
            onHide={handleClose}
            data-bs-theme="dark">
            {!user &&
                <div className={styles.loginouter}>
                    <img src={logo} alt='MattediWorks Logo' className={styles.logo} />
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.userdiv}>
                            <label htmlFor="username">User:</label>
                            <input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.userdiv}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={logintooltip}
                        >
                            <div className={styles.selectdiv}>
                                <select className="form-select" aria-label="Default select example" onChange={(e) => setSelected(e.target.value)}
                                >
                                    <option selected>Available Users</option>
                                    {userList.map((user) => {
                                        {
                                            return (
                                                <option value={user.id} key={user.id}>{"" + getFullUserName(user)}</option>
                                            )
                                        }
                                    })
                                    }

                                </select>
                            </div>
                        </OverlayTrigger>
                        <Button type="submit"
                            className={styles.loginbutton}
                            disabled={loading}>
                            <div className={styles.insidebutton}>
                                {
                                    loading ? LoadIndicator() : "Login"
                                }
                            </div>
                        </Button>
                    </form>
                </div>
            }
            {
                user &&
                <div className={styles.userinfo}>
                    <p className={styles.username}>Welcome, {getFullUserName(user)}</p>
                    <img src={profile} alt="User Avatar" className={styles.userimg} />

                    <div className={styles.userinfocontainer}>
                        <p className={styles.uservar}>Username:</p>
                        <p className={styles.userval}>{user.username}</p>
                    </div>
                    <div className={styles.userinfocontainer}>
                        <p className={styles.uservar}>Phone:</p>
                        <p className={styles.userval}>{user.phone}</p>
                    </div>
                    <div className={styles.userinfocontainer}>
                        <p className={styles.uservar}>Email: </p>
                        <p className={styles.userval}>{user.email}</p>
                    </div>



                    <Button onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setUser(null);
                            setLoading(false);
                        }, 1500);
                    }}
                        className={styles.logoutbutton}
                        disabled={loading}
                        variant='danger'>
                        <div className={styles.insidebutton}>

                            {loading ? LoadIndicator() : "Logout"}

                        </div>
                    </Button>
                </div>
            }
            <Button variant="secondary"
                className={styles.closebutton}
                onClick={handleClose} >Close</Button>
        </Modal >

    );
};

export default LoginForm;