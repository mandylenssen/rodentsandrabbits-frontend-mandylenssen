import './Login.css'
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "../../components/button/Button.jsx";
import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {useForm} from "react-hook-form";
import axios from "axios";
import gerbil from "../../assets/gerbil-photo-login-page.png";

function Login() {

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.successMessage;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const {handleSubmit, register, formState: {errors},} = useForm({mode: 'onSubmit'});


    async function handleFormSubmit(data) {
        setIsLoading(true);
        try {
            const result = await axios.post(`http://localhost:8080/authenticate`, {
                username: data.email,
                password: data.password,
            }, {});
            login(result.data.jwt);
            navigate('/')
        } catch (error) {
            console.error('Authentication error:', error.response?.data || error.message);
            setErrorMessage('Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="outer-login-container outer-container">
            <div className="login-inner-container">

                <div className="login-input-fields-container">
                    {successMessage && <p>{successMessage}</p>}

                    <h3>Login</h3>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <label htmlFor="email-field">
                            <p>Email address</p>
                            <input
                                type="email"
                                id="email-field"
                                placeholder="Enter your email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </label>
                        {errors.email && <p className="error-text">{errors.email.message}</p>}

                        <label htmlFor="password-field">
                            <p>Password</p>
                            <input
                                type="password"
                                id="password-field"
                                placeholder="Enter your password"
                                {...register('password', {required: 'Password is required'})}
                            />
                        </label>
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <p>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button><span className="signup-text">Don't have an account yet? Sign up {' '}
                                <Link to="/createaccount">here</Link></span>
                        </p>

                    </form>
                </div>

                <div className="login-photo-wrapper">
                    <img className="login-photo" src={gerbil} alt="Picture of a gerbil"/>
                </div>
            </div>
        </div>
    );
}

export default Login;
