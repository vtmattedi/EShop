
import Logo from '../../assets/Logo2.svg';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
const NotFound = () => {
    const Navigate = useNavigate();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
            color: 'green'}}>
            <img src={Logo} alt="Logo" style={{width: '40vh'}}/>
            <h1>404 - Not Found</h1>
            <h5 style={{padding:'10px'}}>These are not the droids you are looking for.</h5>
            <Button variant="outline-warning"
            style={{color: 'green', borderColor: 'green'}}
            onClick={()=> { Navigate("/")}}>Continue the search</Button>
        </div>
    );
};

export default NotFound;