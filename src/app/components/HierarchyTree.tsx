import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';

interface WordNode {
    name: string;
    children: WordNode[];
}

interface HierarchyTreeProps {
    hierarchy: WordNode[];
    setSelectedParent: (node: WordNode) => void;
    editNode: (node: WordNode) => void;
    removeWord: (node: WordNode, parentNode: WordNode | null) => void;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
    hierarchy,
    setSelectedParent,
    editNode,
    removeWord,
}) => {
    const [selectedParent, setSelectedParentState] = useState<WordNode | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState<WordNode | null>(null);
    const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (node: WordNode) => {
        clearTimeout(dropdownTimeout!);
        setDropdownVisible(node);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setDropdownVisible(null);
        }, 200); // Delay de 200ms
        setDropdownTimeout(timeout);
    };

    const renderHierarchy = (nodes: WordNode[], parentNode: WordNode | null = null) => {
        return (
            <ul className="list-disc pl-5 mb-4">
                {nodes.map((node, index) => (
                    <li key={index} className="mb-2 border-b pb-2">
                        <div className="flex items-center justify-between">
                            <span
                                onClick={() => {
                                    setSelectedParent(node);
                                    setSelectedParentState(node); // Atualiza o estado do parent selecionado
                                }}
                                className={`cursor-pointer ${selectedParent?.name === node.name ? 'font-bold' : 'normal'}`}
                            >
                                {node.name}
                            </span>
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(node)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="focus:outline-none">
                                    <FaEllipsisV className="text-gray-500" />
                                </button>
                                {dropdownVisible === node && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => editNode(node)}
                                            className="flex items-center px-4 py-2 text-yellow-700 hover:bg-yellow-100 w-full text-left"
                                        >
                                            <FaEdit className="mr-2" /> Edit
                                        </button>
                                        <button
                                            onClick={() => removeWord(node, parentNode)}
                                            className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 w-full text-left"
                                        >
                                            <FaTrash className="mr-2" /> Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {renderHierarchy(node.children, node)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Hierarchy Preview:</h2>
            {renderHierarchy(hierarchy)}
        </div>
    );
};

export default HierarchyTree;
