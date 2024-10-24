
# Analisador de Hierarquia de Palavras (CLI e Frontend)

Este projeto consiste em uma aplicação de interface de linha de comando (CLI) e um frontend para analisar uma hierarquia de palavras, onde cada nível da árvore representa uma profundidade específica. O objetivo é permitir que os usuários analisem frases e identifiquem palavras presentes em uma determinada profundidade na hierarquia.

## Funcionalidades

### CLI
- Carregar uma árvore hierárquica de palavras a partir de um arquivo JSON.
- Analisar frases fornecidas pelo usuário, identificando palavras que correspondem à profundidade especificada na árvore.
- Exibir métricas como tempo de verificação e carregamento.
- Suporte ao modo verboso para exibir informações adicionais.

### Frontend
- Interface amigável para visualizar e interagir com a hierarquia de palavras.
- Exibição visual da hierarquia, permitindo navegação entre categorias e subcategorias.
- Suporte para adicionar, editar e remover palavras da hierarquia.
- Funcionalidade de busca para encontrar rapidamente palavras na hierarquia.
- Suporte a arrastar e soltar para reorganizar palavras na árvore hierárquica.

## Tecnologias Utilizadas

### Backend (CLI)
- **Node.js**: Usado como ambiente de execução.
- **TypeScript**: Linguagem de desenvolvimento para garantir tipagem estática e robustez do código.
- **Jest**: Framework de testes unitários usado para validar a funcionalidade do CLI.
- **fs** e **path**: Módulos nativos do Node.js para manipulação de arquivos e diretórios.

### Frontend
- **Next.js 14**: Framework React usado para desenvolver o frontend.
- **Tailwind CSS**: Utilizado para estilização rápida e eficiente da interface do usuário.
- **ShadCN UI**: Biblioteca de componentes usada para criar diálogos e elementos de interface.
- **TypeScript**: Usado para garantir melhor qualidade e tipagem no código frontend.

## Pré-requisitos

- **Node.js** versão 14 ou superior.
- **npm** (Node Package Manager) ou **yarn**.
- **Git** para controle de versão.

## Como Executar o Projeto

### Backend (CLI)
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git
   cd seu-repositorio/backend
   ```

2. Instale as dependências com:
Navegue até a pasta `backend`:
   ```bash
   cd ../backend
   ```

   ```bash
   npm install
   ```

3. Execute o comando de análise usando a seguinte sintaxe:
   ```bash
   npm run analyze -- --depth <nivel-de-profundidade> --phrase "<sua-frase>" --verbose
   ```

- `--depth <n>`: Especifica o nível de profundidade da hierarquia.
- `--phrase "<sua-frase>"`: A frase que você deseja analisar.
- `--verbose` (opcional): Exibe métricas de performance.

Exemplo:
```bash
npm run analyze -- --depth 3 --phrase "Eu vi tigres e papagaios" --verbose
```

### Executando os Testes

Para executar os testes, use:
```bash
npm run test
```

### Frontend
1. Navegue até a pasta `frontend`:
   ```bash
   cd ../frontend
   ```

2. Instale as dependências com:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento com:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```bash
|-- backend
    |-- cli.ts               # Lógica do CLI
    |-- dicts
        |-- hierarchy.json   # Arquivo JSON com a hierarquia de palavras
    |-- tests
        |-- analyzePhrase.test.ts  # Testes unitários com Jest
|-- frontend
    |-- components           # Componentes React
    |-- pages
        |-- index.tsx        # Página principal do frontend
    |-- styles               # Estilos com Tailwind CSS
```

## Roadmap

- Adicionar funcionalidade para permitir que os usuários importem/exportem hierarquias em diferentes formatos.
- Melhorar o desempenho para hierarquias grandes e frases complexas.
- Expandir o frontend com um painel de controle para gerenciar várias hierarquias.

## Contribuições

Contribuições são bem-vindas! Siga os seguintes passos para contribuir:

1. Faça um fork do repositório.
2. Crie uma nova branch para sua funcionalidade.
3. Envie um pull request.

## Contato

Se você tiver perguntas ou sugestões, entre em contato por e-mail: [wesleysantos.0095@gmail.com](mailto:wesleysantos.0095@gmail.com).
