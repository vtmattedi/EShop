import { OrbitProgress } from 'react-loading-indicators';
const LoadIndicator = (className) => {
    return (
        <div style={
            {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center'
            }
        }>
            <OrbitProgress color="lightgreen" text="" textColor="" style={{
                fontSize: "5px"
            }} />
        </div>
    );
    
}

export default LoadIndicator;