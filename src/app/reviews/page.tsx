"use client";
import './ReviewsPage.css';
import React, { useEffect, useState } from "react";

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

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/v1/reviews/")
            .then((response) => response.json())
            .then((data) => {
                console.log("Пришли данные:", data);
                setReviews(Array.isArray(data) ? data : data.data || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке:", error);
                setReviews([]);
                setIsLoading(false);
            });
    }, []);

    // Функция для показа следующих 3 отзывов
    const loadMoreReviews = () => {
        setVisibleReviews((prevVisible) => prevVisible + 3);
    };

    // Функция для скрытия последних 3 отзывов
    const hideReviews = () => {
        setVisibleReviews((prevVisible) => Math.max(prevVisible - 3, 0));
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Отзывы</h2>
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {isLoading ? (
                    <p>Загрузка...</p>
                ) : reviews.length > 0 ? (
                    reviews.slice(0, visibleReviews).map((review) => (
                        <div
                            key={review.id}
                            className="card"
                            style={{ width: '18rem', marginRight: '15px', marginBottom: '15px' }}
                        >
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Автор: {review.author}</li>
                                <li className="list-group-item">Оцінка: {review.rating} ★</li>
                                <li className="list-group-item">Коментар: {review.text}</li>
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
            </div>
        </div>
    );
};

export default ReviewsPage;
