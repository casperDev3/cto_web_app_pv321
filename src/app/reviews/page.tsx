"use client";
import './ReviewsPage.css';
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {showToast} from "react-next-toast";
import styles from "@/app/blog/BlogPage.module.css";
import Link from "next/link";

// Определяем тип для отзыва
interface Review {
    id: number;
    author: string;
    rating: number;
    text: string;
}

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);  // Типизируем состояние
    const [visibleReviews, setVisibleReviews] = useState<number>(4);  // Типизируем состояние
    const [isLoading, setIsLoading] = useState<boolean>(true);  // Типизируем состояние
    const option = [{name: 'up', value: '?sort[rating]=desc'},{name: 'down', value: '?sort[rating]=asc'}]

    const [select,setSelect] = useState('')

    const url = 'http://127.0.0.1:8000/api/v1/reviews/';

    useEffect(() => {
        fetch(`${url}${select}`)
            .then((response) => response.json())
            .then((data) => {

                setReviews(Array.isArray(data) ? data : data.data || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке:", error);
                setReviews([]);
                setIsLoading(false);
            });
    }, [select]);




    const handleRemove  = async (review: Review) => {
        const data = await api.deleteData("reviews", review.id);
        if (data) {
            setReviews((prevReviews) => prevReviews.filter((p) => p.id !== review.id));
            showToast.success("Пост успішно видалено");
        }
    }

    // const handleUpdate  = async (review: Review) => {
    //     const updateReviw = {
    //         author: "John",
    //         text: "Good job",
    //         rating: 5,
    //     }
    // }

    // Функция для показа следующих 3 отзывовr
    const loadMoreReviews = () => {
        setVisibleReviews((prevVisible) => prevVisible + 3);
    };

    // Функция для скрытия последних 3 отзывов
    const hideReviews = () => {
        setVisibleReviews((prevVisible) => Math.max(prevVisible - 3, 0));
    };
    console.log(select)
    return (

        <div className="container mt-4">
            <h2 className="mb-3">Отзывы</h2>

            <select
                value={select}
                onChange={(e) => setSelect(e.target.value)}

            >
                <option value={''}>Відгуки</option>

                {option.map((filter) => (

                    <option key={filter.value} value={filter.value}>{filter.name} </option>

                ))}

            </select>

            <div className="row" style={{display: 'flex', flexWrap: 'wrap'}}>
                {isLoading ? (
                    <p>Загрузка...</p>
                ) : reviews.length > 0 ? (
                    reviews.slice(0, visibleReviews).map((review) => (
                        <div
                            key={review.id}
                            className="card"
                            style={{width: '18rem', marginRight: '15px', marginBottom: '15px'}}
                        >
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Автор: {review.author}</li>
                                <li className="list-group-item">Оцінка: {review.rating} ★</li>
                                <li className="list-group-item">Коментар: {review.text}</li>
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemove(review)}
                                >
                                    Видалити
                                </button>

                            </ul>

                        </div>
                    ))
                ) : (
                    <p>Отзывов пока нет.</p>
                )}
            </div>

            <div className="button-container">
                {reviews.length > visibleReviews && (
                    <button className="btn btn-primary" onClick={loadMoreReviews}>
                        ще
                    </button>
                )}

                {visibleReviews > 4 && (
                    <button className="btn btn-danger mt-2" onClick={hideReviews}>
                        приховати
                    </button>
                )}
                <Link href="/reviews/create">
                    <button style={{color: 'black'}}>додати коментар</button>
                </Link>

            </div>


        </div>
    );
};

export default ReviewsPage;
