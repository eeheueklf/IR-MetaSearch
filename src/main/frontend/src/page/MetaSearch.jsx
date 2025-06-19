import { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import { useLocation } from "react-router-dom";

function MetaSearch() {
    const location = useLocation();

    const [result, setResults] = useState(null);
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);

    const fileName = location.state?.fileName;
    const radius = location.state?.radius;
    const searchType = location.state?.searchType;
    const unit = location.state?.unit;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/api/search", {
                    params: {
                        fileName,
                        radius,
                        searchType,
                        unit
                    }
                });
                console.log("Response Data: ", response.data);
                setResults(response.data);
                setLoading(false);
            } catch (err) {
                setError("검색 결과를 불러오지 못했습니다.");
                setLoading(false);
            }
        };
        fetchResults();
    }, [fileName, radius, searchType, unit]);



    return (
        <ResultWrap>
            <h1>🔎 총 {result ? result.length : 0}개의 검색 결과 </h1>
            <FilterCard>
                {loading && <InfoText>로딩 중...</InfoText>}
                {!loading && error && <ErrorText>{error}</ErrorText>}
                {!loading && !error && result?.length === 0 && (
                    <InfoText>검색 결과가 없습니다.</InfoText>
                )}
                {!loading && !error &&
                    <div>
                    {result.map((image) => (
                        <ImagePair key={image.id}>
                            {/*<span>{image.timestamp}</span>*/}
                            <img
                                src={`http://localhost:8080/upload/${image.fileName}`}
                                alt={image.fileName}
                                style={{width: "200px", height: "200px", objectFit: "cover"}}
                            />
                            <MetaInfo>
                                <h3>📰 추출된 EXIF 메타데이터</h3>
                                <div><b>파일명:</b> {image.fileName}</div>
                                <div><b>촬영 시각:</b> {image.timestamp}</div>
                                <div><b>위도:</b> {image.latitude}</div>
                                <div><b>경도:</b> {image.longitude}</div>
                            </MetaInfo>
                        </ImagePair>
                    ))}
                    </div>
                }
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

const ImagePair =styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 14px 0;
    border-bottom: 1px solid #f1f4fa;
    &:last-child {
        border-bottom: none;
    }
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
