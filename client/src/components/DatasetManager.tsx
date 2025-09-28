import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, FileText, Download, Trash2, Eye, Plus, Search } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Mock dataset data - todo: remove mock functionality
const mockDatasets = [
  {
    id: 'DS001',
    name: 'Chlamydia Genomics Study 2023',
    source: 'NCBI GEO',
    omicsType: 'Genomics',
    pathogen: 'Chlamydia trachomatis',
    sampleCount: 145,
    fileSize: '2.4 GB',
    uploadDate: '2023-09-15',
    status: 'Processed',
    description: 'Whole genome sequencing data from clinical isolates'
  },
  {
    id: 'DS002',
    name: 'Gonorrhea Proteomics Dataset',
    source: 'PRIDE',
    omicsType: 'Proteomics',
    pathogen: 'Neisseria gonorrhoeae',
    sampleCount: 89,
    fileSize: '1.8 GB',
    uploadDate: '2023-08-22',
    status: 'Processing',
    description: 'Mass spectrometry analysis of antibiotic resistance'
  },
  {
    id: 'DS003',
    name: 'Syphilis Transcriptome Analysis',
    source: 'Local Upload',
    omicsType: 'Transcriptomics',
    pathogen: 'Treponema pallidum',
    sampleCount: 67,
    fileSize: '987 MB',
    uploadDate: '2023-09-01',
    status: 'Failed',
    description: 'RNA-seq data from tissue samples'
  }
];

export default function DatasetManager() {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt', '.fasta', '.fa'],
      'application/zip': ['.zip'],
      'application/gzip': ['.gz']
    },
    onDrop: (acceptedFiles) => {
      setUploadingFiles(acceptedFiles);
      console.log('Files selected for upload:', acceptedFiles.map(f => f.name));
    }
  });

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.pathogen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || dataset.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpload = () => {
    if (uploadingFiles.length === 0) return;
    
    console.log('Starting upload process');
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowUploadDialog(false);
          setUploadingFiles([]);
          console.log('Upload completed');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed': return 'bg-scientific-green text-white';
      case 'processing': return 'bg-scientific-amber text-white';
      case 'failed': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    console.log('Dataset deleted:', id);
  };

  return (
    <div className="space-y-6" data-testid="dataset-manager">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dataset Management</h2>
          <p className="text-muted-foreground">Organize and manage multi-omics datasets</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">{datasets.length} Total Datasets</span>
        </div>
      </div>

      {/* Upload and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-upload-dataset">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Dataset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Dataset</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                      ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                      hover:border-primary hover:bg-primary/5`}
                    data-testid="dropzone-dataset"
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    {isDragActive ? (
                      <p className="text-primary text-lg">Drop dataset files here...</p>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">Drag & drop dataset files here</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports CSV, JSON, FASTA, ZIP, and compressed files
                        </p>
                      </div>
                    )}
                  </div>

                  {uploadingFiles.length > 0 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Selected Files:</h4>
                        {uploadingFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">{file.type || 'Unknown'}</Badge>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Omics Type:</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="genomics">Genomics</SelectItem>
                              <SelectItem value="proteomics">Proteomics</SelectItem>
                              <SelectItem value="transcriptomics">Transcriptomics</SelectItem>
                              <SelectItem value="metabolomics">Metabolomics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Pathogen:</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pathogen..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chlamydia">Chlamydia trachomatis</SelectItem>
                              <SelectItem value="gonorrhea">Neisseria gonorrhoeae</SelectItem>
                              <SelectItem value="syphilis">Treponema pallidum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {uploadProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Upload Progress</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}

                      <Button 
                        onClick={handleUpload} 
                        className="w-full" 
                        disabled={uploadProgress > 0 && uploadProgress < 100}
                        data-testid="button-start-upload"
                      >
                        {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Start Upload'}
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-elevate cursor-pointer" onClick={() => console.log('Import from NCBI GEO')}>
              <CardContent className="pt-4 text-center">
                <Database className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">Import from NCBI GEO</h4>
                <p className="text-sm text-muted-foreground">Connect to Gene Expression Omnibus</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate cursor-pointer" onClick={() => console.log('Import from PRIDE')}>
              <CardContent className="pt-4 text-center">
                <Database className="w-8 h-8 mx-auto mb-2 text-scientific-rose" />
                <h4 className="font-semibold">Import from PRIDE</h4>
                <p className="text-sm text-muted-foreground">Access proteomics data repository</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate cursor-pointer" onClick={() => console.log('Batch import')}>
              <CardContent className="pt-4 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-scientific-amber" />
                <h4 className="font-semibold">Batch Import</h4>
                <p className="text-sm text-muted-foreground">Upload multiple datasets</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets by name or pathogen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-datasets"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dataset List */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid" data-testid="tab-grid-view">Grid View</TabsTrigger>
          <TabsTrigger value="table" data-testid="tab-table-view">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDatasets.map((dataset) => (
              <Card key={dataset.id} className="hover-elevate" data-testid={`card-dataset-${dataset.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-mono">{dataset.id}</CardTitle>
                      <p className="text-sm font-medium text-foreground">{dataset.name}</p>
                    </div>
                    <Badge className={getStatusColor(dataset.status)}>{dataset.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{dataset.omicsType}</Badge>
                    <Badge variant="secondary" className="text-xs">{dataset.source}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{dataset.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pathogen:</span>
                      <span className="font-medium">{dataset.pathogen}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Samples:</span>
                      <span>{dataset.sampleCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{dataset.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded:</span>
                      <span>{dataset.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => console.log('View dataset:', dataset.id)} data-testid={`button-view-${dataset.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => console.log('Download dataset:', dataset.id)} data-testid={`button-download-${dataset.id}`}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(dataset.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-${dataset.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pathogen</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Samples</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDatasets.map((dataset) => (
                      <tr key={dataset.id} className="border-b hover-elevate" data-testid={`row-dataset-${dataset.id}`}>
                        <td className="px-4 py-3 font-mono text-sm">{dataset.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{dataset.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">{dataset.omicsType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{dataset.pathogen}</td>
                        <td className="px-4 py-3 text-sm">{dataset.sampleCount}</td>
                        <td className="px-4 py-3 text-sm">{dataset.fileSize}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(dataset.status)}>{dataset.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => console.log('View:', dataset.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => console.log('Download:', dataset.id)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(dataset.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredDatasets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No datasets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first dataset to get started'}
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Dataset
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}