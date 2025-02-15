import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Contact_info/style.css'
const GeneralInformationList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/general-information/');
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    return (
        <div class="Main">
            <h4><div class="text_contact">Contact Information</div></h4>
            <ul>
                {data.map(item => (
                    <li key={item.id}>  {/* Используем id как ключ */}
                        <h2>Address: {item.address}</h2>
                        <p>Phone: {item.number_phone}</p>
                        <p>Email: {item.email}</p>
                        <p>Description: {item.description}</p>
                        {item.photo && (  // Проверяем, есть ли фото
                            <img src={item.photo} alt="Location" style={{ width: '200px', height: 'auto' }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GeneralInformationList;