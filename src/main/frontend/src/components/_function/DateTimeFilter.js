import React, { useState } from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

function DateTimeFilter() {
    // 기본값: 2023-01 ~ 2025-04, 00시~23시
    const [startYear, setStartYear] = useState(2023);
    const [startMonth, setStartMonth] = useState(1);
    const [endYear, setEndYear] = useState(2025);
    const [endMonth, setEndMonth] = useState(4);
    const [startHour, setStartHour] = useState(0);
    const [endHour, setEndHour] = useState(23);

    // 년/월 옵션 생성
    const years = [2023, 2024, 2025];
    const months = Array.from({length: 12}, (_, i) => i+1);
    const hours = Array.from({length: 24}, (_, i) => i);

    return (
        <FilterSection>
            <Label>날짜 범위</Label>
            <Row>
                <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}>
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}>
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
                <span>~</span>
                <select value={endYear} onChange={e => setEndYear(Number(e.target.value))}>
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))}>
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
            </Row>
            <Label>시간 범위</Label>
            <SliderWrapper>
                <RangeInput
                    type="range"
                    min={0}
                    max={23}
                    value={startHour}
                    onChange={e => setStartHour(Number(e.target.value))}
                />
                <span>{startHour}시</span>
                <span>~</span>
                <RangeInput
                    type="range"
                    min={0}
                    max={23}
                    value={endHour}
                    onChange={e => setEndHour(Number(e.target.value))}
                />
                <span>{endHour}시</span>
            </SliderWrapper>
        </FilterSection>
    );
}


const LocationFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f7f9fb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RangeInput = styled.input`
  width: 200px;
  accent-color: #222;
`;

function SearchFilter() {
    const [radius, setRadius] = useState(25);

    return (
        <LocationFilter>
            <Label>위치 기반 반경</Label>
            <SliderWrapper>
                <RangeInput
                    type="range"
                    min={0}
                    max={100}
                    value={radius}
                    onChange={e => setRadius(Number(e.target.value))}
                />
                <span>{radius} km</span>
            </SliderWrapper>
        </LocationFilter>
    );
}
export default LocationFilter();