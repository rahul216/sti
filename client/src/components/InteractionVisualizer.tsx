import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Download, ZoomIn, ZoomOut, RotateCcw, Play, Pause } from 'lucide-react';
import * as d3 from 'd3';

// Node and Link interfaces for D3
interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  group: string;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  strength: number;
  type: string;
}

// Mock network data - todo: remove mock functionality
const mockNetworkData = {
  'Chlamydia trachomatis': {
    nodes: [
      { id: 'CT_host', name: 'Host Cell', type: 'host', group: 'host' },
      { id: 'CT_pathogen', name: 'C. trachomatis', type: 'pathogen', group: 'pathogen' },
      { id: 'CT_protein1', name: 'MOMP', type: 'protein', group: 'pathogen' },
      { id: 'CT_protein2', name: 'IncA', type: 'protein', group: 'pathogen' },
      { id: 'CT_host_receptor', name: 'PDGFR', type: 'receptor', group: 'host' },
      { id: 'CT_immune', name: 'TLR2', type: 'immune', group: 'host' }
    ] as NetworkNode[],
    links: [
      { source: 'CT_pathogen', target: 'CT_host', strength: 0.9, type: 'adhesion' },
      { source: 'CT_protein1', target: 'CT_host_receptor', strength: 0.7, type: 'binding' },
      { source: 'CT_protein2', target: 'CT_immune', strength: 0.6, type: 'immune_evasion' },
      { source: 'CT_pathogen', target: 'CT_protein1', strength: 1.0, type: 'expression' },
      { source: 'CT_pathogen', target: 'CT_protein2', strength: 1.0, type: 'expression' }
    ] as NetworkLink[]
  },
  'Neisseria gonorrhoeae': {
    nodes: [
      { id: 'NG_host', name: 'Epithelial Cell', type: 'host', group: 'host' },
      { id: 'NG_pathogen', name: 'N. gonorrhoeae', type: 'pathogen', group: 'pathogen' },
      { id: 'NG_pili', name: 'Pili', type: 'protein', group: 'pathogen' },
      { id: 'NG_opa', name: 'Opa protein', type: 'protein', group: 'pathogen' },
      { id: 'NG_cd66', name: 'CD66', type: 'receptor', group: 'host' }
    ] as NetworkNode[],
    links: [
      { source: 'NG_pathogen', target: 'NG_host', strength: 0.8, type: 'invasion' },
      { source: 'NG_pili', target: 'NG_host', strength: 0.9, type: 'adhesion' },
      { source: 'NG_opa', target: 'NG_cd66', strength: 0.7, type: 'binding' },
      { source: 'NG_pathogen', target: 'NG_pili', strength: 1.0, type: 'expression' },
      { source: 'NG_pathogen', target: 'NG_opa', strength: 1.0, type: 'expression' }
    ] as NetworkLink[]
  }
};

export default function InteractionVisualizer() {
  const [selectedPathogen, setSelectedPathogen] = useState('Chlamydia trachomatis');
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const data = mockNetworkData[selectedPathogen as keyof typeof mockNetworkData];
    if (!data) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 600;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create groups for different layers
    const linkGroup = svg.append('g').attr('class', 'links');
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    // Color scale for different node types
    const colorScale = d3.scaleOrdinal()
      .domain(['host', 'pathogen', 'protein', 'receptor', 'immune'])
      .range(['#2E86AB', '#A23B72', '#F18F01', '#198754', '#6f42c1']);

    // Create simulation
    const simulation = d3.forceSimulation<NetworkNode>(data.nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(data.links).id((d) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    simulationRef.current = simulation;

    // Create links
    const links = linkGroup
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.strength * 5));

    // Create nodes
    const nodes = nodeGroup
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 12)
      .attr('fill', (d: any) => colorScale(d.type) as string)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, NetworkNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add labels
    const labels = nodeGroup
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text((d: any) => d.name)
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', 3)
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    // Node click handler
    nodes.on('click', (event, d) => {
      setSelectedNode(d);
      console.log('Node selected:', d);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

  }, [selectedPathogen]);

  const toggleSimulation = () => {
    if (simulationRef.current) {
      if (isSimulating) {
        simulationRef.current.stop();
      } else {
        simulationRef.current.restart();
      }
      setIsSimulating(!isSimulating);
      console.log('Simulation toggled:', !isSimulating);
    }
  };

  const resetView = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
      setSelectedNode(null);
      console.log('View reset');
    }
  };

  return (
    <div className="space-y-6" data-testid="interaction-visualizer">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Host-Pathogen Interaction Visualizer</h2>
          <p className="text-muted-foreground">Explore molecular interactions and network topology</p>
        </div>
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Interactive Network</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Network Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Pathogen:</label>
              <Select value={selectedPathogen} onValueChange={setSelectedPathogen}>
                <SelectTrigger data-testid="select-pathogen-network">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chlamydia trachomatis">Chlamydia trachomatis</SelectItem>
                  <SelectItem value="Neisseria gonorrhoeae">Neisseria gonorrhoeae</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Simulation Controls:</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleSimulation}
                  data-testid="button-toggle-simulation"
                >
                  {isSimulating ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={resetView} data-testid="button-reset-view">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Legend:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2E86AB]"></div>
                  <span className="text-xs">Host</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#A23B72]"></div>
                  <span className="text-xs">Pathogen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F18F01]"></div>
                  <span className="text-xs">Protein</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#198754]"></div>
                  <span className="text-xs">Receptor</span>
                </div>
              </div>
            </div>

            {selectedNode && (
              <div className="space-y-2 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Selected Node:</p>
                <div className="space-y-1">
                  <p className="text-sm"><strong>Name:</strong> {selectedNode.name}</p>
                  <p className="text-sm"><strong>Type:</strong> {selectedNode.type}</p>
                  <Badge variant="secondary" className="text-xs">{selectedNode.group}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interaction Network</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => console.log('Zoom in')} data-testid="button-zoom-in">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Zoom out')} data-testid="button-zoom-out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Export network')} data-testid="button-export-network">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-background p-4">
              <svg ref={svgRef} className="w-full h-96"></svg>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Click and drag nodes to explore the network. Click nodes to see details in the control panel.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>Network Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList>
              <TabsTrigger value="metrics" data-testid="tab-metrics">Network Metrics</TabsTrigger>
              <TabsTrigger value="pathways" data-testid="tab-pathways">Key Pathways</TabsTrigger>
              <TabsTrigger value="clusters" data-testid="tab-clusters">Community Clusters</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">6</p>
                      <p className="text-sm text-muted-foreground">Total Nodes</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-scientific-rose">5</p>
                      <p className="text-sm text-muted-foreground">Interactions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-scientific-amber">2.1</p>
                      <p className="text-sm text-muted-foreground">Avg Degree</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-scientific-green">0.83</p>
                      <p className="text-sm text-muted-foreground">Density</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pathways" className="space-y-4">
              <div className="space-y-3">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold">Adhesion Pathway</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Primary mechanism for pathogen attachment to host cells
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">MOMP</Badge>
                      <Badge variant="outline" className="text-xs">PDGFR</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-scientific-rose">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold">Immune Evasion</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mechanisms to avoid host immune detection
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">IncA</Badge>
                      <Badge variant="outline" className="text-xs">TLR2</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clusters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-primary">Host Cluster</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Host cell components and receptors
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Host Cell</span>
                        <Badge variant="secondary">Central</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>PDGFR</span>
                        <Badge variant="secondary">Receptor</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>TLR2</span>
                        <Badge variant="secondary">Immune</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-scientific-rose">Pathogen Cluster</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Pathogen and virulence factors
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>C. trachomatis</span>
                        <Badge variant="secondary">Core</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>MOMP</span>
                        <Badge variant="secondary">Adhesin</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>IncA</span>
                        <Badge variant="secondary">Effector</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}