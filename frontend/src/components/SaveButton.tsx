import { Button } from "@/components/ui/button";

interface WordNode {
  name: string;
  children: WordNode[];
}

interface SaveButtonProps {
  hierarchy: WordNode[];
}

const SaveButton = ({ hierarchy }: SaveButtonProps) => {
  // Função para converter a árvore (que está no formato de array) para o formato de objeto original
  const convertArrayToObject = (nodes: WordNode[]): Record<string, any> => {
    const result: Record<string, any> = {};
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        result[node.name] = convertArrayToObject(node.children);
      } else {
        result[node.name] = {};
      }
    });
    return result;
  };

  const saveHierarchyToFile = () => {
    const hierarchyObject = convertArrayToObject(hierarchy); // Converte para o formato de objeto
    const dataStr = JSON.stringify(hierarchyObject, null, 2); // Converte o objeto para JSON formatado
    const blob = new Blob([dataStr], { type: 'application/json' }); // Cria um arquivo JSON
    const url = URL.createObjectURL(blob); // Cria um link para o arquivo
    const link = document.createElement('a'); // Cria um elemento de link
    link.href = url;
    link.download = 'hierarchy.json'; // Define o nome do arquivo para download
    link.click(); // Simula o clique para baixar o arquivo
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={saveHierarchyToFile} // Faz o download diretamente ao clicar
        className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 mt-4"
      >
        Download JSON
      </Button>
    </div>
  );
};

export default SaveButton;
