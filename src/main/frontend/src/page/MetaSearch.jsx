import { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import { useLocation } from "react-router-dom";

function MetaSearch() {
    const location = useLocation();
    const filter = location.state || {};

    const [result, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/search", {
                    params: filter
                });
                setResults(response.data);
            } catch (err) {
                setError("검색 결과를 불러오지 못했습니다.");
            }
        };
        fetchResults();
    }, [filter]);


    return (
        <ResultWrap>
            <h1>🔎 검색 결과</h1>
            <FilterCard>
                {/*{loading && <InfoText>로딩 중...</InfoText>}*/}
                {/*{error && <ErrorText>{error}</ErrorText>}*/}
                {/*{!loading && !error && results.length === 0 && (*/}
                {/*    <InfoText>검색 결과가 없습니다.</InfoText>*/}
                {/*)}*/}
                {/*{!loading && !error && results.map((item, idx) => (*/}
                {/*    <ResultItem key={idx}>*/}
                {/*        <Thumb src={`/uploads/${item.fileName}`} alt={item.fileName} />*/}
                {/*        <MetaInfo>*/}
                {/*            <div><strong>파일명:</strong> {item.fileName}</div>*/}
                {/*            <div><strong>위도:</strong> {item.latitude}</div>*/}
                {/*            <div><strong>경도:</strong> {item.longitude}</div>*/}
                {/*            <div><strong>촬영일시:</strong> {item.timestamp}</div>*/}
                {/*        </MetaInfo>*/}
                {/*    </ResultItem>*/}
                {/*))}*/}
            </FilterCard>
        </ResultWrap>
    );
}

const ResultWrap = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column; 
    align-items: center;
    margin-top: 30px;
`;

const FilterCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 32px 28px 24px 28px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.08), 0 1.5px 4px rgba(0,0,0,0.03);
    border: 1px solid #e0e7ef;
    max-width: 660px;
    width: 100%;
    margin-bottom: 50px;
`;

const ResultItem = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 14px 0;
    border-bottom: 1px solid #f1f4fa;
    &:last-child {
        border-bottom: none;
    }
`;

const Thumb = styled.img`
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid #e0e7ef;
    background: #fafbfc;
`;

const MetaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 1rem;
    color: #222;
`;

const InfoText = styled.div`
    color: #888;
    text-align: center;
    margin: 30px 0;
`;

const ErrorText = styled.div`
    color: #ff4d4f;
    text-align: center;
    margin: 30px 0;
    font-weight: bold;
`;
export default MetaSearch;
