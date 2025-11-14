import { SAMPLE_DATASETS } from '@nn-builder/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Database, Image } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function DatasetPage() {
  const { toast } = useToast()

  const handleLoadDataset = (datasetId: string) => {
    toast({
      title: 'Dataset loading...',
      description: `Loading ${SAMPLE_DATASETS[datasetId].name} dataset`,
    })
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dataset Manager</h1>
        <p className="text-muted-foreground">Load sample datasets or upload your own</p>
      </div>

      <div className="grid gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Custom Dataset</CardTitle>
            <CardDescription>Upload images, CSV, or JSON files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 hover:border-primary transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files here, or click to browse
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sample Datasets */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Sample Datasets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(SAMPLE_DATASETS).map((dataset) => (
              <Card key={dataset.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{dataset.name}</CardTitle>
                      <CardDescription>{dataset.description}</CardDescription>
                    </div>
                    {dataset.type === 'images' ? (
                      <Image className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Database className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Files:</span> {dataset.files.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Classes:</span> {dataset.classes}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span> {dataset.size}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shape:</span> {dataset.shape}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{dataset.type}</Badge>
                    <Badge variant="secondary">{dataset.task}</Badge>
                  </div>
                  <Button className="w-full" onClick={() => handleLoadDataset(dataset.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Load Dataset
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
