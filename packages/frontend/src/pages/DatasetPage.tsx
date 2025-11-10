import { useState } from 'react'
import { SAMPLE_DATASETS } from '@nn-builder/shared'
import type { SampleDataset, DatasetType } from '@nn-builder/shared'
import { DatasetCard } from '@/components/dataset/DatasetCard'
import { CustomDatasetUpload } from '@/components/dataset/CustomDatasetUpload'
import { DatasetPreview } from '@/components/dataset/DatasetPreview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export function DatasetPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [previewDataset, setPreviewDataset] = useState<SampleDataset | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<DatasetType | 'all'>('all')

  const datasets = Object.values(SAMPLE_DATASETS)

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(search.toLowerCase()) ||
      dataset.description.toLowerCase().includes(search.toLowerCase())

    const matchesType = filterType === 'all' || dataset.type === filterType

    return matchesSearch && matchesType
  })

  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDataset(datasetId)
    toast({
      title: 'Dataset Selected',
      description: `${SAMPLE_DATASETS[datasetId].name} is now selected`,
    })
  }

  const handleCustomUpload = (files: File[], datasetType: DatasetType) => {
    console.log('Uploading files:', files, 'Type:', datasetType)
    // TODO: Implement actual upload logic
  }

  const handleContinue = () => {
    if (!selectedDataset) {
      toast({
        title: 'No Dataset Selected',
        description: 'Please select a dataset to continue',
        variant: 'destructive',
      })
      return
    }

    navigate('/architect')
    toast({
      title: 'Dataset Loaded',
      description: 'You can now build your network architecture',
    })
  }

  const datasetTypes = ['all', 'image', 'text', 'audio', 'video', 'tabular'] as const

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dataset Manager</h1>
            <p className="text-sm text-muted-foreground">
              Choose from sample datasets or upload your own
            </p>
          </div>
          <Button
            onClick={handleContinue}
            disabled={!selectedDataset}
            size="lg"
          >
            Continue to Architecture
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="sample" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="sample">Sample Datasets</TabsTrigger>
            <TabsTrigger value="custom">Custom Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="sample">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search datasets..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Type Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-1">
                      {datasetTypes.map((type) => (
                        <Badge
                          key={type}
                          variant={filterType === type ? 'default' : 'outline'}
                          className="cursor-pointer capitalize"
                          onClick={() => setFilterType(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dataset Grid */}
            {selectedDataset && (
              <Card className="mb-6 bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Dataset</CardTitle>
                  <CardDescription>
                    {SAMPLE_DATASETS[selectedDataset].name} -{' '}
                    {SAMPLE_DATASETS[selectedDataset].description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Samples</p>
                        <p className="font-semibold">
                          {SAMPLE_DATASETS[selectedDataset].files.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Classes</p>
                        <p className="font-semibold">
                          {SAMPLE_DATASETS[selectedDataset].classes}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Shape</p>
                        <p className="font-semibold">
                          {SAMPLE_DATASETS[selectedDataset].shape}
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleContinue}>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No datasets found matching your criteria
                  </p>
                </div>
              ) : (
                filteredDatasets.map((dataset) => (
                  <DatasetCard
                    key={dataset.id}
                    dataset={dataset}
                    isSelected={selectedDataset === dataset.id}
                    onSelect={() => handleDatasetSelect(dataset.id)}
                    onPreview={() => setPreviewDataset(dataset)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="max-w-2xl mx-auto">
              <CustomDatasetUpload onUpload={handleCustomUpload} />

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Image Datasets</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Organize images in folders by class name</li>
                      <li>Supported formats: PNG, JPEG, WebP</li>
                      <li>Recommended size: 224×224 or higher</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Tabular Datasets</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Upload CSV or JSON files</li>
                      <li>First row should contain column headers</li>
                      <li>Target column should be named 'label' or 'target'</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Text Datasets</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>One text sample per file or line</li>
                      <li>UTF-8 encoding required</li>
                      <li>Include labels in filename or separate file</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <DatasetPreview
        dataset={previewDataset}
        open={previewDataset !== null}
        onClose={() => setPreviewDataset(null)}
      />
    </div>
  )
}
