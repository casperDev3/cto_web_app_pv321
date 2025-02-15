"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./ProfilePage.module.css";
import Link from "next/link";

interface CarStats {
    repairsCount: number;
    carMake: string;
}

interface UserProfile {
    name: string;
    coverUrl: string;
    avatarUrl: string;
    nickName: string;
    joinedDate: string;
    about: string;
    carStats?: CarStats;
}

interface ProfileResponse {
    data: UserProfile;
    meta: unknown;
    success: boolean;
    warnings: unknown[];
}

const ProfilePage: React.FC = () => {
    const { nickName } = useParams();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [editField, setEditField] = useState<"name" | "avatarUrl" | "coverUrl" | "about" | null>(null);
    const [inputValue, setInputValue] = useState<string>("");

    // Фетч профиля
    useEffect(() => {
        if (!nickName) return;
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/v1/profile/${nickName}/`);  //динамический url
                if (!res.ok) throw new Error("Не вдалося завантажити профіль");
                const response: ProfileResponse = await res.json();
                setUserData(response.data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Невідома помилка");
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [nickName]);

    // Открытие-закрытие попапа для редактирования
    const openPopup = (field: "name" | "avatarUrl" | "coverUrl" | "about", currentValue: string) => {
        setEditField(field);
        setInputValue(currentValue);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setEditField(null);
        setInputValue("");
    };

    // Патч профиля
    const handleSave = async () => {
        if (!editField || !userData) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/v1/profile/${nickName}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [editField]: inputValue }),
            });
            if (!res.ok) throw new Error("Помилка оновлення");
            const response: ProfileResponse = await res.json();
            setUserData(response.data);
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Помилка оновлення профілю");
        } finally {
            closePopup();
        }
    };

    if (loading) return <div className={styles.profileContainer}><p>Завантаження...</p></div>;
    if (error) return <div className={styles.profileContainer}><p>Помилка: {error}</p></div>;
    if (!userData) return <div className={styles.profileContainer}><p>Дані профілю відсутні</p></div>;


    //Мистер или мисис с авторизацией сюда \/  ToDo Авторизация

    const currentUserNick = "Mechanik"; // Заглушка для текущего пользователя
    const isOwner = userData?.nickName === currentUserNick;


    return (
        <div className={styles.profileContainer}>
            {/* Фоновое изображение профиля */}
            <div className={styles.coverImage} style={{ backgroundImage: `url(${userData.coverUrl})` }}>
                {isOwner && <button className={styles.editCoverBtn} onClick={() => openPopup("coverUrl", userData.coverUrl)}>Змінити фон</button>}
            </div>

            <div className={styles.profileContent}>
                {/* Аватар пользователя и эдит баттон🥖 */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        <img className={styles.avatar} src={userData.avatarUrl} alt="User Avatar" />
                        {isOwner && <button className={styles.editAvatarBtn} onClick={() => openPopup("avatarUrl", userData.avatarUrl)}>✎</button>}
                    </div>
                </div>

                {/* Основная информация (машина ник и имя)*/}
                <div className={styles.userInfoContainer}>
                    <div className={styles.statItem}><strong>{userData.carStats?.carMake}</strong><span>Car Brand</span></div>
                    <div className={styles.userMainInfo}>
                        <h1 className={styles.userName}>{userData.name}</h1>
                        <p className={styles.userNick}>@{userData.nickName}</p>
                    </div>
                    <div className={styles.statItem}><strong>{userData.carStats?.repairsCount}</strong><span>Number of repairs</span></div>
                </div>

                {/* Описание "About" */}
                <div className={styles.aboutContainer}>
                    <h2>-- About Me --</h2>
                    <p>{userData.about}</p>
                </div>

                {/* Группа кнопок для смены инфо*/}
                <div className={styles.buttonGroup}>
                    <Link href="/">
                        <button className={styles.custom_buttons}>Home</button>
                    </Link>
                    {isOwner && (
                        <>
                            <button className={styles.custom_buttons} onClick={() => openPopup("name", userData.name)}>Change name</button>
                            <button className={styles.custom_buttons} onClick={() => openPopup("about", userData.about)}>Change About</button>
                        </>
                    )}
                </div>
            </div>

            {/* Попап для редактирования */}
            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <div className={styles.popupButtons}>
                            <button className={styles.popupSaveBtn} onClick={handleSave}>Сохранить</button>
                            <button className={styles.popupCloseBtn} onClick={closePopup}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;