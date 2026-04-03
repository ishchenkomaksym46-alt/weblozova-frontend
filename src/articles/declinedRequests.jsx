import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ArticleRequestCard from "./ArticleRequestCard.jsx";
import api from "../utils/api.js";
import "./articlesStyle.css";

function DeclinedRequests() {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getArticles = async () => {
            setError("");
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const roleRes = await api.get("/checkRole", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!roleRes.data.success) {
                    setError("У вас немає доступу до цієї сторінки.");
                    return;
                }

                const res = await api.get("/getDeclinedArticles", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success) {
                    setArticles(res.data.data);
                } else {
                    setError(res.data.message || "Не вдалося завантажити статті.");
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login");
                    return;
                }

                if (err.response?.status === 403) {
                    setError(err.response?.data?.message || "У вас немає доступу до цієї сторінки.");
                    return;
                }

                setError(err.response?.data?.message || "Не вдалося завантажити статті.");
            }
        };

        getArticles();
    }, [navigate]);

    async function acceptRequest(id) {
        try {
            setError("");
            const token = localStorage.getItem("token");

            const res = await api.get(`/acceptRequest?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setArticles((prev) => prev.filter((article) => article.id !== id));
            } else {
                setError(res.data.message || "Не вдалося прийняти запит.");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(err.response?.data?.message || "У вас немає доступу до цієї сторінки.");
                return;
            }

            setError(err.response?.data?.message || "Сталася помилка під час прийняття запиту.");
        }
    }

    return (
        <div className="review-page">
            <div className="review-page__inner">
                <header className="review-hero glass-panel">
                    <div className="review-hero__copy">
                        <p className="eyebrow">Архів відхилень</p>
                        <h1>Відхилені запити</h1>
                        <p>
                            Тут зберігаються заявки, які не пройшли відбір. За потреби їх можна
                            повторно переглянути та прийняти назад у роботу.
                        </p>
                    </div>

                    <nav className="review-nav">
                        <Link className="button-ghost" to="/">Головна</Link>
                        <Link className="button-ghost" to="/checkArticles">Активні запити</Link>
                        <Link className="button-ghost" to="/acceptedRequests">Прийняті запити</Link>
                    </nav>
                </header>

                {error ? <p className="status-banner">{error}</p> : null}

                {articles.length === 0 ? (
                    <div className="empty-state">
                        Немає відхилених заявок. Це означає, що архів поки чистий.
                    </div>
                ) : (
                    <div className="review-grid">
                        {articles.map((article) => (
                            <ArticleRequestCard
                                article={article}
                                key={article.id}
                                actions={
                                    <button className="button" onClick={() => acceptRequest(article.id)} type="button">
                                        Прийняти знову
                                    </button>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeclinedRequests;
