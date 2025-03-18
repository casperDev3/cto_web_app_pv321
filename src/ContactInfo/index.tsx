import React, { useEffect, useState } from 'react';
import '../ContactInfo/styles/style.css';

//  интерфейс для данных
interface GeneralInfo {
    id: number;
    site_name: string;
    email: string;
    phone: string;
    address: string;
    about: string;
}

const General_info: React.FC = () => {
    const [data, setData] = useState<GeneralInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/general-info/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: GeneralInfo[]) => {
                setData(data);
                setLoading(false);
            })
            .catch((error: Error) => {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="Main_Container">
            <div id="data-container">
                {data.map(item => (
                    <div key={item.id}>
                        <br />
                        <p><strong>Название сайта:</strong> <span id="siteName">{item.site_name}</span></p>
                        <p><strong>Email:</strong> <span id="email">{item.email}</span></p>
                        <p><strong>Телефон:</strong> <span id="phone">{item.phone}</span></p>
                        <p><strong>Адрес:</strong> <span id="address">{item.address}</span></p>
                        <p><strong>О нас:</strong> <span id="about">{item.about}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default General_info;
