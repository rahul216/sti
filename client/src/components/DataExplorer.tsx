import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - todo: remove mock functionality
const mockData = [
  {
    id: 'STI001',
    pathogen: 'Chlamydia trachomatis',
    omicsType: 'Genomics',
    country: 'USA',
    year: 2023,
    sampleCount: 145,
    resistanceMarkers: ['tetM', 'ermB'],
    metadata: { studyType: 'Clinical', platform: 'Illumina' }
  },
  {
    id: 'STI002', 
    pathogen: 'Neisseria gonorrhoeae',
    omicsType: 'Proteomics',
    country: 'UK',
    year: 2022,
    sampleCount: 89,
    resistanceMarkers: ['penA', 'mtrR'],
    metadata: { studyType: 'Surveillance', platform: 'Mass Spec' }
  },
  {
    id: 'STI003',
    pathogen: 'Treponema pallidum',
    omicsType: 'Transcriptomics',
    country: 'Canada',
    year: 2023,
    sampleCount: 67,
    resistanceMarkers: ['macB'],
    metadata: { studyType: 'Research', platform: 'RNA-Seq' }
  }
];

export default function DataExplorer() {
  const [filters, setFilters] = useState({
    pathogen: '',
    omicsType: '',
    country: '',
    year: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockData);

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(filters, term);
  };

  const applyFilters = (filterValues: typeof filters, search: string) => {
    let filtered = mockData;

    // Apply filters
    if (filterValues.pathogen) {
      filtered = filtered.filter(item => item.pathogen === filterValues.pathogen);
    }
    if (filterValues.omicsType) {
      filtered = filtered.filter(item => item.omicsType === filterValues.omicsType);
    }
    if (filterValues.country) {
      filtered = filtered.filter(item => item.country === filterValues.country);
    }
    if (filterValues.year) {
      filtered = filtered.filter(item => item.year.toString() === filterValues.year);
    }

    // Apply search
    if (search) {
      filtered = filtered.filter(item => 
        item.pathogen.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
    console.log('Filters applied:', { filterValues, search, resultCount: filtered.length });
  };

  const clearFilters = () => {
    setFilters({ pathogen: '', omicsType: '', country: '', year: '' });
    setSearchTerm('');
    setFilteredData(mockData);
    console.log('Filters cleared');
  };

  return (
    <div className="space-y-6" data-testid="data-explorer">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Data Explorer</h2>
          <p className="text-muted-foreground">Search and filter multi-omics STI pathogen datasets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => console.log('Export triggered')} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => console.log('Refresh triggered')} data-testid="button-refresh">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by pathogen name or dataset ID..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.pathogen} onValueChange={(value) => handleFilterChange('pathogen', value)}>
              <SelectTrigger data-testid="select-pathogen">
                <SelectValue placeholder="Select Pathogen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pathogens</SelectItem>
                <SelectItem value="Chlamydia trachomatis">Chlamydia trachomatis</SelectItem>
                <SelectItem value="Neisseria gonorrhoeae">Neisseria gonorrhoeae</SelectItem>
                <SelectItem value="Treponema pallidum">Treponema pallidum</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.omicsType} onValueChange={(value) => handleFilterChange('omicsType', value)}>
              <SelectTrigger data-testid="select-omics-type">
                <SelectValue placeholder="Omics Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Genomics">Genomics</SelectItem>
                <SelectItem value="Proteomics">Proteomics</SelectItem>
                <SelectItem value="Transcriptomics">Transcriptomics</SelectItem>
                <SelectItem value="Metabolomics">Metabolomics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger data-testid="select-country">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
              <SelectTrigger data-testid="select-year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {mockData.length} datasets
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table" data-testid="tab-table">Table View</TabsTrigger>
          <TabsTrigger value="cards" data-testid="tab-cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dataset ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pathogen</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Omics Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Year</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Samples</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Resistance Markers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="border-b hover-elevate cursor-pointer" 
                          onClick={() => console.log('Row clicked:', item.id)} data-testid={`row-dataset-${item.id}`}>
                        <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{item.pathogen}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{item.omicsType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.country}</td>
                        <td className="px-4 py-3 text-sm">{item.year}</td>
                        <td className="px-4 py-3 text-sm">{item.sampleCount}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.resistanceMarkers.map((marker) => (
                              <Badge key={marker} variant="outline" className="text-xs bg-scientific-amber/10 text-scientific-amber border-scientific-amber/20">
                                {marker}
                              </Badge>
                            ))}
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

        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <Card key={item.id} className="hover-elevate cursor-pointer" 
                    onClick={() => console.log('Card clicked:', item.id)} data-testid={`card-dataset-${item.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{item.id}</CardTitle>
                    <Badge variant="secondary">{item.omicsType}</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.pathogen}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{item.country}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Year:</span>
                    <span>{item.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Samples:</span>
                    <span>{item.sampleCount}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Resistance Markers:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.resistanceMarkers.map((marker) => (
                        <Badge key={marker} variant="outline" className="text-xs bg-scientific-amber/10 text-scientific-amber border-scientific-amber/20">
                          {marker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}