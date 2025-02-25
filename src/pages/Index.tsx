import { useState } from "react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { useToast } from "@/hooks/use-toast";

async function getAnalysisResult(csvFile: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', csvFile);
  
  // 1. Upload the file and get the sample ID
  const uploadResponse = await fetch('http://localhost:8000/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!uploadResponse.ok) {
    throw new Error('Upload failed');
  }
  
  const uploadResult = await uploadResponse.json();
  const sampleId = uploadResult.id;
  
  // 2. Poll for results until processing is complete
  while (true) {
    const resultResponse = await fetch(
      `http://localhost:8000/api/samples/${sampleId}/result`
    );
    
    if (resultResponse.status === 400) {
      // Analysis not complete yet, wait 1 second before trying again
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }
    
    if (!resultResponse.ok) {
      throw new Error('Failed to get results');
    }
    
    return await resultResponse.json();
  }
}

const ClockResult = ({ title, result }: { title: string, result: ClockResult | ClockError }) => {
  if ('error' in result) {
    return (
      <div className="p-6 rounded-lg border bg-destructive/10 text-destructive">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        <div>
          <p className="text-4xl font-bold text-primary">{result.predicted_age.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground mt-1">Predicted Age (years)</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Standard Deviation: ±{result.std_predicted_age.toFixed(2)}</p>
          <p>Samples Used: {result.num_samples}</p>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await getAnalysisResult(file);
      setResult(analysisResult);
      
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
      <div className="w-full max-w-4xl px-4 py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Biological Age Calculator</h1>
          <p className="text-muted-foreground">
            Upload your CSV file to calculate your biological age using multiple epigenetic clocks
          </p>
        </div>

        <FileUploadZone 
          onFileAccepted={handleFileUpload}
          isLoading={isLoading}
        />

        {result && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ClockResult title="Horvath Clock" result={result.clocks.horvath} />
              <ClockResult title="Hannum Clock" result={result.clocks.hannum} />
              <ClockResult title="PhenoAge Clock" result={result.clocks.phenoage} />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Analysis completed using {result.total_sites_used} methylation sites</p>
              <p>Imputation: {result.config.imputation_strategy}, Normalization: {result.config.normalize_data ? "Yes" : "No"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
