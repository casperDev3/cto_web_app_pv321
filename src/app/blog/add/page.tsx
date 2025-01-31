"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import { useRouter } from "next/router";
import api from "@/utils/api";
import { showToast } from 'react-next-toast';


export default function AddPost() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await api.postData("blog", {data});
            showToast.success("Пост успішно додано");
        } catch (error) {
            console.error("Error submitting post", error);
            showToast.error("Помилка при додаванні поста");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-xl font-bold mb-4">Додати пост</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Заголовок</label>
                    <input
                        {...register("title", { required: "Заголовок обов'язковий" })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Опис</label>
                    <textarea
                        {...register("content", { required: "Опис обов'язковий" })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Додається..." : "Додати"}
                </button>
            </form>
        </div>
    );
}
