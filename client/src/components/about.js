import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./about.css"

function About() {
    const [width, setWidth] = useState([0,0]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    function handleClick() {
        navigate("/register");
    }

    useLayoutEffect(() => {
        function updateSize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('reize', updateSize);

    }, []);

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
        <div className="about-container">
            <div>
                <div className="intro-left">
                    <div className="action-container">
                        <h2 className="header">Learn fascinating topics you never knew existed.</h2>
                        <p>It's difficult to "find your passion" when you don't know what your looking for. It's difficult to exercise your brain in a world ruled by distracting social media content. It's easy to use Topic Learn to fall in love with learning again.</p>
                        {isAuthenticated ? null: <button className="button-filled medium" onClick={handleClick}>Get Started</button>}

                    </div>
                </div>
                
                {(width > 900) ? (
                    <div className="intro-right">
                        <img src={require("./img/idea-guy.jpg")} alt="smart-guy" height="90%">
                        </img>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className="blue">
                <div className="card-container">
                    <div className="card">
                        <img src={require("./img/brain.png")} width="50%"></img>
                        <h2>Discover something new</h2>
                        <p>Find a new interest, from psychology (the paradox of choice), to criminology (unsolved cases), to computer science (GANs). The benefits are endless: a sharp mind, finding a potential passion, a broadened perspective. </p>
                    </div>
                    <div className="card">
                        <img src={require("./img/write.png")} width="50%"></img>
                        <h2>Discover something new</h2>
                        <p>Find a new interest, from psychology (the paradox of choice), to criminology (unsolved cases), to computer science (GANs). The benefits are endless: a sharp mind, finding a potential passion, a broadened perspective. </p>
                    </div>
                </div>
            </div>

        </div>

    );
}
export default About;