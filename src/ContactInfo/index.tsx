import { GetServerSideProps } from "next";
import { getGeneralInfo, GeneralInfo } from "@/ContactInfo/utils";

interface Props {
    info: GeneralInfo[];
}

export default function Home({ info }: Props) {
    return (
        <div>
            <h1>General Information</h1>
            {info.map((item) => (
                <div key={item.id}>
                    <p><strong>{item.site_name}</strong> - {item.email}</p>
                    <p>Телефон: {item.phone}</p>
                    <p>Адрес: {item.address}</p>
                    <p>О сайте: {item.about}</p>
                </div>
            ))}
        </div>
    );
}

// Загружаем данные на сервере перед рендерингом страницы
export const getServerSideProps: GetServerSideProps = async () => {
    const info = await getGeneralInfo();
    return { props: { info } };
};
