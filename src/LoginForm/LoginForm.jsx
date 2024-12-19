import React, { useEffect, useState } from 'react';
import { useAxios } from '../axiosHook';
import { Button, Image, Modal } from 'react-bootstrap';
import { useGlobalContext } from '../GlobalContext';
import profile from '../assets/noprofile.svg';
import logo from '../assets/logo-inverted.png';
import LoadIndicator from '../Loadindicator';

const LoginForm = ({ visibile, handleClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const axios = useAxios();
    const { user, setUser } = useGlobalContext();
   
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        logIn(username, password);
    };

    const logIn = (username, password) => {
        setLoading(true);
        setTimeout(() => {
            const _user = userList.find(user => user.username == username && user.password == password);
            if (_user) {
                setUser(_user);
                handleClose();
            }
            setLoading(false);
        }, 1500);
        return;
        const body = JSON.stringify({ username, password });
        axios.post('https://fakestoreapi.com/auth/login', body)
            .then((response) => {
                console.log(response.data);
                setUser(response.data);
                setLoading(false);
                handleClose();
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            }).finally(() => {
                setLoading(false);
                handleClose();
            });
    }

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
                console.log(response.data);
            })
    }, []);
    useEffect(() => {

        setUsername('');
        setPassword('');
        console.log(visibile);
    }, [visibile]);

    return (
        <Modal
            show={visibile}
            onHide={handleClose}
            data-bs-theme="dark">
            {!user &&
                <>
                    <img src={logo} alt='MattediWorks Logo' className='logo' />
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">User:</label>
                            <input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => setSelected(e.target.value)}>
                            <option selected>Available Users</option>
                            {userList.map((user) => {
                                {
                                    return (
                                        <option value={user.id} >{"" + getFullUserName(user)}</option>
                                    )
                                }
                            })
                            }

                        </select>
                        <Button type="submit"
                            disabled={loading}>{loading ? LoadIndicator() : "Login"}</Button>
                    </form>
                </>
            }
            {
                user &&
                <div>
                    <p>Welcome {getFullUserName(user)}</p>
                    <img src={profile} alt="User Avatar" />
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>

                    <Button onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setUser(null);
                            setLoading(false);
                        }, 1500);
                    }}
                        disabled={loading}
                        variant='danger'>{loading ? LoadIndicator() : "Logout"}</Button>


                </div>
            }
            <Button variant="secondary" onClick={handleClose} >Close</Button>
        </Modal>

    );
};

export default LoginForm;