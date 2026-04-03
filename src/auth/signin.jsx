import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import "./auth.css";

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/signin", {
                email,
                password
            });

            if (res.data.success) {
                navigate("/login");
            } else {
                setError(res.data.message || "Sign In Error");
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
                    <p className="eyebrow">Реєстрація</p>
                    <h1>Створіть акаунт для нових історичних заявок.</h1>
                    <p>
                        Після реєстрації ви зможете надсилати теми, джерела, контакти та ілюстрації,
                        щоб формувати майбутні матеріали для сайту.
                    </p>
                </section>

                <form className="auth-card glass-panel" onSubmit={handleSubmit}>
                    <p className="eyebrow">Новий профіль</p>
                    <h2>Створити акаунт</h2>

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

                    <button className="button auth-card__button" type="submit">Створити акаунт</button>

                    <p className="auth-card__meta">
                        Вже маєте акаунт? <Link to="/login">Увійти</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signin;
