import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"
import "./navbar.css"

function Navbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isNavExpanded, setIsNavExpanded] = useState(false)

    async function logout() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        await navigate("/login");
    }

    useEffect(() => {
        fetch("/isUserAuthenticated", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }    
        })
        .then(res => res.json())
        .then(data => setIsAuthenticated(data.isAuthenticated)) 
    }, [navigate])

    return (
        <nav className="navigation">
            <Link to="/" className="brand-name">
                Topic Learn
            </Link>
            <button className="hamburger" onClick={() => {setIsNavExpanded(!isNavExpanded)}}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="white"
                >
                <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                />
                </svg>
            </button>
            <div className={isNavExpanded ? "navigation-menu expanded" : "navigation-menu"}>
                {
                    isAuthenticated ? (
                        <ul>
                            <li>
                                <Link to="/feed" className="links">Feed</Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="links">Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/liked" className="links">Liked</Link>
                            </li>
                        </ul>
                    ) : (<ul></ul>)
                }
                
                <ul>
                {
                    isAuthenticated ? 
                    (
                        <li>
                            <button onClick={logout} className="button-filled">Sign Out</button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <button className="button-filled white-bg">
                                    <Link to="/login" className="links">Sign In</Link>
                                </button>
                            </li>
                            <li>
                                <button className="button-filled">
                                    <Link to="register" className="links white-font">Sign Up</Link>
                                </button>
                            </li>
                        </>
                    )
                }
                </ul>
            </div>
        </nav>

    )
}


export default Navbar;
