
[Leia em Português](./README_PT.md)


# Word Hierarchy Analyzer (CLI and Frontend)

This project consists of a command-line interface (CLI) application and a frontend to analyze a word hierarchy, where each level of the tree represents a specific depth. The goal is to allow users to analyze phrases and identify words present at a given depth in the hierarchy.

## Features

### CLI
- Load a hierarchical tree of words from a JSON file.
- Analyze user-provided phrases, identifying words matching the specified depth in the tree.
- Display metrics such as verification and loading time.
- Support for verbose mode to show additional information.

### Frontend
- User-friendly interface to view and interact with the word hierarchy.
- Visual display of the hierarchy, allowing navigation between categories and subcategories.
- Support for adding, editing, and removing words from the hierarchy.
- Search functionality to quickly find words in the hierarchy.
- Drag-and-drop support for reorganizing words in the hierarchical tree.

## Technologies Used

### Backend (CLI)
- **Node.js**: Used as the runtime environment.
- **TypeScript**: Development language to ensure static typing and code robustness.
- **Jest**: Unit testing framework used to validate CLI functionality.
- **fs** and **path**: Native Node.js modules for file and directory manipulation.

### Frontend
- **Next.js 14**: React framework used to develop the frontend.
- **Tailwind CSS**: Used for quick and efficient UI styling.
- **ShadCN UI**: Component library used to create dialogs and UI elements.
- **TypeScript**: Used to ensure better quality and typing in frontend code.

## Prerequisites

- **Node.js** version 14 or above.
- **npm** (Node Package Manager) or **yarn**.
- **Git** for version control.

## How to Run the Project

### Backend (CLI)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository.git
   cd your-repository/backend
   ```

2. Install the dependencies with:
Navigate to the folder `backend`:
   ```bash
   cd ../backend
   ```
   ```bash
   npm install
   ```

3. Run the analysis command using the following syntax:
   ```bash
   npm run analyze -- --depth <depth-level> --phrase "<your-phrase>" --verbose
   ```

- `--depth <n>`: Specify the depth level of the hierarchy.
- `--phrase "<your-phrase>"`: The phrase you want to analyze.
- `--verbose` (optional): Shows performance metrics.

Example:
```bash
npm run analyze -- --depth 3 --phrase "Eu vi tigres e papagaios" --verbose
```

### Running Tests

To run the tests, use:
```bash
npm run test
```

### Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install the dependencies with:
   ```bash
   npm install
   ```

3. Start the development server with:
   ```bash
   npm run dev
   ```

## Project Structure

```bash
|-- backend
    |-- cli.ts               # CLI logic
    |-- dicts
        |-- hierarchy.json   # Word hierarchy JSON file
    |-- tests
        |-- analyzePhrase.test.ts  # Jest unit tests
|-- frontend
    |-- components           # React components
    |-- pages
        |-- index.tsx        # Main frontend page
    |-- styles               # Tailwind CSS styles
```

## Roadmap

- Add a feature to allow users to import/export hierarchies in different formats.
- Improve performance for large hierarchies and complex phrases.
- Expand the frontend with a dashboard for managing multiple hierarchies.

## Contributions

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature.
3. Submit a pull request.

## Contact

If you have questions or suggestions, contact via email: [wesleysantos.0095@gmail.com](mailto:wesleysantos.0095@gmail.com).
