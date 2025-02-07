"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/utils/api";
import { showToast } from 'react-next-toast';

interface TeamMemberFormData {
    name: string;
    position: string;
    description: string;
    photo: string;
    age: number;
    rating: number;
}

export default function AddTeammate() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TeamMemberFormData>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: TeamMemberFormData) => {
        setLoading(true);
        try {
            const response = await api.postData("team", { data });
            showToast.success("Члена команди успішно додано");
        } catch (error) {
            console.error("Error submitting teammate", error);
            showToast.error("Помилка при додаванні члена команди");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-xl font-bold mb-4">Додати члена команди</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Ім'я */}
                <div>
                    <label className="block text-sm font-medium">Ім'я</label>
                    <input
                        {...register("name", { required: "Ім'я обов'язкове" })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Посада */}
                <div>
                    <label className="block text-sm font-medium">Посада</label>
                    <input
                        {...register("position", { required: "Посада обов'язкова" })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
                </div>

                {/* Опис */}
                <div>
                    <label className="block text-sm font-medium">Опис</label>
                    <textarea
                        {...register("description", { required: "Опис обов'язковий" })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                {/* Фото */}
                <div>
                    <label className="block text-sm font-medium">Фото (URL)</label>
                    <input
                        {...register("photo", { required: "Фото обов'язкове" })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
                </div>

                {/* Вік */}
                <div>
                    <label className="block text-sm font-medium">Вік</label>
                    <input
                        {...register("age", { required: "Вік обов'язковий" })}
                        type="number"
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                </div>

                {/* Рейтинг */}
                <div>
                    <label className="block text-sm font-medium">Рейтинг</label>
                    <input
                        {...register("rating", { required: "Рейтинг обов'язковий" })}
                        type="number"
                        min={1}
                        max={5}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
                </div>

                {/* Кнопка */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Додається..." : "Додати члена команди"}
                </button>
            </form>
        </div>
    );
}
