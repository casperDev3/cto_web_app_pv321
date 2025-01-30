'use client';
import {useParams} from "next/navigation";

const SingleBlogPage = async () => {
    // Get the blog ID from the URL
    const {id} = useParams();
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const blog = await res.json()
    return (
        <div>
            <h1>Title: {blog.title}</h1>
            <p>Body: {blog.body}</p>
        </div>
    );
};

export default SingleBlogPage;


