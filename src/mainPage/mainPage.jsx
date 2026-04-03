import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { normalizeArticleImageUrl } from "../utils/articleMedia.js";
import "./mainPage.css";

function MainPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [topic, setTopic] = useState("");
    const [period, setPeriod] = useState("");
    const [description, setDescription] = useState("");
    const [sources, setSources] = useState("");
    const [contacts, setContacts] = useState("");
    const [image, setImage] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleInvalidToken = () => {
            localStorage.removeItem("token");
            setEmail("");
            setIsAdmin(false);
            setError("Сесію завершено. Увійдіть знову.");
            navigate("/login");
        };

        const checkToken = async () => {
            setError("");
            const token = localStorage.getItem("token");

            if (!token) {
                setEmail("");
                setIsAdmin(false);
                navigate("/login");
                return;
            }

            try {
                const res = await api.get("/getUserData", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success) {
                    setEmail(res.data?.email?.email || res.data?.email || "");
                } else {
                    setError("Не вдалося отримати дані користувача.");
                }
            } catch (err) {
                console.error(err.message);

                if (err.response?.status === 401) {
                    handleInvalidToken();
                    return;
                }

                setError(err.response?.data?.message || "Не вдалося завантажити дані користувача.");
            }
        };

        const checkRole = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAdmin(false);
                return;
            }

            try {
                const res = await api.get("/checkRole", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setIsAdmin(Boolean(res.data.success));
            } catch (err) {
                console.error(err.message);

                if (err.response?.status === 401) {
                    handleInvalidToken();
                    return;
                }

                setIsAdmin(false);
            }
        };

        checkToken();
        checkRole();
    }, [navigate]);

    async function handleRequestSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        try {
            const normalizedImageUrl = normalizeArticleImageUrl(image);

            const res = await api.post(
                "/addArticle",
                {
                    topic,
                    period,
                    description,
                    sources,
                    contacts,
                    image: normalizedImageUrl
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                setTopic("");
                setPeriod("");
                setDescription("");
                setSources("");
                setContacts("");
                setImage("");
                setSubmitMessage("Запит відправлено.");
            } else {
                setSubmitMessage("Запит не був відправлений. Спробуйте ще.");
            }
        } catch (err) {
            console.error(err.message);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setSubmitMessage(err.response?.data?.message || "Сталася помилка під час відправлення запиту.");
        }
    }

    return (
        <div className="page-shell">
            <header className="site-header">
                <div className="header-bar">
                    <Link className="site-logo" to="/">Історія Лозової</Link>

                    <nav className="site-nav">
                        <a href="#about">Про проєкт</a>
                        <a href="#curation">Процес</a>
                        <a href="#topics">Теми</a>
                        <a href="/articles">Статті</a>
                        <a href="#request">Подати запит</a>
                        {isAdmin && (
                            <Link className="site-nav__admin" to="/checkArticles">Панель перевірки</Link>
                        )}
                    </nav>

                    <div className="header-status">
                        {email ? (
                            <span className="header-status__badge">Користувач: {email}</span>
                        ) : (
                            <div className="header-status__links">
                                <Link className="header-status__link" to="/signin">Реєстрація</Link>
                                <Link className="header-status__button" to="/login">Увійти</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="page-main">
                <section className="hero-band">
                    <div className="section-inner hero-layout">
                        <div className="hero-copy">
                            <p className="eyebrow">Лозова, Україна</p>
                            <h1>Сучасна заявка на нові історії міста з м&apos;якою редакторською подачею.</h1>
                            <p className="hero-text">
                                Простір для збирання тем, джерел і контактів, щоб майбутні статті про Лозову
                                виростали не випадково, а через зрозумілий процес, людську пам&apos;ять і перевірені факти.
                            </p>

                            <div className="hero-actions">
                                <a className="button" href="#request">Запропонувати тему</a>
                                <a className="button-ghost" href="#about">Дізнатися більше</a>
                            </div>

                            <div className="hero-stat-grid">
                                <article className="hero-stat-card glass-panel">
                                    <span>01</span>
                                    <h2>Запит</h2>
                                    <p>Користувач описує тему, період, джерела та додає зображення.</p>
                                </article>
                                <article className="hero-stat-card glass-panel">
                                    <span>02</span>
                                    <h2>Кураторство</h2>
                                    <p>Адміністратор перевіряє зміст, доречність теми та повноту матеріалів.</p>
                                </article>
                                <article className="hero-stat-card glass-panel">
                                    <span>03</span>
                                    <h2>Майбутня стаття</h2>
                                    <p>Схвалені ідеї стають основою для нових історичних матеріалів про місто.</p>
                                </article>
                            </div>
                        </div>
                            {error && <p className="status-banner">{error}</p>}
                    </div>
                </section>

                <section className="section-band" id="about">
                    <div className="section-inner">
                        <div className="section-layout section-card glass-panel">
                            <div className="section-heading">
                                <p className="eyebrow">Про проєкт</p>
                                <h2>Чому цей сайт важливий для міської пам&apos;яті</h2>
                            </div>
                            <div className="section-content">
                                <p>
                                    Ресурс збирає теми про вулиці, установи, події, підприємства, школи, вокзал,
                                    храми, постаті та локальні історії, які не повинні губитися між випадковими постами.
                                </p>
                                <p>
                                    Замість хаотичного збору ідей тут працює зрозуміла послідовність: подання,
                                    перевірка, відбір і підготовка матеріалу для подальшої публікації.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-band section-band--feature" id="curation">
                    <div className="section-inner">
                        <div className="feature-grid">
                            <article className="feature-card glass-panel">
                                <p className="eyebrow">Архів</p>
                                <h2>Фокус на локальних деталях</h2>
                                <p>Дати, адреси, імена, спогади та візуальні матеріали збираються в одному місці.</p>
                            </article>
                            <article className="feature-card glass-panel">
                                <p className="eyebrow">Стиль</p>
                                <h2>Технологічна чистота без холодності</h2>
                                <p>Світлі градієнти, м&apos;які тіні та теплі акценти роблять інтерфейс живішим.</p>
                            </article>
                            <article className="feature-card glass-panel">
                                <p className="eyebrow">Адаптив</p>
                                <h2>Зручно і на великому екрані, і в телефоні</h2>
                                <p>Кнопки, форми та картки не ламаються на вузьких екранах і залишаються читабельними.</p>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="section-band section-band--alt" id="topics">
                    <div className="section-inner">
                        <div className="section-layout section-card glass-panel">
                            <div className="section-heading">
                                <p className="eyebrow">Теми</p>
                                <h2>Що можна запропонувати для майбутніх статей</h2>
                            </div>
                            <div className="section-content">
                                <ul className="topic-list">
                                    <li>Історію району, вулиці, площі або окремої будівлі.</li>
                                    <li>Подію, яка вплинула на розвиток Лозової.</li>
                                    <li>Матеріал про відомих людей міста.</li>
                                    <li>Тему про заклади освіти, підприємства, храми чи вокзал.</li>
                                    <li>Запит на основі архівних документів, фото або усних свідчень.</li>
                                    <li>Окрему міську легенду чи місце, яке потребує перевірки фактів.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-band section-band--accent" id="request">
                    <div className="section-inner">
                        <div className="section-layout section-card glass-panel section-layout--form">
                            <div className="section-heading">
                                <p className="eyebrow">Подання запиту</p>
                                <h2>Запропонуйте тему для нової історичної статті</h2>
                                <p className="section-note">
                                    Чим точніше опис і джерела, тим простіше адміністраторам оцінити перспективу
                                    майбутнього матеріалу та дати запиту рух далі.
                                </p>
                            </div>

                            <div className="section-content">
                                <form className="request-form" onSubmit={handleRequestSubmit}>
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

                                    <label className="request-form__wide">
                                        <span>Опис запиту</span>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Опишіть, яку саме статтю ви пропонуєте створити"
                                            required
                                        />
                                    </label>

                                    <label>
                                        <span>Джерела або матеріали</span>
                                        <textarea
                                            value={sources}
                                            onChange={(e) => setSources(e.target.value)}
                                            placeholder="Книги, архіви, посилання, свідчення, фото"
                                            required
                                        />
                                    </label>

                                    <label>
                                        <span>Контакт або примітка для адміністратора</span>
                                        <textarea
                                            value={contacts}
                                            onChange={(e) => setContacts(e.target.value)}
                                            placeholder="Ваші контакти або уточнення"
                                            required
                                        />
                                    </label>

                                    <label className="request-form__wide">
                                        <span>Посилання на зображення</span>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder="Наприклад: https://image.com/photo.jpg"
                                            required
                                        />
                                        <small className="request-form__hint">
                                            Можна вказати посилання без `https://` ми доповнимо його автоматично.
                                        </small>
                                    </label>

                                    <div className="request-form__actions">
                                        <button className="button request-form__button" type="submit">Надіслати запит</button>
                                    </div>
                                </form>

                                {submitMessage && <p className="request-form__message">{submitMessage}</p>}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-band" id="review">
                    <div className="section-inner">
                        <div className="section-layout section-card glass-panel">
                            <div className="section-heading">
                                <p className="eyebrow">Перевірка</p>
                                <h2>Що відбувається після надсилання запиту</h2>
                            </div>
                            <div className="section-content">
                                <p>
                                    Адміністратори переглядають зміст заявки, оцінюють історичну цінність теми
                                    та дивляться, чи достатньо там даних для подальшої роботи.
                                </p>
                                <p>
                                    Після цього запит можуть прийняти, відхилити або повернути на уточнення,
                                    якщо опис надто короткий чи бракує джерел.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="footer-bar glass-panel">
                    <p className="footer-brand">Історія Лозової</p>
                    <p className="footer-text">
                        Платформа для історичних заявок, що поєднує чистий сучасний інтерфейс і тепліший редакторський характер.
                    </p>
                    <p className="footer-text">Лозова, Україна</p>
                </div>
            </footer>
        </div>
    );
}

export default MainPage;
