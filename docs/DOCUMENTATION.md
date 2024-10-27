
# Documentação Completa do Projeto: Analisador de Hierarquia de Palavras

---

## Sumário

1. **Visão Geral**
2. **Estrutura do Projeto**
   - Backend
   - Frontend
3. **Funcionalidades**
   - CLI (Linha de Comando)
   - Frontend (React)
4. **Estrutura da Hierarquia**
5. **Configuração e Instalação**
6. **Detalhamento do Backend**
   - Estrutura do Código
   - Análise da Hierarquia
   - Testes Unitários
7. **Detalhamento do Frontend**
   - Componentes
   - Gerenciamento de Estado
   - Funcionalidades
8. **Testes Unitários**
9. **Pontos de Melhoria e Funcionalidades Futuras**
10. **Considerações Finais**

---

## 1. Visão Geral

Este projeto é um analisador de hierarquia de palavras que carrega uma árvore hierárquica de palavras e oferece duas interfaces:
- **CLI (Linha de Comando)** para análise de frases, identificando palavras em diferentes níveis de profundidade na hierarquia.
- **Frontend em React** que permite ao usuário criar, visualizar e salvar a hierarquia de palavras, exportando-a em formato JSON.

---

## 2. Estrutura do Projeto

O projeto é dividido em duas partes principais:

### **Backend**: 
- Localizado na pasta `backend/`, esta parte do projeto implementa uma CLI para analisar frases com base em uma hierarquia de palavras, verificando a profundidade de cada termo.
  
### **Frontend**:
- Localizado na pasta `frontend/`, essa parte é responsável por permitir a criação e visualização de hierarquias através de uma interface gráfica. O usuário pode adicionar múltiplos níveis de palavras e salvar a hierarquia em formato JSON.

---

## 3. Funcionalidades

### **CLI (Linha de Comando)**

- **Comando**: 
  ```bash
  npm run analyze -- --depth <n> --phrase "<frase>" --verbose
  ```

- **Parâmetros**:
  - `--depth <n>`: Define a profundidade da árvore a ser analisada.
  - `--phrase "<frase>"`: A frase a ser analisada.
  - `--verbose`: (Opcional) Exibe o tempo de carregamento dos parâmetros e verificação da frase.

- **Exemplo de uso**:
  ```bash
  npm run analyze -- --depth 3 --phrase "Eu amo felinos e gorilas" --verbose
  ```

- **Exemplo de saída**:
  ```bash
  Felinos = 1; Primatas = 1
  Tempo de carregamento dos parâmetros: 1ms
  Tempo de verificação da frase: 35ms
  ```

### **Frontend (React)**

- **Interface Visual**:
  - O usuário pode criar e visualizar a hierarquia de palavras.
  - Adicionar múltiplos níveis de palavras.
  - Salvar a hierarquia como um arquivo JSON.
  - Baixar o arquivo JSON com a hierarquia criada.

---

## 4. Estrutura da Hierarquia

A hierarquia de palavras é representada como uma árvore em um arquivo JSON. Cada nível da hierarquia contém subcategorias ou palavras, e a profundidade de cada palavra é determinada pelo nível de aninhamento dentro dessa estrutura.

**Exemplo de estrutura em JSON**:
```json
{
     "mamiferos": {
      "carnivoros": {
        "felinos": {
          "leoes": {},
          "tigres": {},
          "jaguars": {},
          "leopardos": {}
        }
      },
      "herbivoros": {
        "equideos": {
          "cavalos": {},
          "zebras": {},
          "asnos": {}
        },
        "bovideos": {
          "bois": {},
          "bufalos": {},
          "antilopes": {},
          "cabras": {}
        }
      },
      "primatas": {
        "gorilas": {},
        "chimpanzes": {},
        "orangotangos": {}
      }
    },
}
```

---

## 5. Configuração e Instalação

### **Backend**:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git
   ```

2. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Para rodar a CLI:
   ```bash
   npm run analyze -- --depth <n> --phrase "<frase>"
   ```

### **Frontend**:

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o frontend:
   ```bash
   npm run dev
   ```

---

## 6. Detalhamento do Backend

### **Estrutura do Código**

A lógica de análise está contida no arquivo `cli.ts`, que implementa a função de análise da frase comparando-a com a hierarquia carregada do arquivo JSON.

- `loadHierarchy`: Função que carrega o arquivo JSON da hierarquia.
- `normalizeString`: Função que normaliza as palavras, removendo acentos, pontuações e convertendo para minúsculas.
- `analyzePhrase`: A principal função que busca correspondências de palavras dentro da hierarquia, com base na profundidade fornecida.

### **Testes Unitários**

Os testes foram implementados para garantir que a CLI está funcionando corretamente. Eles verificam diferentes profundidades e frases, além de um teste que analisa uma frase com mais de 5000 caracteres.

---

## 7. Detalhamento do Frontend

### **Componentes Principais**:

- **HierarchyBuilder**: Componente responsável por permitir a construção da hierarquia de palavras, com campos de entrada para o usuário adicionar níveis e subníveis.
  
- **HierarchyTree**: Exibe a hierarquia em uma estrutura visual (semelhante a uma árvore).

- **SaveButton**: Botão que permite o download da hierarquia criada em formato JSON.

### **Funcionalidades**:

1. Adicionar novos níveis e subníveis.
2. Visualizar a hierarquia completa de forma visual.
3. Salvar e exportar a hierarquia como arquivo JSON.
4. Função de busca dentro da hierarquia.

### **Gerenciamento de Estado**

O gerenciamento de estado foi implementado utilizando o **useState** do React, com a estrutura da hierarquia sendo manipulada e convertida para JSON antes de ser baixada pelo usuário.

---

## 8. Testes Unitários

Os testes foram implementados para verificar se a CLI funciona corretamente, incluindo um teste com uma frase de mais de 5000 caracteres, garantindo que a aplicação possa lidar com grandes volumes de texto.

---

## 9. Pontos de Melhoria e Funcionalidades Futuras

1. **Otimizações de Performance**: Melhorar o tempo de verificação de frases e carregamento de parâmetros, especialmente para hierarquias muito grandes.
2. **Funcionalidade de Busca Avançada**: Permitir ao usuário do frontend buscar palavras específicas na hierarquia.
3. **Virtualização de Lista**: Implementar virtualização de listas para hierarquias muito grandes no frontend, melhorando a performance.
4. **Reorganização por Drag-and-Drop**: Permitir que o usuário reorganize a hierarquia arrastando e soltando níveis no frontend.
5. **Permitir a importação de Json**: Implementar a funcionalidade de importação de arquivos JSON no frontend para que o usuário possa carregar hierarquias previamente salvas e continuar a edição.
6. **Internalização**: Tradução em Três Idiomas (PT, EN, ES)**: Adicionar suporte para três idiomas, facilitando o uso da aplicação para um público mais diverso.
7. **Integração com Banco de Dados**: Adicionar um backend com suporte a banco de dados (como MongoDB ou PostgreSQL) para armazenar a hierarquia de palavras de forma persistente, permitindo o carregamento e salvamento dinâmico de dados.
8. **Histórico de Alterações:**: Implementar uma funcionalidade de histórico para rastrear e desfazer mudanças feitas na hierarquia de palavras.
9. **Autenticação e Controle de Acesso:**: Adicionar autenticação de usuário e controle de acesso para que múltiplos usuários possam gerenciar suas próprias hierarquias.
10. **Testes mais abrangentes**:Aumentar cobertura de testes no backend (rotas, performance, erros) e no frontend (componentes, UI/UX, E2E) para garantir robustez e funcionalidade.

---

## 10. Considerações Finais

Este projeto fornece uma solução para criar, visualizar e analisar hierarquias de palavras, tanto via CLI quanto via uma interface gráfica. Com um desempenho sólido e a possibilidade de expansão, ele pode ser facilmente adaptado para outras necessidades hierárquicas.



---
