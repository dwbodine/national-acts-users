import { FaSignOutAlt } from 'react-icons/fa';
import router from 'next/router';

export default function LogoutButton() {    
    const handleClick = () => {
        router.push("/logout/");
    };
    
    return (
        <div className="action-button">
            <a onClick={handleClick} title="Logout">
                <FaSignOutAlt size="2.5em" />
            </a>
        </div>
    );        
 
}
