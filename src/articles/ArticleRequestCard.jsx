import { useEffect, useState } from "react";
import { normalizeArticleImageUrl } from "../utils/articleMedia.js";

function ArticleRequestCard({ article, actions, detailPath }) {
    const normalizedImageUrl = normalizeArticleImageUrl(article.image);
    const [hasImageError, setHasImageError] = useState(false);

    useEffect(() => {
        setHasImageError(false);
    }, [normalizedImageUrl]);

    const hasImage = Boolean(normalizedImageUrl) && !hasImageError;

    return (
        <article className="request-card glass-panel">
            <div className="request-card__media">
                {hasImage ? (
                    <img
                        src={normalizedImageUrl}
                        alt={article.topic || "Зображення статті"}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() => setHasImageError(true)}
                    />
                ) : (
                    <div className="request-card__placeholder">
                        <strong>
                            {article.image ? "Не вдалося завантажити зображення" : "Без зображення"}
                        </strong>
                        {article.image ? (
                            <a
                                className="request-card__media-link"
                                href={normalizedImageUrl || article.image}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Відкрити джерело
                            </a>
                        ) : null}
                    </div>
                )}
            </div>

            <div className="request-card__body">
                <div className="request-card__field">
                    <span>Тема</span>
                    <h2>{article.topic}</h2>
                </div>

                <div className="request-card__field">
                    <span>Період</span>
                    <p>{article.period}</p>
                </div>

                <div className="request-card__field">
                    <span>Опис</span>
                    <p>{article.description}</p>
                </div>

                <div className="request-card__field">
                    <span>Джерела</span>
                    <p>{article.sources}</p>
                </div>

                <div className="request-card__field">
                    <span>Контакти</span>
                    <p>{article.contacts}</p>
                </div>

                {actions ? <div className="request-card__actions">{actions}</div> : null}
            </div>
        </article>
    );
}

export default ArticleRequestCard;
