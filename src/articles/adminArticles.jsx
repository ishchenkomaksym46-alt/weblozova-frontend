import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./articlesStyle.css";

function AdminArticles() {
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
                const roleRes = await axios.get("http://localhost:5000/checkRole", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!roleRes.data.success) {
                    setError("У вас немає доступу до цієї сторінки.");
                    return;
                }

                const res = await axios.get("http://localhost:5000/getArticles", {
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

            const res = await axios.get(`http://localhost:5000/acceptRequest?id=${id}`, {
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

    async function declineRequest(id) {
        try {
            setError("");
            const token = localStorage.getItem("token");

            const res = await axios.get(`http://localhost:5000/declineRequest?id=${id}`, {
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
                        <p className="eyebrow">Адмін-панель</p>
                        <h1>Запити на додавання статей</h1>
                        <p>
                            Переглядайте нові теми, перевіряйте повноту опису та швидко вирішуйте,
                            які заявки переходять далі до підготовки матеріалу.
                        </p>
                    </div>

                    <nav className="review-nav">
                        <Link className="button-ghost" to="/">Головна</Link>
                        <Link className="button-ghost" to="/declinedRequests">Відхилені запити</Link>
                    </nav>
                </header>

                {error && <p className="status-banner">{error}</p>}

                {articles.length === 0 ? (
                    <div className="empty-state">
                        Нових заявок поки немає. Коли користувачі подадуть теми, вони з&apos;являться тут.
                    </div>
                ) : (
                    <div className="review-grid">
                        {articles.map((el) => (
                            <article className="request-card glass-panel" key={el.id}>
                                <div className="request-card__media">
                                    {el.image ? (
                                        <img src={el.image} alt="Зображення статті" />
                                    ) : (
                                        <div className="request-card__placeholder">Без зображення</div>
                                    )}
                                </div>

                                <div className="request-card__body">
                                    <div className="request-card__field">
                                        <span>Тема</span>
                                        <h2>{el.topic}</h2>
                                    </div>

                                    <div className="request-card__field">
                                        <span>Період</span>
                                        <p>{el.period}</p>
                                    </div>

                                    <div className="request-card__field">
                                        <span>Опис</span>
                                        <p>{el.description}</p>
                                    </div>

                                    <div className="request-card__field">
                                        <span>Джерела</span>
                                        <p>{el.sources}</p>
                                    </div>

                                    <div className="request-card__field">
                                        <span>Контакти</span>
                                        <p>{el.contacts}</p>
                                    </div>

                                    <div className="request-card__actions">
                                        <button className="button" onClick={() => acceptRequest(el.id)} type="button">
                                            Прийняти
                                        </button>
                                        <button className="button-danger" onClick={() => declineRequest(el.id)} type="button">
                                            Відхилити
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminArticles;
