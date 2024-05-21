import { Button } from 'react-bootstrap';

export default function PrintButton() {
    const handleClick = () => {
        window.print();
    };
    
    return (
        <span className="admin-button">
            <Button onClick={handleClick}>Print</Button>
        </span>
    );        
 
}
