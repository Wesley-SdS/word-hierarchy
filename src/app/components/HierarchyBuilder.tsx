
'use client';

import { useState } from 'react';

interface WordNode {
    name: string;
    children: WordNode[];
}

const HierarchyBuilder = () => {
    const [hierarchy, setHierarchy] = useState<WordNode[]>([]);
    const [newWord, setNewWord] = useState('');
    const [selectedParent, setSelectedParent] = useState<WordNode | null>(null);

    const addWord = () => {
        if (newWord.trim() === '') return;

        const newNode: WordNode = {
            name: newWord,
            children: [],
        };

        if (selectedParent) {
            const updatedHierarchy = addChildToParent(hierarchy, selectedParent.name, newNode);
            setHierarchy(updatedHierarchy);
        } else {
            setHierarchy([...hierarchy, newNode]);
        }

        setNewWord('');
        setSelectedParent(null);
    };

    const addChildToParent = (nodes: WordNode[], parentName: string, child: WordNode): WordNode[] => {
        return nodes.map((node) => {
            if (node.name === parentName) {
                return {
                    ...node,
                    children: [...node.children, child],
                };
            } else if (node.children.length > 0) {
                return {
                    ...node,
                    children: addChildToParent(node.children, parentName, child),
                };
            } else {
                return node;
            }
        });
    };

    const renderHierarchy = (nodes: WordNode[], level = 0) => {
        return (
            <ul>
                {nodes.map((node, index) => (
                    <li key={index} style={{ marginLeft: `${level * 20}px` }}>
                        <span
                            onClick={() => setSelectedParent(node)}
                            style={{ cursor: 'pointer', fontWeight: selectedParent?.name === node.name ? 'bold' : 'normal' }}
                        >
                            {node.name}
                        </span>
                        {renderHierarchy(node.children, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    const saveHierarchy = () => {
        const dataStr = JSON.stringify(hierarchy, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hierarchy.json';
        link.click();
    };

    return (
        <div>
            <h1>Create Word Hierarchy</h1>
            <input
                type="text"
                placeholder="Enter word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
            />
            <button onClick={addWord}>Add Word</button>

            {selectedParent && <p>Selected Parent: {selectedParent.name}</p>}

            <div>
                <h2>Hierarchy Preview:</h2>
                {renderHierarchy(hierarchy)}
            </div>

            <button onClick={saveHierarchy}>Save as JSON</button>
        </div>
    );
};

export default HierarchyBuilder;
