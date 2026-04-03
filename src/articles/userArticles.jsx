import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { normalizeArticleImageUrl } from "../utils/articleMedia.js";
import "./articlesStyle.css";

function getErrorMessage(error) {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.response?.status === 401) {
        return "Не вдалося виконати запит.";
    }

    if (error.response?.status === 403) {
        return "У вас немає доступу до перегляду цих статей.";
    }

    if (error.code === "ERR_NETWORK") {
        return "Не вдалося підключитися до сервера.";
    }

    return "Сталася помилка під час завантаження статей.";
}

function UserArticles() {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMoreInfo, setIsMoreInfo] = useState(false);

    useEffect(() => {
        const getArticles = async () => {
            setError("");

            try {
                const response = await api.get("/getArticles");

                if (response.data?.success === true && Array.isArray(response.data.data)) {
                    setArticles(response.data.data);
                } else {
                    setArticles([]);
                    setError("Неможливо отримати статті.");
                }
            } catch (requestError) {
                setArticles([]);
                setError(getErrorMessage(requestError));
            } finally {
                setIsLoaded(true);
            }
        };

        getArticles();
    }, []);

    async function getMoreInfo(id) {
        setError('');

        try {
            const res = await api.get(`/getFullInfo?id=${id}`);

            if(res.data?.success === true && Array.isArray(res.data.data)) {
                setArticles(res.data.data);
            } else {
                setArticles([]);
                setError('Неможливо отримати статті');
            }
        } catch (error) {
            setArticles([]);
            setError(getErrorMessage(error));
        } finally {
            setIsLoaded(true);
            setIsMoreInfo(true);
        }
    }

    return (
        <div className="review-page articles-page">
            <a href="/">Назад</a>
            <div className="review-page__inner">
                {isLoaded && !error && articles.length === 0 && (
                    <div className="empty-state articles-page__empty">
                        Ще не має статтей! <a href="/#request">Додайте їх!</a>
                    </div>
                )}

                {!error && !isMoreInfo && (
                    <div className="articles-list">
                        {articles.map((el) => (
                            <article className="public-article-card glass-panel" key={el.id}>
                                <div className="public-article-card__media">
                                    <img
                                        className="public-article-card__image"
                                        src={normalizeArticleImageUrl(el.image)}
                                        alt="Зображення статті"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="public-article-card__content">
                                    <h1 className="public-article-card__title">Тема: {el.topic}</h1>
                                    <button className="button" onClick={() => getMoreInfo(el.id)} type="button">
                                        Читати
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {isMoreInfo &&
                    articles.map((el) => (
                        <article className="article-detail glass-panel" key={el.id}>
                            <a className="button-ghost article-detail__back" href="/articles">Назад</a>
                            <div className="article-detail__media">
                                <img
                                    className="article-detail__image"
                                    src={normalizeArticleImageUrl(el.image)}
                                    alt={el.topic}
                                    loading="lazy"
                                />
                            </div>
                            <h1 className="article-detail__title">Тема: {el.topic}</h1>
                            <p className="article-detail__description">{el.description}</p>
                            <p className="article-detail__sources">
                                <span className="article-detail__label">Джерела:</span> {el.sources}
                            </p>
                        </article>
                    ))}

                {error && <p className="status-banner">{error}</p>}
            </div>
        </div>
    );
}

export default UserArticles;
