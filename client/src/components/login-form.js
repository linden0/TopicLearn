import React, { useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom"
import "./auth-form.css"

function LoginForm() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    function handleLogin(e) {
        e.preventDefault();

        const form = e.target;
        const user = {
            email: form[0].value,
            password: form[1].value
        }

        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Invalid email or password") {
                setError("Invalid email or password");
            } else if (data.message === "Success") {
                navigate("/");
            }
            localStorage.setItem("token", data.token);

        })
    }

    useEffect(() => {
        fetch("http://localhost:5000/isUserAuthenticated", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }    
        })
        .then(res => res.json())
        .then(data => data.isAuthenticated ? navigate("/") : null)
    }, []);


 
        return (
            <div className="wrapper">
                <div className="form-wrapper">
                    <h2>Log in to your account</h2>
                    <p>Don't have an account? <Link to="/register" className="blue-link">Sign Up</Link></p>
                    <form onSubmit={event => handleLogin(event)}>
                        {error && <input disabled={true} value={error} className="full-width styled-input red"/>}
                        <div>
                            <p className="left" >Email</p>
                            <input type="email" required={true} className="full-width styled-input"/>
                        </div>
                        <div>
                            <p className="left" >Password</p>
                            <input type="password" required={true} className="full-width styled-input"/>
                        </div>
                        <input type="submit" value="Submit" className="button-filled full-width"/>

                    </form>
                </div>

            </div>

            
        )

}
export default LoginForm;