interface WordNode {
  name: string;
  children: WordNode[];
}

interface SaveButtonProps {
  hierarchy: WordNode[];
}

const SaveButton = ({ hierarchy }: SaveButtonProps) => {
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
      <button onClick={saveHierarchy} className="bg-blue-600 text-white rounded px-4 py-2 mt-4">
          Save as JSON
      </button>
  );
};

export default SaveButton;
