import React from 'react';
import { Disclosure } from '@headlessui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface WordNode {
  name: string;
  children: WordNode[];
}

interface HierarchyTreeProps {
  nodes: WordNode[];
  selectedParent: WordNode | null;
  onNodeClick: (node: WordNode) => void;
  onEdit: (nodeToEdit: WordNode) => void;
  onRemove: (nodeToRemove: WordNode, parentNode: WordNode | null) => void;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  nodes,
  selectedParent,
  onNodeClick,
  onEdit,
  onRemove,
}) => {
  const renderNodes = (nodes: WordNode[], parent: WordNode | null = null) => {
    return nodes.map((node, index) => (
      <Disclosure key={index}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex w-full justify-between items-center py-2 text-lg font-semibold text-gray-800 hover:bg-gray-100 cursor-pointer ${selectedParent === node ? 'bg-blue-100' : ''
                }`}
              onClick={() => onNodeClick(node)}
            >
              <div className="flex items-center w-full gap-4">
                <span>{node.name}</span>
                <span>{open ? '-' : '+'}</span>
                <div className="flex space-x-2 ml-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(node);
                    }}
                    className="text-yellow-500 hover:text-yellow-600 text-sm px-2 py-1"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(node, parent);
                    }}
                    className="text-red-500 hover:text-red-600 text-sm px-2 py-1"
                  >
                    <FaTrash className="inline mr-1" /> Remove
                  </button>
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4">
              {node.children.length > 0 && (
                <ul>
                  {renderNodes(node.children, node)}
                </ul>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    ));
  };

  return <div className="border-t border-gray-300 mt-4">{renderNodes(nodes)}</div>;
};

export default HierarchyTree;
