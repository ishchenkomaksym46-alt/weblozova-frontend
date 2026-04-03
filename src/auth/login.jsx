import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import "./auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/login", {
                email,
                password
            });

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/");
            } else {
                setError(res.data.message || "Log In Error");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed connection with server";
            setError(errorMessage);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-panel">
                <section className="auth-aside glass-panel">
                    <Link className="auth-brand" to="/">Історія Лозової</Link>
                    <p className="eyebrow">Вхід</p>
                    <h1>Поверніться до редакторського простору про Лозову.</h1>
                    <p>
                        Увійдіть, щоб подати нову тему, додати матеріали або перейти до перевірки заявок,
                        якщо ваш акаунт має роль адміністратора.
                    </p>
                </section>

                <form className="auth-card glass-panel" onSubmit={handleSubmit}>
                    <p className="eyebrow">Обліковий запис</p>
                    <h2>Зайти в акаунт</h2>

                    <label>
                        <span>Електронна пошта</span>
                        <input
                            placeholder="Ваша електронна пошта"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        <span>Пароль</span>
                        <input
                            placeholder="Ваш пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    {error && <p className="status-banner">{error}</p>}

                    <button className="button auth-card__button" type="submit">Увійти</button>

                    <p className="auth-card__meta">
                        Ще не маєте акаунту? <Link to="/signin">Створити</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
