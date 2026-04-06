import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArticleRequestCard from "./ArticleRequestCard.jsx";
import EditArticleModal from "./EditArticleModal.jsx";
import api from "../utils/api.js";
import "./articlesStyle.css";

function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const [editingArticle, setEditingArticle] = useState(null);
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

                const res = await api.get("/getPendingArticles", {
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

    async function handleSaveArticle(updatedArticle) {
        try {
            setError("");
            const token = localStorage.getItem("token");

            const res = await api.post("/updateArticle", updatedArticle, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setArticles((prev) =>
                    prev.map((article) =>
                        article.id === updatedArticle.id ? res.data.data : article
                    )
                );
            } else {
                setError(res.data.message || "Не вдалося оновити запит.");
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

            setError(err.response?.data?.message || "Сталася помилка під час оновлення запиту.");
            throw err;
        }
    }

    async function handleEditAndAccept(article) {
        setEditingArticle(article);
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
                        <Link className="button-ghost" to="/acceptedRequests">Прийняті запити</Link>
                        <Link className="button-ghost" to="/declinedRequests">Відхилені запити</Link>
                    </nav>
                </header>

                {error ? <p className="status-banner">{error}</p> : null}

                {articles.length === 0 ? (
                    <div className="empty-state">
                        Нових заявок поки немає. Коли користувачі подадуть теми, вони з&apos;являться тут.
                    </div>
                ) : (
                    <div className="review-grid">
                        {articles.map((article) => (
                            <ArticleRequestCard
                                article={article}
                                key={article.id}
                                actions={
                                    <>
                                        <button className="button" onClick={() => acceptRequest(article.id)} type="button">
                                            Прийняти
                                        </button>
                                        <button className="button-secondary" onClick={() => handleEditAndAccept(article)} type="button">
                                            Редагувати
                                        </button>
                                        <button className="button-danger" onClick={() => declineRequest(article.id)} type="button">
                                            Відхилити
                                        </button>
                                    </>
                                }
                            />
                        ))}
                    </div>
                )}

                {editingArticle && (
                    <EditArticleModal
                        article={editingArticle}
                        onClose={() => setEditingArticle(null)}
                        onSave={handleSaveArticle}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminArticles;
