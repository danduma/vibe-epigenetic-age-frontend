
import { useState } from "react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [bioAge, setBioAge] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setBioAge(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/getbioage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const data = await response.json();
      setBioAge(data.bioAge);
      
      toast({
        title: "Success",
        description: "Your biological age has been calculated.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process the CSV file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/10">
      <div className="w-full max-w-2xl px-4 py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Biological Age Calculator</h1>
          <p className="text-muted-foreground">
            Upload your CSV file to calculate your biological age
          </p>
        </div>

        <FileUploadZone 
          onFileAccepted={handleFileUpload}
          isLoading={isLoading}
        />

        {bioAge !== null && (
          <div className="text-center animate-fade-in">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              Your Biological Age
            </div>
            <p className="text-5xl font-bold mt-4">{bioAge} years</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
