import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, Dna, Brain, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Editor from '@monaco-editor/react';

// Mock data - todo: remove mock functionality
const mockPredictions = [
  {
    gene: 'tetM',
    antibiotic: 'Tetracycline',
    confidence: 0.92,
    location: '1234-1678',
    mechanism: 'Ribosomal protection',
    evidence: 'High sequence similarity to known resistance determinants'
  },
  {
    gene: 'ermB',
    antibiotic: 'Erythromycin',
    confidence: 0.87,
    location: '2456-2789',
    mechanism: 'rRNA methylation',
    evidence: 'Conserved methyltransferase domain detected'
  },
  {
    gene: 'gyrA_S83F',
    antibiotic: 'Ciprofloxacin',
    confidence: 0.78,
    location: '3421-3456',
    mechanism: 'Target modification',
    evidence: 'Known quinolone resistance mutation'
  }
];

export default function ResistancePredictor() {
  const [inputMode, setInputMode] = useState<'sequence' | 'file' | 'dataset'>('sequence');
  const [fastaSequence, setFastaSequence] = useState('>Sample_sequence\nATGGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGC\nTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA\nGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [predictions, setPredictions] = useState<typeof mockPredictions>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.fasta', '.fa', '.fas'],
      'application/octet-stream': ['.fasta', '.fa', '.fas']
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      console.log('Files uploaded:', acceptedFiles.map(f => f.name));
    }
  });

  const runAnalysis = async () => {
    setAnalysisRunning(true);
    console.log('Starting resistance analysis...');
    
    // Simulate analysis
    setTimeout(() => {
      setPredictions(mockPredictions);
      setAnalysisRunning(false);
      console.log('Analysis completed');
    }, 3000);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-scientific-green';
    if (confidence >= 0.6) return 'bg-scientific-amber';
    return 'bg-destructive';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6" data-testid="resistance-predictor">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resistance Gene Predictor</h2>
          <p className="text-muted-foreground">Identify antimicrobial resistance markers using ML models</p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="w-5 h-5" />
              Sequence Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sequence" data-testid="tab-sequence">FASTA Sequence</TabsTrigger>
                <TabsTrigger value="file" data-testid="tab-file">Upload File</TabsTrigger>
                <TabsTrigger value="dataset" data-testid="tab-dataset">Existing Dataset</TabsTrigger>
              </TabsList>

              <TabsContent value="sequence" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Paste FASTA Sequence:</label>
                  <div className="border rounded-md overflow-hidden">
                    <Editor
                      height="200px"
                      language="plaintext"
                      theme="vs-light"
                      value={fastaSequence}
                      onChange={(value) => setFastaSequence(value || '')}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 12,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                    hover:border-primary hover:bg-primary/5`}
                  data-testid="dropzone-upload"
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-primary">Drop FASTA files here...</p>
                  ) : (
                    <div>
                      <p className="font-medium">Drag & drop FASTA files here</p>
                      <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                    </div>
                  )}
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-mono">{file.name}</span>
                        <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dataset" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Existing Dataset:</label>
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger data-testid="select-dataset">
                      <SelectValue placeholder="Choose a dataset..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STI001">STI001 - Chlamydia trachomatis (145 samples)</SelectItem>
                      <SelectItem value="STI002">STI002 - Neisseria gonorrhoeae (89 samples)</SelectItem>
                      <SelectItem value="STI003">STI003 - Treponema pallidum (67 samples)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              onClick={runAnalysis} 
              disabled={analysisRunning}
              className="w-full" 
              data-testid="button-run-analysis"
            >
              {analysisRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing Sequences...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Run Resistance Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resistance Predictions</CardTitle>
              {predictions.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => console.log('Export predictions')} data-testid="button-export-predictions">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {analysisRunning ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Analyzing sequences for resistance markers...</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sequence preprocessing</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} />
                  <div className="flex justify-between text-sm">
                    <span>ML model inference</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} />
                  <div className="flex justify-between text-sm">
                    <span>Result validation</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} />
                </div>
              </div>
            ) : predictions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-scientific-amber" />
                  <span className="text-muted-foreground">Found {predictions.length} potential resistance markers</span>
                </div>
                
                <div className="space-y-3">
                  {predictions.map((prediction, index) => (
                    <Card key={index} className="border-l-4 border-l-primary" data-testid={`prediction-${index}`}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold">{prediction.gene}</span>
                              <Badge variant="outline" className="bg-scientific-amber/10 text-scientific-amber border-scientific-amber/20">
                                {prediction.antibiotic}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Confidence:</span>
                              <Badge className={`${getConfidenceColor(prediction.confidence)} text-white`}>
                                {getConfidenceBadge(prediction.confidence)} ({(prediction.confidence * 100).toFixed(0)}%)
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="ml-2 font-mono">{prediction.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Mechanism:</span>
                              <span className="ml-2">{prediction.mechanism}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <span className="text-muted-foreground">Evidence:</span>
                            <p className="mt-1 text-xs text-muted-foreground">{prediction.evidence}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No analysis results yet</p>
                <p className="text-sm">Upload sequences and run analysis to see resistance predictions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}