import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useNavigate} from "react-router-dom";

const MetaSearchFilter = ({ onFilterChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [radius, setRadius] = useState(10); // 기본 반경 10km

    const navigate = useNavigate();
    const handleStartDateChange = (date) => {
        setStartDate(date);
        onFilterChange({ startDate: date, endDate, radius });
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        onFilterChange({ startDate, endDate: date, radius });
    };

    const handleRadiusChange = (e) => {
        const value = Number(e.target.value);
        setRadius(value);
        onFilterChange?.({ startDate, endDate, radius });

    };

    return (
        <div>
            <ResultWrap>
                <h2>검색 필터 설정하기</h2>
                <FilterContainer>
                    <Section>
                        <Label>날짜 범위 선택</Label>
                        <DatePickers>
                            <DatePicker
                                selected={startDate}
                                onChange={handleStartDateChange}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="시작 날짜"
                                dateFormat="yyyy-MM-dd"
                                isClearable
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={handleEndDateChange}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="종료 날짜"
                                dateFormat="yyyy-MM-dd"
                                isClearable
                            />
                        </DatePickers>
                    </Section>

                    <Section>
                        <Label>위치 기반 반경 (km)</Label>
                        <RadiusInput
                            type="range"
                            min={1}
                            max={100}
                            value={radius}
                            onChange={handleRadiusChange}
                        />
                        <RadiusValue>{radius} km</RadiusValue>
                    </Section>
                </FilterContainer>
            </ResultWrap>
            <ButtonContainer>
                <FloatingButton
                    onClick={() => navigate("/metasearch")}
                >
                    📸 + 이미지 검색하기
                </FloatingButton>
            </ButtonContainer>
        </div>
    );
};

const ResultWrap = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column; 
    overflow-y: auto;
    position: relative;
    margin-top:20px;
`;

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 400px;
    overflow-y: auto;
    margin-top:20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const DatePickers = styled.div`
  display: flex;
  gap: 10px;
`;

const RadiusInput = styled.input`
  width: 100%;
`;

const RadiusValue = styled.div`
  margin-top: 4px;
  font-size: 0.9rem;
  color: #555;
`;


const ButtonContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column; 
    gap: 20px;
    padding: 20px;
    overflow-y: auto;
    position: relative; 
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
