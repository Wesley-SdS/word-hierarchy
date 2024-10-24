import { Button } from "@/components/ui/button";

interface WordNode {
  name: string;
  children: WordNode[];
}

interface SaveButtonProps {
  hierarchy: WordNode[];
  onClick: () => Promise<void>;
}

const SaveButton = ({ hierarchy, onClick }: SaveButtonProps) => {
  const saveHierarchy = () => {
    const dataStr = JSON.stringify(hierarchy, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hierarchy.json';
    link.click();
  };

  return (
    <div className="flex gap-4 justify-between">
      <Button onClick={onClick} className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 mt-4">
        Save Hierarchy
      </Button>
      <Button onClick={saveHierarchy} className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 mt-4">
        Download JSON
      </Button>
    </div>
  );
};

export default SaveButton;
