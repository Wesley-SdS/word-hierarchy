'use client';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import Image from 'next/image'; // Usando o componente Image do Next.js

const Documentation: React.FC = () => {
    const images = [
        '/page.png',
        '/page2.png',
        '/page.png',
    ];

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-500 ease-in-out">
            <div className="container mx-auto px-4">
                {/* Title Section */}
                <section className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 transition-all duration-500 ease-in-out transform hover:scale-105">
                        Word Hierarchy Builder Project
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                        Este projeto permite a criação, visualização e análise de hierarquias de palavras, tanto via CLI quanto via uma interface gráfica elegante. Ele é ideal para trabalhar com classificações hierárquicas complexas de dados.
                    </p>
                </section>

                {/* Funcionalidades do Projeto */}
                <div className="space-y-12 py-12">
                    <h2 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-10">
                        Funcionalidades do Projeto
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="group relative p-6 bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-purple-700 dark:to-indigo-900 rounded-lg shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                            <div className="absolute inset-0 transition-opacity bg-black bg-opacity-25 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-3">CLI para Análise de Frases</h3>
                                <p className="text-white text-opacity-90">
                                    Uma CLI poderosa para analisar frases e categorizá-las dentro da hierarquia de palavras, determinando a profundidade de cada termo.
                                </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="group relative p-6 bg-gradient-to-r from-green-400 to-teal-600 dark:from-green-700 dark:to-teal-900 rounded-lg shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                            <div className="absolute inset-0 transition-opacity bg-black bg-opacity-25 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-3">Frontend Visual Intuitivo</h3>
                                <p className="text-white text-opacity-90">
                                    Interface gráfica interativa para criar e visualizar hierarquias de palavras, facilitando o gerenciamento de categorias e subcategorias.
                                </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="group relative p-6 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-700 dark:to-indigo-900 rounded-lg shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                            <div className="absolute inset-0 transition-opacity bg-black bg-opacity-25 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-3">Suporte para Múltiplos Níveis</h3>
                                <p className="text-white text-opacity-90">
                                    Suporte para criar hierarquias com múltiplos níveis de profundidade, possibilitando uma organização detalhada de categorias.
                                </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 4H8m8-8H8"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="group relative p-6 bg-gradient-to-r from-yellow-400 to-orange-600 dark:from-yellow-700 dark:to-orange-900 rounded-lg shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                            <div className="absolute inset-0 transition-opacity bg-black bg-opacity-25 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-3">Exportação e Salvamento de JSON</h3>
                                <p className="text-white text-opacity-90">
                                    Permite exportar e salvar hierarquias como arquivos JSON, facilitando o compartilhamento e a reutilização de dados.
                                </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="group relative p-6 bg-gradient-to-r from-pink-400 to-red-600 dark:from-pink-700 dark:to-red-900 rounded-lg shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                            <div className="absolute inset-0 transition-opacity bg-black bg-opacity-25 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-3">Busca de Palavras na Hierarquia</h3>
                                <p className="text-white text-opacity-90">
                                    Ferramenta de busca integrada para encontrar palavras específicas dentro da hierarquia, melhorando a navegação.
                                </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 12h2m-1-1v2m-7 4h6a1 1 0 011 1v2h-8a2 2 0 01-2-2v-4a2 2 0 012-2zm16-2a2 2 0 012 2v4a2 2 0 01-2 2h-8v-2a1 1 0 011-1h6"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Galeria de Imagens */}
                <section className="my-32">
                    <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 my-16">Galeria de Imagens</h2>
                    <div className="w-full flex flex-wrap gap-10 justify-center">
                        {images.map((src, index) => (
                            <div
                                key={index}
                                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 overflow-hidden rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-500"
                            >
                                <Image
                                    src={src}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full h-64 object-cover cursor-pointer"
                                    onClick={() => setSelectedImage(src)}
                                    width={500}
                                    height={500}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Melhorias Propostas */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6">Melhorias Propostas</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: '1. Otimizações de Performance',
                                description: 'Melhorar o tempo de verificação de frases e carregamento de parâmetros, especialmente para hierarquias muito grandes.',
                            },
                            {
                                title: '2. Funcionalidade de Busca Avançada',
                                description: 'Permitir ao usuário do frontend buscar palavras específicas na hierarquia.',
                            },
                            {
                                title: '3. Virtualização de Lista',
                                description: 'Implementar virtualização de listas para hierarquias muito grandes no frontend, melhorando a performance.',
                            },
                            {
                                title: '4. Reorganização por Drag-and-Drop',
                                description: 'Permitir que o usuário reorganize a hierarquia arrastando e soltando níveis no frontend.',
                            },
                            {
                                title: '5. Permitir a Importação de JSON',
                                description: 'Implementar a funcionalidade de importação de arquivos JSON no frontend para carregar hierarquias previamente salvas.',
                            },
                            {
                                title: '6. Internacionalização',
                                description: 'Adicionar suporte para três idiomas (PT, EN, ES), facilitando o uso da aplicação por um público mais diverso.',
                            },
                            {
                                title: '7. Integração com Banco de Dados',
                                description: 'Adicionar suporte a banco de dados (MongoDB ou PostgreSQL) para armazenar a hierarquia de palavras de forma persistente.',
                            },
                            {
                                title: '8. Histórico de Alterações',
                                description: 'Implementar um histórico para rastrear e desfazer mudanças na hierarquia de palavras.',
                            },
                            {
                                title: '9. Autenticação e Controle de Acesso',
                                description: 'Adicionar autenticação de usuário e controle de acesso para que múltiplos usuários gerenciem suas hierarquias.',
                            },
                            {
                                title: '10. Testes mais Abrangentes',
                                description: 'Aumentar a cobertura de testes no backend e frontend para garantir robustez e funcionalidade.',
                            },
                        ].map((improvement, index) => (
                            <Transition
                                key={index}
                                show
                                enter="transform transition duration-500"
                                enterFrom="opacity-0 translate-y-4"
                                enterTo="opacity-100 translate-y-0"
                                leave="transform transition duration-300"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-4"
                            >
                                <div
                                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl hover:rotate-1 hover:border-indigo-500 border-2 transition-transform duration-500"
                                    style={{
                                        transformOrigin: 'center',
                                        transition: 'transform 0.5s, border-color 0.5s',
                                    }}
                                >
                                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{improvement.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{improvement.description}</p>
                                </div>
                            </Transition>
                        ))}
                    </div>
                </section>

                {/* Modal for Image Preview */}
                {selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                        <div className="relative">
                            <button
                                className="absolute top-0 right-0 m-4 text-white text-3xl focus:outline-none"
                                onClick={() => setSelectedImage(null)}
                            >
                                &times;
                            </button>
                            <Image
                                src={selectedImage}
                                alt="Zoomed"
                                className="w-full h-auto max-w-3xl max-h-screen object-contain rounded-lg"
                                width={1200}
                                height={800}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documentation;
