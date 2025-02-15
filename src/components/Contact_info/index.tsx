import axios from 'axios';
import './Contact_info/style.css';

// Интерфейс для данных
interface GeneralInformation {
    id: number;
    address: string;
    number_phone: string;
    email: string;
    description: string;
    photo?: string;
}

// Компонент страницы
const GeneralInformationList = ({ data }: { data: GeneralInformation[] }) => {
    return (
         <>
        <div className="Main">
            <h4><div className="text_contact">Contact Information</div></h4>
            <ul>
                {data.map(item => (
                    <li key={item.id}>
                        <h2>Address: {item.address}</h2>
                        <p>Phone: {item.number_phone}</p>
                        <p>Email: {item.email}</p>
                        <p>Description: {item.description}</p>
                        {item.photo && (
                            <img src={item.photo} alt="Location" style={{ width: '200px', height: 'auto' }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
         </>
    );
};


export async function getServerSideProps() {
    try {
        const response = await axios.get<GeneralInformation[]>('http://127.0.0.1:8000/api/general-information/');
        return {
            props: {
                data: response.data,
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                data: [],
            },
        };
    }
}

export default GeneralInformationList;