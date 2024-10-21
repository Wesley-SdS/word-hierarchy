'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import HierarchyTree from './HierarchyTree';
import SaveButton from './SaveButton';

interface WordNode {
    name: string;
    children: WordNode[];
}

const HierarchyBuilder = () => {
    const [hierarchy, setHierarchy] = useState<WordNode[]>([]);
    const [newWord, setNewWord] = useState('');
    const [selectedParent, setSelectedParent] = useState<WordNode | null>(null);
    const [isEditingNode, setIsEditingNode] = useState<WordNode | null>(null);

    const addWord = () => {
        if (newWord.trim() === '') return;

        const newNode: WordNode = {
            name: newWord,
            children: [],
        };

        if (isEditingNode) {
            // Update existing node
            const updatedHierarchy = hierarchy.map(node => {
                if (node === isEditingNode) {
                    return { ...node, name: newWord };
                }
                return node;
            });
            setHierarchy(updatedHierarchy);
            setIsEditingNode(null);
        } else {
            // Add new node
            if (selectedParent) {
                const updatedHierarchy = addChildToParent(hierarchy, selectedParent.name, newNode);
                setHierarchy(updatedHierarchy);
            } else {
                setHierarchy([...hierarchy, newNode]);
            }
        }

        setNewWord('');
        setSelectedParent(null);
    };

    const removeWord = (nodeToRemove: WordNode, parentNode: WordNode | null) => {
        if (!parentNode) {
            setHierarchy(hierarchy.filter(node => node !== nodeToRemove));
        } else {
            const updatedHierarchy = removeNodeFromParent(hierarchy, parentNode.name, nodeToRemove);
            setHierarchy(updatedHierarchy);
        }
    };

    const editNode = (nodeToEdit: WordNode) => {
        setNewWord(nodeToEdit.name);
        setIsEditingNode(nodeToEdit);
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

    const removeNodeFromParent = (nodes: WordNode[], parentName: string, nodeToRemove: WordNode): WordNode[] => {
        return nodes.map((node) => {
            if (node.name === parentName) {
                return {
                    ...node,
                    children: node.children.filter(child => child !== nodeToRemove),
                };
            } else if (node.children.length > 0) {
                return {
                    ...node,
                    children: removeNodeFromParent(node.children, parentName, nodeToRemove),
                };
            } else {
                return node;
            }
        });
    };

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Create Word Hierarchy</h1>
            <input
                type="text"
                placeholder="Enter word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="border rounded px-2 py-1 mb-4 w-full"
            />
            <button onClick={addWord} className="flex items-center bg-green-500 text-white rounded px-4 py-2 mb-4">
                {isEditingNode ? 'Save Edit' : <><FaPlus className="mr-2" /> Add Word</>}
            </button>

            {selectedParent && <p className="mt-4">Selected Parent: <strong>{selectedParent.name}</strong></p>}

            <HierarchyTree
                hierarchy={hierarchy}
                setSelectedParent={setSelectedParent}
                editNode={editNode}
                removeWord={removeWord}
            />

            <SaveButton hierarchy={hierarchy} />
        </div>
    );
};

export default HierarchyBuilder;
