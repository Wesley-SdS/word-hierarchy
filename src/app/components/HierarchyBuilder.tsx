'use client';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SearchBar from './SearchBar';
import SaveButton from './SaveButton';
import HierarchyTree from './HierarchyTree';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WordNode {
    name: string;
    children: WordNode[];
}

const HierarchyBuilder: React.FC = () => {
    const [hierarchy, setHierarchy] = useState<WordNode[]>([]);
    const [newWord, setNewWord] = useState('');
    const [selectedParent, setSelectedParent] = useState<WordNode | null>(null);
    const [isEditingNode, setIsEditingNode] = useState<WordNode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeToRemove, setNodeToRemove] = useState<WordNode | null>(null); 
    const addWord = () => {
        if (!newWord.trim()) {
            toast.error('Please enter a word.');
            return;
        }

        if (newWord.length > 30) {
            toast.error('Word must not exceed 30 characters.');
            return;
        }

        const exists = hierarchy.some(node => node.name.toLowerCase() === newWord.toLowerCase());
        if (exists) {
            toast.error('This word already exists in the hierarchy.');
            return;
        }

        const newNode: WordNode = { name: newWord, children: [] };
        if (isEditingNode) {
            if (isEditingNode.name.toLowerCase() === newWord.toLowerCase()) {
                toast.error('No changes detected. Please enter a different word.');
                return;
            }

            const updatedHierarchy = updateHierarchyForEdit(hierarchy, isEditingNode, newNode);
            setHierarchy(updatedHierarchy);
            toast.success('Word edited successfully!');
            setIsEditingNode(null);
        } else {
            if (selectedParent) {
                const updatedHierarchy = addChildToParent(hierarchy, selectedParent.name, newNode);
                setHierarchy(updatedHierarchy);
                toast.success('Word added successfully as a child!');
            } else {
                setHierarchy([...hierarchy, newNode]);
                toast.success('Word added successfully at the top level!');
            }
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
            }
            return node;
        });
    };

    const updateHierarchyForEdit = (nodes: WordNode[], nodeToEdit: WordNode, newNode: WordNode): WordNode[] => {
        return nodes.map(node => {
            if (node.name === nodeToEdit.name) {
                return { ...node, name: newNode.name };
            } else if (node.children.length > 0) {
                return { ...node, children: updateHierarchyForEdit(node.children, nodeToEdit, newNode) };
            }
            return node;
        });
    };

    const confirmRemoval = () => {
        if (nodeToRemove) {
            setHierarchy(hierarchy.filter(node => node !== nodeToRemove));
            toast.success('Word removed successfully!');
            setNodeToRemove(null); 
        }
    };

    const handleRemoveWord = (node: WordNode) => {
        setNodeToRemove(node); 
    };

    const editNode = (nodeToEdit: WordNode) => {
        setNewWord(nodeToEdit.name);
        setIsEditingNode(nodeToEdit);
    };

    const handleNodeClick = (node: WordNode) => {
        if (selectedParent === node) {
            setSelectedParent(null);
        } else {
            setSelectedParent(node);
            toast.info(`Selected Parent: ${node.name}`);
        }
    };

    const filteredHierarchy = hierarchy.filter(node => node.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Create Word Hierarchy</h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex mb-4">
                <Input
                    type="text"
                    placeholder="Enter word"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addWord()}
                    className="border border-gray-300 rounded px-4 py-2 flex-grow mr-2"
                />
                <Button onClick={addWord} className="flex items-center bg-violet-600 text-white rounded px-4 py-2 hover:bg-violet-700 transition-colors">
                    {isEditingNode ? 'Save Edit' : <><FaPlus className="mr-2" /> Add</>}
                </Button>
            </div>
            {selectedParent && <p className="mt-4 text-lg text-gray-600">Selected Parent: <strong>{selectedParent.name}</strong></p>}
            <HierarchyTree
                nodes={filteredHierarchy}
                onNodeClick={handleNodeClick}
                onEdit={editNode}
                onRemove={handleRemoveWord} 
                selectedParent={selectedParent}
            />
            <SaveButton hierarchy={hierarchy} />

        
            <Dialog open={!!nodeToRemove} onOpenChange={() => setNodeToRemove(null)}>
                <DialogTrigger asChild>
                    <button className="hidden" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to remove this word?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Please confirm if you want to proceed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button
                            onClick={confirmRemoval}
                            className="bg-red-500 text-white rounded px-4 py-2 mr-2 hover:bg-red-600 transition-colors"
                        >
                            Confirm
                        </Button>
                        <Button onClick={() => setNodeToRemove(null)} className="bg-white text-black border-2 border-gray-100 rounded px-4 py-2 hover:bg-gray-100 transition-colors">
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HierarchyBuilder;
