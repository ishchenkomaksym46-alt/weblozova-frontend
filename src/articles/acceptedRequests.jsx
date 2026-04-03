import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArticleRequestCard from "./ArticleRequestCard.jsx";
import api from "../utils/api.js";
import "./articlesStyle.css";

function AcceptedRequests() {
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

                const res = await api.get("/getAcceptedArticles", {
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

    async function declineRequest(id) {
        try {
            setError("");
            const token = localStorage.getItem("token");

            const res = await api.get(`/declineRequest?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setArticles((prev) => prev.filter((article) => article.id !== id));
            } else {
                setError(res.data.message || "Не вдалося відхилити запит.");
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

            setError(err.response?.data?.message || "Сталася помилка під час відхилення запиту.");
        }
    }

    return (
        <div className="review-page">
            <div className="review-page__inner">
                <header className="review-hero glass-panel">
                    <div className="review-hero__copy">
                        <p className="eyebrow">Архів підтверджень</p>
                        <h1>Прийняті запити</h1>
                        <p>
                            Тут зібрані теми, які вже пройшли кураторську перевірку і можуть стати основою для
                            майбутніх історичних матеріалів.
                        </p>
                    </div>

                    <nav className="review-nav">
                        <Link className="button-ghost" to="/">Головна</Link>
                        <Link className="button-ghost" to="/checkArticles">Активні запити</Link>
                        <Link className="button-ghost" to="/declinedRequests">Відхилені запити</Link>
                    </nav>
                </header>

                {error ? <p className="status-banner">{error}</p> : null}

                {articles.length === 0 ? (
                    <div className="empty-state">
                        Поки що немає прийнятих заявок. Коли адміністратор підтвердить нову тему, вона з&apos;явиться тут.
                    </div>
                ) : (
                    <div className="review-grid">
                        {articles.map((article) => (
                            <article className="review-grid__item" key={article.id}>
                                <ArticleRequestCard article={article} />
                                <button className="button-danger" onClick={() => declineRequest(article.id)} type="button">
                                    Відхилити
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AcceptedRequests;
