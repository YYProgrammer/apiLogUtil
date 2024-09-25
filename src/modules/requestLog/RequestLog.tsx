import React, { useRef } from 'react';
import './RequestLog.css';
import { gptChat } from './RequestLogUtil';

interface RequestLogProps {
    state: {
        fileContent: string;
        analysisResult: string;
    };
    setState: React.Dispatch<React.SetStateAction<{
        fileContent: string;
        analysisResult: string;
    }>>;
}

const RequestLog: React.FC<RequestLogProps> = ({ state, setState }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            analyzeContent(content);
        };
        reader.readAsText(file);
    };

    const analyzeContent = async (content: string) => {
        const lines = content.split('\n');
        const sequenceCount: { [key: string]: number } = {};
        const allSequences: Set<string> = new Set();

        lines.forEach(line => {
            const match = line.match(/#(\d+)\s+(GET|POST)\s+(\S+)/);
            if (match) {
                const [, sequence] = match;
                allSequences.add(sequence);
                sequenceCount[sequence] = (sequenceCount[sequence] || 0) + 1;
            }
        });

        const uniqueSequences = Object.entries(sequenceCount)
            .filter(([_, count]) => count === 1)
            .map(([sequence, _]) => sequence);

        let result = '';

        // 先输出未返回的API请求结果
        if (uniqueSequences.length > 0) {
            result += "以下 API 请求尚未返回:\n" + uniqueSequences.map(seq => `- #${seq}`).join('\n') + '\n\n';
        } else {
            result += "所有 API 都已经返回\n\n";
        }

        // 立即更新状态，显示初步分析结果
        setState(prevState => ({
            ...prevState,
            analysisResult: result
        }));

        // 调用 API 获取更多分析结果
        // const q = await testApi1();
        const gptChatRes = await gptChat(content);
        result += "\n" + gptChatRes.choices[0].message.content;

        console.log("第二次更新状态");
        // 更新状态，包含API返回的结果
        setState(prevState => ({
            ...prevState,
            analysisResult: result
        }));
    };

    return (
        <div className="request-log-container">
            <div
                className="file-drop-area"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
            >
                <p>请拖入flutter-request.log</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>
            <div className="file-content-area">
                <textarea
                    value={state.fileContent}
                    readOnly
                    placeholder="文件内容将显示在这里"
                />
            </div>
            <div className="analysis-result-area">
                <h3>分析结果</h3>
                <textarea
                    value={state.analysisResult}
                    readOnly
                    placeholder="分析结果将显示在这里"
                />
            </div>
        </div>
    );
};

export default RequestLog;

export { };