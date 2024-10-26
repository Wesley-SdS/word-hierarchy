import React from 'react';
import { Disclosure } from '@headlessui/react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';

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
          <div className="relative ml-4 my-2">
            {/* Linha vertical conectando os itens */}
            {parent && (
              <div className={`absolute top-0 left-0 w-0.5 bg-gray-300 dark:bg-gray-500 ${index === nodes.length - 1 ? 'h-1/2' : 'h-full'}`}></div>
            )}
            
            <div className="flex items-center justify-between pl-4">
              {/* Linha horizontal conectando os itens */}
              {parent && (
                <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-300 dark:bg-gray-500"></div>
              )}
              <div
                className={`flex items-center gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-700 transition-colors duration-200 px-2 py-1 rounded ${selectedParent === node ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => onNodeClick(node)}
              >
                <span className="text-gray-900 dark:text-gray-200">{node.name}</span>
                <Disclosure.Button className="ml-auto text-gray-900 dark:text-gray-200">{open ? '-' : '+'}</Disclosure.Button>
              </div>

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="focus:outline-none text-gray-900 dark:text-gray-200">
                  <FaEllipsisV />
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(node);
                            }}
                            className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full`}
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(node, parent);
                            }}
                            className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full`}
                          >
                            <FaTrash className="mr-2" /> Remove
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            <Disclosure.Panel className="pl-6">
              {node.children.length > 0 && (
                <ul className="pl-4">
                  {renderNodes(node.children, node)}
                </ul>
              )}
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    ));
  };

  return <div className="border-t border-gray-300 dark:border-gray-500 mt-4">{renderNodes(nodes)}</div>;
};

export default HierarchyTree;
