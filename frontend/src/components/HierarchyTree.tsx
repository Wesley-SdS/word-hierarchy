import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { FaEllipsisV, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
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
  onNodeClick: (node: WordNode | null) => void;
  selectedParent: WordNode | null;
  onRemove: (nodeToRemove: WordNode) => void;
}



const getCategoryPath = (node: WordNode | null): string => {
  if (!node) return '';
  let path = node.name;
  let currentNode = node.parent;
  while (currentNode) {
    path = `${currentNode.name}.${path}`;
    currentNode = currentNode.parent;
  }
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
    setNodeToRemove(node); 
    setIsDialogOpen(true); 
  };

  const confirmRemove = () => {
    if (nodeToRemove) {
      onRemove(nodeToRemove);
      setIsDialogOpen(false);
    }
  };


  const handleEdit = (node: WordNode) => {
    setEditingNode(node);
    setEditedName(node.name); 
  };

  const handleSaveEdit = async (node: WordNode) => {
    if (!editedName.trim()) {
      toast.error('Por favor, insira uma palavra válida.');
      return;
    }

    const categoryPath = getCategoryPath(selectedParent) || '';

    try {
      const response = await fetch('http://localhost:3001/words/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldWord: node.name,
          newWord: editedName,
          category: categoryPath
        }),
      });

      if (response.ok) {
        node.name = editedName; 
        setEditingNode(null);  
        toast.success('Palavra editada com sucesso!');
      } else {
        try {
          const responseText = await response.json();
          console.error('Erro do servidor:', responseText);

          if (responseText.error === 'A palavra já existe com o novo nome.') {
            toast.error('Essa palavra já existe na categoria.');
          } else if (responseText.error === 'A palavra não existe na categoria.') {
            toast.error('A palavra não foi encontrada na categoria.');
          } else {
            toast.error('Erro ao editar a palavra. Ocorreu um erro no servidor.');
          }
        } catch (error) {
          console.error('Falha ao interpretar a resposta do servidor:', error);
          toast.error('Erro ao editar a palavra. O servidor retornou uma resposta inválida.');
        }
      }
    } catch  {
      toast.error('Ocorreu um erro ao editar a palavra.');
    }
  };

  const renderNodes = (nodes: WordNode[], parent: WordNode | null = null) => {
    return nodes.map((node, index) => (
      <Disclosure key={index}>
        {({ open }) => (
          <div className="relative ml-4 my-2">
            
            {parent && (
              <div className={`absolute top-0 left-0 w-0.5 bg-gray-300 dark:bg-gray-500 ${index === nodes.length - 1 ? 'h-1/2' : 'h-full'}`}></div>
            )}

            <div className="flex items-center justify-between pl-6">
              
              {parent && (
                <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-300 dark:bg-gray-500"></div>
              )}

              {editingNode === node ? (
              <div className='flex flex-col md:flex-row w-full justify-between mr-4'>
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-900 mb-2 md:mb-0 md:mr-4"
              />
              <Button 
              aria-label='Editar'
                onClick={() => handleSaveEdit(node)} 
                className="mb-2 md:mb-0 md:mx-4 bg-violet-600 text-white hover:bg-violet-700"
              >
                <FaSave className="mr-2" /> Editar
              </Button>
              <Button 
              aria-label='cancelar'
                onClick={() => setEditingNode(null)} 
                className="border-2 bg-white text-gray-800 hover:bg-violet-200"
              >
                <FaTimes /> Cancelar
              </Button>
            </div>
            
              ) : (
                <div
                  className={`flex items-center gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-indigo-600 transition-colors duration-200 px-2 py-1 rounded ${selectedParent === node ? 'bg-indigo-300 text-white' : ''}`}
                  onClick={() => onNodeClick(node)}
                >
                  <span className="text-lg text-gray-900  dark:text-gray-800 ">{node.name}</span>
                  <Disclosure.Button aria-label='- ou +' className="ml-auto text-gray-900 dark:text-gray-800 ">{open ? '-' : '+'}</Disclosure.Button>
                </div>
              )}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-slate-100 dark:bg-gray-400'>
                  <DialogHeader>
                    <DialogTitle className='text-xl dark:text-gray-800'>Deletando...</DialogTitle>
                    <DialogDescription className='text-base text-gray-800'>
                      Tem certeza de que deseja remover esta palavra? Está ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button aria-label='Confirmar' className='hover:bg-red-800' variant="destructive" onClick={confirmRemove}>
                      Confirmar
                    </Button>
                    <Button aria-label='Cancelar' className='bg-violet-50 border-2 dark:bg-gray-200 text-gray-900 dark:hover:bg-gray-300' variant="secondary" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>

                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="focus:outline-none text-gray-900 dark:text-gray-800 ">
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
                  <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-gray-500 divide-y divide-gray-100 dark:divide-violet-600 rounded-md shadow-lg ring-1 ring-violet-200 ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                          aria-label='Editar'
                            onClick={() => handleEdit(node)}
                            className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full`}
                          >
                            <FaEdit className="mr-2 text-yellow-600" /> Editar
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                          aria-label='Excluir'
                            onClick={() => openRemoveDialog(node)} 
                            className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full`}
                          >
                            <FaTrash className="mr-2 text-red-600" /> Excluir
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            <Disclosure.Panel className="pl-6 ">
              {node.children.length > 0 && (
                <ul className="pl-4 ">
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
