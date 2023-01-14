import  { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import "./auth-form.css"
function SignUpForm() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }
    function validatePassword(password) {
        const passwordRegex = /^.{6,}$/;
        return passwordRegex.test(password);
    }

    async function handleRegister(e) {
        e.preventDefault();

        const form = e.target;
        const user = {
            firstName: form[0].value,
            lastName: form[1].value,
            email: form[2].value,
            password: form[3].value
        }

        if (!user.email) {
            setError("Email must be non-empty")
        } else if (!user.password) {
            setError("Password must be non-empty");
        } else if (!validateEmail(user.email)) {
            setError("Invalid email");
        } else if (!validatePassword(user.password)) {
            setError("Password must be at least 6 characters")
        } else {

            fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message === "Success") {
                    navigate("/");
                } else {
                    setError(data.message);
                }
                localStorage.setItem("token", data.token);

            })
        }
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
            <div className="form-wrapper lg-height">
                <h2>Create an account</h2>
                <form className="large-form" onSubmit={event => handleRegister(event)}>
                    {error && <input disabled={true} value={error} className="full-width medium-height styled-input red"/>}
                    <div>
                        <p className="left" >First Name</p>
                        <input type="text" required={true} className="full-width medium-height styled-input"/>
                    </div>
                    <div>
                        <p className="left" >Last Name</p>
                        <input type="text" required={true} className="full-width medium-height styled-input"/>
                    </div>
                    <div>
                        <p className="left" >Email</p>
                        <input type="email" required={true} className="full-width medium-height styled-input"/>
                    </div>
                    <div>
                        <p className="left" >Password</p>
                        <input type="password" required={true} className="full-width medium-height styled-input"/>
                    </div>
                    <input type="submit" value="Register" className="button-filled full-width medium-height"/>

                </form>
            </div>
        </div>
    )
}
export default SignUpForm