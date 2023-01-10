import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./about.css"

function About() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    function handleClick() {
        navigate("/register");
    }

    useEffect(() => {
        fetch("http://localhost:5000/isUserAuthenticated", {
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
                        <h2 className="lg-title">Learn <span className="blue-font">fascinating topics</span> you never knew existed.</h2>
                        <p className="gray-font space-line">It's difficult to "find your passion" when you don't know what your looking for. It's difficult to exercise your brain in a world ruled by distracting social media content. It's easy to use Topic Learn to fall in love with learning again.</p>
                        {isAuthenticated ? null: <button className="button-filled medium-btn" onClick={handleClick}>Get Started</button>}

                    </div>
                </div>
                <div className="intro-right">
                    <img src={require("./img/idea-guy.jpg")} alt="smart-guy" height="90%">
                    </img>
                </div>
            </div>
            <div className="blue-container">
                <div className="card-container">
                    <div className="card">
                        <p className="card-images">🔎</p>
                        <h2>Discover something new</h2>
                        <p>Learning doesn't have to be boring. Find a new interest, from the paradox of choice to image-generating AI to an immortal jellyfish species, and reveal what career paths or fields you might enjoy.</p>
                    </div>
                    <div className="card">
                        <p className="card-images">🧠</p>
                        <h2>Keep your mind sharp</h2>
                        <p>Your brain needs exercise too. By reading a couple articles a day, you'll build mental fitness, regain your love for learning through natural dopamine, and become a more interesting person.</p>
                    </div>
                    <div className="card">
                        <p className="card-images">✏️</p>
                        <h2>Learn to storytell</h2>
                        <p>Storytelling beats statistics. It makes you memorable, likeable, and interesting. Practice storytelling by sharing your favorite topics. Top writers earn the money from ads.</p>
                    </div>
                </div>
            </div>

        </div>

    );
}
export default About;