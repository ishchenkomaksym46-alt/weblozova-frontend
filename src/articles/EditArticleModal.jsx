import { useState, useEffect } from "react";
import { normalizeArticleImageUrl } from "../utils/articleMedia.js";

function EditArticleModal({ article, onClose, onSave }) {
    const [topic, setTopic] = useState("");
    const [period, setPeriod] = useState("");
    const [description, setDescription] = useState("");
    const [sources, setSources] = useState("");
    const [contacts, setContacts] = useState("");
    const [image, setImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (article) {
            setTopic(article.topic || "");
            setPeriod(article.period || "");
            setDescription(article.description || "");
            setSources(article.sources || "");
            setContacts(article.contacts || "");
            setImage(article.image || "");
        }
    }, [article]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSaving(true);

        try {
            const normalizedImageUrl = normalizeArticleImageUrl(image);

            await onSave({
                id: article.id,
                topic,
                period,
                description,
                sources,
                contacts,
                image: normalizedImageUrl
            });

            onClose();
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    }

    if (!article) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Редагувати заявку</h2>
                    <button className="modal-close" onClick={onClose} type="button">✕</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <label>
                        <span>Тема або назва майбутньої статті</span>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Наприклад: Історія залізничного вузла Лозової"
                            required
                        />
                    </label>

                    <label>
                        <span>Період або дата</span>
                        <input
                            type="text"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            placeholder="Наприклад: 1869 рік або 1941-1943 роки"
                            required
                        />
                    </label>

                    <label>
                        <span>Опис запиту</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Опишіть, яку саме статтю ви пропонуєте створити"
                            rows="4"
                            required
                        />
                    </label>

                    <label>
                        <span>Джерела або матеріали</span>
                        <textarea
                            value={sources}
                            onChange={(e) => setSources(e.target.value)}
                            placeholder="Книги, архіви, посилання, свідчення, фото"
                            rows="3"
                            required
                        />
                    </label>

                    <label>
                        <span>Контакт або примітка для адміністратора</span>
                        <textarea
                            value={contacts}
                            onChange={(e) => setContacts(e.target.value)}
                            placeholder="Ваші контакти або уточнення"
                            rows="3"
                            required
                        />
                    </label>

                    <label>
                        <span>Посилання на зображення</span>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Наприклад: https://image.com/photo.jpg"
                            required
                        />
                    </label>

                    <div className="modal-actions">
                        <button className="button-ghost" onClick={onClose} type="button" disabled={isSaving}>
                            Скасувати
                        </button>
                        <button className="button" type="submit" disabled={isSaving}>
                            {isSaving ? "Збереження..." : "Зберегти"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditArticleModal;
