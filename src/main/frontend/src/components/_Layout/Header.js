import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FiImage, FiSend } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { FileContext } from '../../contexts/FileContext';

const Header = () => {
    const { setSelectedFile } = useContext(FileContext);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            alert("10MB 이하의 이미지만 업로드할 수 있어요.");
            return;
        }
        setFile(file);
    };

    const handleSend = () => {
        if (!file) {
            alert("이미지 파일을 선택하세요.");
            return;
        }
        setSelectedFile(file);
        navigate("/");
    };

    return (
        <HeaderContainer>
            <InputWrapper>
                <Icon>
                    <label htmlFor="file-upload">
                        <FiImage />
                        <span>이미지 불러오기</span>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </Icon>
                <FileName>
                    {file ? file.name : "이미지 파일을 선택하세요"}
                </FileName>
                <SendIcon
                    onClick={handleSend}
                    active={!!file}
                    title={file ? "업로드" : "이미지 파일을 선택하세요"}
                >
                    <FiSend />
                </SendIcon>
            </InputWrapper>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    margin-top: 70px;
    display: flex;
    justify-content: center;
`;

const InputWrapper = styled.div`
    background: #fff;
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 11px 34px;
    width: 100%;
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.08), 0 1.5px 4px rgba(0,0,0,0.03);

    border: 1.5px solid #e0e7ef;
    gap: 16px;
`;

const Icon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 12px;
    font-size: 1.3rem;
    color: var(--point_color);
    cursor: pointer;

    label {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: 7px;
        font-weight: 500;
        font-size: 1rem;
        color: var(--point_color);
        transition: color 0.2s;

        &:hover {
            color: #000;
        }
    }
`;

const FileName = styled.div`
    flex: 1;
    font-size: 1rem;
    color: #222;
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SendIcon = styled.div`
    margin-top: 5px;
    font-size: 1.2rem;
    color : var(--point_color);
    cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

    &:hover {
        color: ${({ active }) => (active ? '#000' : '#bbb')};
    }
`;

export default Header;
