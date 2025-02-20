
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface FileUploadZoneProps {
  onFileAccepted: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const FileUploadZone = ({ onFileAccepted, isLoading = false }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      toast({
        title: "Too many files",
        description: "Please upload only one CSV file at a time.",
        variant: "destructive",
      });
      return;
    }

    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    onFileAccepted(file);
  }, [onFileAccepted, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    onFileAccepted(file);
    e.target.value = '';
  }, [onFileAccepted, toast]);

  return (
    <div
      className={`relative min-h-[300px] rounded-lg border-2 border-dashed transition-colors duration-200 ease-in-out
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
        ${isLoading ? 'pointer-events-none opacity-50' : 'hover:bg-accent/50'}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {isLoading ? (
          <Spinner className="mb-4" />
        ) : (
          <>
            <Upload className="h-12 w-12 text-muted-foreground mb-4 animate-pulse-subtle" />
            <h3 className="text-lg font-semibold mb-2">Drop your CSV file here</h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Select File
            </Button>
          </>
        )}
        <input
          id="file-input"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileInput}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
