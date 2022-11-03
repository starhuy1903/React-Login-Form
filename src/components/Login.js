import React, {useEffect, useRef, useState} from 'react';
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import {useLocation, useNavigate} from "react-router-dom";

const LOGIN_URL = "/auth"

const Login = () => {
    const {setAuth, persist, setPersist} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({user, pwd}), {
                    headers: {'Content-Type': 'application/json'}, withCredentials: true
                });

            console.log(JSON.stringify(response?.data))
            // console.log(JSON.stringify(response))
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({user, pwd, roles, accessToken})
            setUser('');
            setPwd('')
            navigate(from, {replace: true});
        } catch (err) {
            if (!err?.response) {
                console.log("No Server Response")
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username of Password")
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem('persist', persist)
    }, [persist])

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
                <div className="persistCheck">
                    <input type="checkbox" id="persist" onChange={togglePersist} checked={persist}/>
                    <label htmlFor="persist">Trust this device</label>
                </div>
            </form>
            <p>
                Need an Account? <br/>
                <span className="line">
                {/*    put router link here*/}
                    <a href="src/components/Login#">Sign up</a>
                </span>
            </p>
        </section>
    );
};

export default Login;