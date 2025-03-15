"use client";
import React, {useState} from 'react';
import {showToast} from "react-next-toast";
import {baseUrl} from "@/constants";

const Page = () => {
    const [review, setReview] = useState({author: '', text: '', rating: 1});
   console.log("review",review)

    async function createReview() {
        if (!review.author || !review.text || !review.rating) {
            alert("Будь ласка, заповніть усі поля!");
            return;
        }
        try {
            // const data = await api.postData('reviews', {...review})
            const data = await postReview();
            console.log("Отправляемый JSON:", JSON.stringify({ data: review }, null, 2));

            console.log("data",data)
            console.log("review",review)


            showToast.success("додано коментар");
            setReview({author: '', text: '', rating: 1});
        } catch (error) {
            showToast.success("Error");
            console.log(error);
        }
    }

async function postReview () {
       const response = await fetch(`${baseUrl}/reviews/`,{
           method : "POST",
           headers: {
               "Content-Type" : "application/json",
           },
           body: JSON.stringify(review),
       });
       return await response.json();
}


    return (
        <div>
            <label htmlFor="name">Залишити коментар</label>
            <ul>Імʼя
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={review.author}
                    onChange={(e) => setReview({...review, author: e.target.value})}
                />
            </ul>
            <ul>Оцінка
                <input
                    type="number"
                    id="name"
                    name="name"
                    value={review.rating}
                    min={1}
                    max={5}
                    onChange={(e) => setReview({...review, rating:Number( e.target.value)})}
                />

            </ul>
            <ul>Коментар
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={review.text}
                    onChange={(e) => setReview({...review, text: e.target.value})}
                />

            </ul>
            <button onClick={createReview}>
                коментувати
            </button>
        </div>
    );
};

export default Page;