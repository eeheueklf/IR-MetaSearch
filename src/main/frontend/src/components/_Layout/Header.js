import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FiMic, FiImage, FiSend } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { FileContext } from '../../contexts/FileContext';


const Header = () => {
    const { setSelectedFile } = useContext(FileContext);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // 파일 선택
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            alert("10MB 이하의 이미지만 업로드할 수 있어요.");
            return;
        }
        setFile(file);
    };

    // FiSend 클릭 시 파일을 Context에 저장하고 Metadata 페이지로 이동
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
                        <FiImage style={{ cursor: "pointer" }} />
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
                <SendIcon onClick={handleSend}><FiSend /></SendIcon>
            </InputWrapper>
        </HeaderContainer>
    );
};


const HeaderContainer = styled.header`
    margin-top : 70px;
    display: flex;
    justify-content: center;
`;

const InputWrapper = styled.div`
    background: #f7f9fb;
    display: flex;
    align-items: center;
    border-radius: 14px;
    padding: 15px 15px;
    width: 100%;
    max-width: 900px;

    color: #f7f9fb; /* 초기 글자색 */
    border: 1px solid transparent;

    transition: border 0.3s ease-in-out, color 0.3s ease-in-out;

    &:hover {
        border: 1px solid #333333;
        color: #444444;
    }
`;
const FileName = styled.div`
    flex: 1;
    background: transparent;
    border: none;
    font-size : 0.8rem;
    color: #444;
    outline: none;
    padding: 0 10px;
`;


const Icon = styled.div`
    margin-right: 10px;
    font-size: 1rem;
    color: #555;
    cursor: pointer;
`;

const SearchInput = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    font-size : 0.8rem;
    color: #444;
    outline: none;
    padding: 0 10px;

    &::placeholder {
        color: #ccc;
    }
`;

const SendIcon = styled.div`
    margin-left: 10px;
    font-size: 1rem;
    color: #888;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
        color: #444;
    }
`;


export default Header;