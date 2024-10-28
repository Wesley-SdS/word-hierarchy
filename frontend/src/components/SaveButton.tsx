import { Button } from "@/components/ui/button";

interface WordNode {
  name: string;
  children: WordNode[];
}

interface SaveButtonProps {
  hierarchy: WordNode[];
}

const SaveButton = ({ hierarchy }: SaveButtonProps) => {
  
  const convertArrayToObject = (nodes: WordNode[]): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
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
    const hierarchyObject = convertArrayToObject(hierarchy); 
    const dataStr = JSON.stringify(hierarchyObject, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' }); 
    const url = URL.createObjectURL(blob); 
    const link = document.createElement('a'); 
    link.href = url;
    link.download = 'hierarchy.json'; 
    link.click(); 
  };

  return (
    <div className="flex gap-4">
      <Button
      aria-label="Download Json"
        onClick={saveHierarchyToFile} 
        className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 mt-4"
      >
        Download JSON
      </Button>
    </div>
  );
};

export default SaveButton;
