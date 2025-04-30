import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

// 빠른 단위 선택 버튼용 옵션
const UNIT_OPTIONS = [
    { label: '연도', value: 'year' },
    { label: '월', value: 'month' },
    { label: '일', value: 'day' },
    { label: '시간', value: 'time' },
];

// 빠른 반경 선택 버튼용 옵션
const QUICK_RADIUS = [
    { label: '근처(1km)', value: 1 },
    { label: '마을(5km)', value: 5 },
    { label: '시 단위(20km)', value: 20 },
    { label: '도 단위(50km)', value: 50 },
    { label: '최대', value: 100 }
];

// 빠른 기준(위치/시간) 선택 버튼용 옵션
const SEARCH_TYPE_OPTIONS = [
    { label: '위치', value: 'location' },
    { label: '시간', value: 'time' }
];

// 버튼형 UnitSelector
const UnitSelector = ({ onChange }) => {
    const [unit, setUnit] = useState('');
    const handleClick = (value) => {
        setUnit(value);
        if (onChange) onChange(value);
    };
    return (
        <QuickBtnWrap>
            {UNIT_OPTIONS.map(opt => (
                <QuickBtn
                    key={opt.value}
                    active={unit === opt.value}
                    onClick={() => handleClick(opt.value)}
                >
                    {opt.label}
                </QuickBtn>
            ))}
        </QuickBtnWrap>
    );
};

// 버튼형 SearchTypeSelector
const SearchTypeSelector = ({ value, onChange }) => (
    <QuickBtnWrap>
        {SEARCH_TYPE_OPTIONS.map(opt => (
            <QuickBtn
                key={opt.value}
                active={value === opt.value}
                onClick={() => onChange(opt.value)}
            >
                {opt.label}
            </QuickBtn>
        ))}
    </QuickBtnWrap>
);

const MetaSearchFilter = ({ onFilterChange }) => {
    const [searchType, setSearchType] = useState('');
    const [radius, setRadius] = useState(10);
    const [unit, setUnit] = useState('');
    const navigate = useNavigate();

    // 검색 기준 변경
    const handleSearchTypeChange = (selectedType) => {
        setSearchType(selectedType);
        setRadius(10);
        setUnit('');
        if (onFilterChange) onFilterChange({ searchType: selectedType });
    };

    // 반경 변경
    const handleRadiusChange = (e) => {
        const value = Number(e.target.value);
        setRadius(value);
        if (onFilterChange) onFilterChange({ searchType, radius: value });
    };

    // 빠른 반경 선택
    const handleQuickRadius = (value) => {
        setRadius(value);
        if (onFilterChange) onFilterChange({ searchType, radius: value });
    };

    // 단위 변경
    const handleUnitChange = (selectedUnit) => {
        setUnit(selectedUnit);
        if (onFilterChange) onFilterChange({ searchType, unit: selectedUnit });
    };

    return (
        <div>
            <ResultWrap>
                <h1>🎛️ 검색 필터 설정하기</h1>
                <FilterCard>
                    <Section>
                        <Label>🔎 검색 기준 선택</Label>
                        <SearchTypeSelector value={searchType} onChange={handleSearchTypeChange} />
                    </Section>

                    {searchType === 'location' && (
                        <Section>
                            <Label>🗺️ 위치 기반 반경</Label>
                            <QuickBtnWrap>
                                {QUICK_RADIUS.map(opt => (
                                    <QuickBtn
                                        key={opt.value}
                                        active={radius === opt.value}
                                        onClick={() => handleQuickRadius(opt.value)}
                                    >
                                        {opt.label}
                                    </QuickBtn>
                                ))}
                            </QuickBtnWrap>
                            <RadiusRow>
                                <RadiusInput
                                    type="range"
                                    min={1}
                                    max={100}
                                    value={radius}
                                    onChange={handleRadiusChange}
                                    accentColor="#ff5a5f"
                                />
                                <RadiusValue>{radius} km</RadiusValue>
                            </RadiusRow>
                        </Section>
                    )}

                    {searchType === 'time' && (
                        <Section>
                            <Label>📅 검색할 시간 범위</Label>
                            <UnitSelector onChange={handleUnitChange} />
                        </Section>
                    )}
                </FilterCard>
            </ResultWrap>
            <ButtonContainer>
                <FloatingButton onClick={() => navigate("/metasearch", {state : {searchType, radius, unit}})}>
                    📸 + 이미지 검색하기
                </FloatingButton>
            </ButtonContainer>
        </div>
    );
};

// 스타일 정의
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
    gap: 24px;
    padding: 32px 28px 24px 28px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.08), 0 1.5px 4px rgba(0,0,0,0.03);
    border: 1px solid #e0e7ef;
    max-width: 660px;
    width: 100%;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
    font-size: 1.08rem;
    display: flex;
    align-items: center;
`;

const QuickBtnWrap = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
`;

const QuickBtn = styled.button`
    background: ${({ active }) => (active ? 'var(--point_color)' : '#f1f4fa')};
    color: ${({ active }) => (active ? 'white' : '#333')};
    border: none;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: var(--point_color);
        color: white;
    }
`;

const RadiusRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const RadiusInput = styled.input`
    width: 79%;
    accent-color: var(--point_color);
`;

const RadiusValue = styled.div`
    min-width: 50px;
    font-size: 1rem;
    color: var(--point_color);
    font-weight: 700;
    text-align: right;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const FloatingButton = styled.button`
  align-self: flex-end;
  margin: 50px 0;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgb(55, 58, 61);
  }
`;

export default MetaSearchFilter;
