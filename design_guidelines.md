# Multi-Omics STI Pathogen Research Platform Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from NCBI's data portal and Cytoscape web interfaces, emphasizing scientific data presentation and interactive biological network visualizations. This approach prioritizes utility and functionality for research workflows while maintaining professional scientific aesthetics.

## Core Design Principles
- **Scientific Clarity**: Clean, uncluttered interface that prioritizes data visibility
- **Research Workflow Optimization**: Tabbed sections and logical information hierarchy
- **Interactive Data Focus**: Emphasis on filterable tables, graphs, and network visualizations

## Color Palette

### Primary Colors
- **Primary Blue**: 207 61% 42% (#2E86AB) - Main brand color for headers, primary buttons
- **Secondary Rose**: 336 46% 38% (#A23B72) - Secondary actions, highlights
- **Accent Amber**: 38 94% 47% (#F18F01) - Alerts, important indicators, success states

### Neutral Colors
- **Background Light**: 220 14% 98% (#F8F9FA) - Main background
- **Text Dark**: 210 11% 15% (#212529) - Primary text
- **Success Green**: 140 65% 35% (#198754) - Success indicators

### Dark Mode Adaptation
- Background: 220 13% 10%
- Text: 220 14% 95%
- Primary Blue: 207 55% 52%
- Secondary Rose: 336 40% 48%

## Typography
- **Primary**: Source Sans Pro (headers, UI elements)
- **Secondary**: Roboto (body text, data labels)
- **Monospace**: JetBrains Mono (code, sequence data, technical content)

## Layout System
**Tailwind Spacing Units**: Consistent use of 4, 8, 16, and 20 (p-4, m-8, space-x-16, gap-20) for clean, scientific spacing that accommodates dense data presentation.

## Component Library

### Navigation
- **Tab-based navigation** for main sections (Data Explorer, Resistance Predictor, Interaction Visualizer, Dataset Management)
- **Breadcrumb navigation** for deep data exploration
- **Secondary navigation** within each major section

### Data Tables
- **Sortable headers** with clear visual indicators
- **Filter controls** integrated into table headers
- **Pagination** with result count display
- **Row hover states** for better data scanning

### Forms & Inputs
- **File upload areas** with drag-drop functionality for FASTA sequences
- **Multi-select dropdowns** for pathogen and metadata filtering
- **Search inputs** with autocomplete for gene names and identifiers
- **Parameter sliders** for ML model thresholds

### Data Visualization
- **Interactive network graphs** with zoom and pan capabilities
- **Data export buttons** for charts and tables
- **Graph legends** with toggle functionality
- **Tooltip overlays** for detailed data points

### Scientific UI Elements
- **Sequence viewers** with syntax highlighting
- **Resistance marker badges** with confidence scores
- **Metadata cards** showing sample information
- **Progress indicators** for long-running analyses

## Visual Hierarchy
1. **Primary Actions**: Amber accent color for key research actions
2. **Secondary Actions**: Primary blue for navigation and standard operations  
3. **Data Content**: High contrast text on light backgrounds
4. **Supporting Information**: Muted colors for metadata and supplementary content

## Responsive Behavior
- **Desktop-first approach** optimized for research workstations
- **Collapsible side panels** for filters and metadata on smaller screens
- **Horizontal scrolling** for wide data tables when needed
- **Stacked layouts** for visualization panels on mobile

## Animation Guidelines
**Minimal animations** limited to:
- **Loading indicators** for data queries and ML processing
- **Smooth transitions** for tab switching
- **Hover effects** on interactive elements
- **Network graph interactions** (zoom, pan, node selection)

This design framework ensures the platform maintains scientific credibility while providing an intuitive interface for complex multi-omics data analysis workflows.