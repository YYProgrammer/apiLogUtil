import React, { useRef, useState, useEffect } from 'react';
import './ApiLog.css';

interface ApiLogProps {
    state: {
        fileContent: string;
        apiNumber: string;
    };
    setState: React.Dispatch<React.SetStateAction<{
        fileContent: string;
        apiNumber: string;
    }>>;
}

const ApiLog: React.FC<ApiLogProps> = ({ state, setState }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [resultOutput, setResultOutput] = useState('');
    const [isFileLoaded, setIsFileLoaded] = useState(false);
    const [inputApiNumber, setInputApiNumber] = useState('');

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        readFile(file);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            readFile(file);
        }
    };

    const readFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setState(prevState => ({
                ...prevState,
                fileContent: content
            }));
            setIsFileLoaded(true);
        };
        reader.readAsText(file);
    };

    const handleApiNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputApiNumber(event.target.value);
    };

    const handleApiNumberSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setState(prevState => ({
                ...prevState,
                apiNumber: inputApiNumber
            }));
        }
    };

    function findAndDisplayContent(searchString: string, fileContent: string) {
        const lines = fileContent.split('\n');
        let count = 0;
        let foundIndex = -1;
        let content = '';

        // 找到第二个匹配的行
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(searchString)) {
                count++;
                if (count === 2) {
                    foundIndex = i;
                    break;
                }
            }
        }

        if (foundIndex !== -1 && foundIndex + 1 < lines.length) {
            // 从找到的位置开始，直到遇到连续的空行
            for (let i = foundIndex + 1; i < lines.length; i++) {
                if (lines[i].trim() === '' && lines[i + 1]?.trim() === '') {
                    break;
                }
                content += lines[i] + '\n';
            }

            content = content.trim();
            // 移除开头的"response:"（如果存在）
            if (content.toLowerCase().startsWith('response:')) {
                content = content.slice(9).trim();
            }
            // 移除结尾的 "[done]" 或 "[DONE]"（如果存在）
            content = content.replace(/\s*\[(done|DONE)\]\s*$/, '');
            return content;
        } else {
            return `未找到第二个匹配的 ${searchString} 或其下一行`;
        }
    }

    useEffect(() => {
        if (state.fileContent && state.apiNumber) {
            const content = state.fileContent;
            const apiNumber = state.apiNumber.startsWith('#') ? state.apiNumber : `#${state.apiNumber}`;

            const extractedContent = findAndDisplayContent(apiNumber, content);
            setResultOutput(extractedContent);
        }
    }, [state.fileContent, state.apiNumber]);

    const handleDownload = () => {
        const contents = resultOutput.split('\n'); // 使用双换行符分割内容
        contents.forEach((content, index) => {
            const element = document.createElement('a');
            const file = new Blob([content], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `${state.apiNumber}_${index + 1}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    };

    return (
        <div className="api-log-container">
            <div
                className="file-drop-area"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
            >
                <p>请拖入flutter-api.log</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>
            <input
                type="text"
                className="api-input"
                placeholder={isFileLoaded ? "文件已读取，请输入api序号并按回车" : "等待拖入文件"}
                value={inputApiNumber}
                onChange={handleApiNumberChange}
                onKeyPress={handleApiNumberSubmit}
            />
            <div className="result-output-area">
                <textarea
                    value={resultOutput}
                    readOnly
                    placeholder="API内容将显示在这里"
                />
            </div>
            <button className="download-button" onClick={handleDownload}>
                下载结果
            </button>
        </div>
    );
};

export default ApiLog;
