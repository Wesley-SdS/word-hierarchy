import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { FaEllipsisV, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface WordNode {
  name: string;
  children: WordNode[];
  parent?: WordNode | null;
}

interface HierarchyTreeProps {
  nodes: WordNode[];
  selectedParent: WordNode | null;
  onNodeClick: (node: WordNode) => void;
  onRemove: (nodeToRemove: WordNode) => void;
}

// Função para obter o caminho completo da categoria
const getCategoryPath = (node: WordNode | null): string => {
  if (!node) return '';
  let path = node.name;
  let currentNode = node.parent;
  while (currentNode) {
    path = `${currentNode.name}.${path}`;
    currentNode = currentNode.parent;
  }
  console.log('Category path:', path); // Verificar o caminho da categoria gerado
  return path;
};

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  nodes,
  selectedParent,
  onNodeClick,
  onRemove,
}) => {
  const [editingNode, setEditingNode] = useState<WordNode | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [nodeToRemove, setNodeToRemove] = useState<WordNode | null>(null);



  const openRemoveDialog = (node: WordNode) => {
    setNodeToRemove(node); // Define o nó que será removido
    setIsDialogOpen(true); // Abre o diálogo
  };






  // Função para confirmar a remoção
  const confirmRemove = () => {
    if (nodeToRemove) {
      onRemove(nodeToRemove);
      setIsDialogOpen(false);
    }
  };

  // Função para ativar a edição
  const handleEdit = (node: WordNode) => {
    console.log('Editing node:', node.name); // Verificar qual nó está sendo editado
    setEditingNode(node);
    setEditedName(node.name); // Preenche com o nome original
  };

  // Função para salvar a edição
  const handleSaveEdit = async (node: WordNode) => {
    if (!editedName.trim()) {
      toast.error('Please enter a valid word.');
      return;
    }

    const categoryPath = getCategoryPath(selectedParent) || '';
    console.log('Category path being sent:', categoryPath);
    console.log('Old word:', node.name);
    console.log('New word:', editedName);

    try {
      const response = await fetch('http://localhost:3001/words/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldWord: node.name, newWord: editedName, category: categoryPath }),
      });

      console.log('Server response status:', response.status);

      // Verifique o status da resposta para garantir que seja 2xx
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const data = await response.json(); // Verifique se a resposta está em JSON
          console.log('Server response data:', data);
          node.name = editedName; // Atualiza o nome localmente
          setEditingNode(null); // Encerra o modo de edição
          toast.success('Word edited successfully!');
        } else {
          // Verifique se o tipo de conteúdo não é JSON, pode ser HTML
          const responseText = await response.text();
          console.error('Unexpected response format:', responseText);
          toast.error('Failed to edit word. Server returned an invalid response.');
        }
      } else {
        // Erro com o status da resposta
        const responseText = await response.text();
        console.error('Server returned an error:', responseText);
        toast.error('Failed to edit word. Server error occurred.');
      }
    } catch (error) {
      console.error('Error during edit:', error);
      toast.error('An error occurred while editing the word.');
    }
  };



  // Renderização recursiva dos nós da árvore
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

              {editingNode === node ? (
                <>
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-900"
                  />
                  <Button onClick={() => handleSaveEdit(node)} className="ml-2 bg-blue-600 text-white hover:bg-blue-700">
                    <FaSave className="mr-2" /> Save
                  </Button>
                </>
              ) : (
                <div
                  className={`flex items-center gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-700 transition-colors duration-200 px-2 py-1 rounded ${selectedParent === node ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => onNodeClick(node)}
                >
                  <span className="text-gray-900 dark:text-gray-200">{node.name}</span>
                  <Disclosure.Button className="ml-auto text-gray-900 dark:text-gray-200">{open ? '-' : '+'}</Disclosure.Button>
                </div>
              )}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Removal</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove this word? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" onClick={confirmRemove}>
                      Confirm
                    </Button>
                    <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>

                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                            onClick={() => handleEdit(node)}
                            className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full`}
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => openRemoveDialog(node)} // Abre o diálogo em vez de remover diretamente
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
