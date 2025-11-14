import { useState } from 'react'
import { SAMPLE_DATASETS } from '@nn-builder/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Database, Image, CheckCircle, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useDatasetStore } from '@/store/datasetStore'
import { datasetService } from '@/services/datasetService'

export function DatasetPage() {
  const { toast } = useToast()
  const { loadedData, setLoadedData, setLoading, isLoading } = useDatasetStore()
  const [loadedId, setLoadedId] = useState<string | null>(null)

  const handleLoadDataset = async (datasetId: string) => {
    try {
      setLoading(true)
      toast({
        title: 'Dataset loading...',
        description: `Loading ${SAMPLE_DATASETS[datasetId].name} dataset`,
      })

      const dataset = await datasetService.loadDataset(datasetId)
      setLoadedData(dataset.xs, dataset.ys, dataset.info)
      setLoadedId(datasetId)

      toast({
        title: 'Dataset loaded',
        description: `${dataset.info.numSamples} samples ready for training`,
      })
    } catch (error) {
      toast({
        title: 'Load failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      toast({
        title: 'Uploading file...',
        description: file.name,
      })

      const dataset = await datasetService.loadFromFile(file)
      setLoadedData(dataset.xs, dataset.ys, dataset.info)
      setLoadedId('custom')

      toast({
        title: 'File uploaded',
        description: `${dataset.info.numSamples} samples loaded`,
      })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dataset Manager</h1>
        <p className="text-muted-foreground">Load sample datasets or upload your own</p>
      </div>

      <div className="grid gap-6">
        {/* Current Dataset Info */}
        {loadedData.info && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Active Dataset
              </CardTitle>
              <CardDescription>Currently loaded for training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{loadedData.info.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Samples</p>
                  <p className="font-semibold">{loadedData.info.numSamples.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shape</p>
                  <p className="font-semibold">[{loadedData.info.shape.join(', ')}]</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classes</p>
                  <p className="font-semibold">{loadedData.info.numClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Custom Dataset</CardTitle>
            <CardDescription>Upload images, CSV, or JSON files</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="file-upload">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button type="button" disabled={isLoading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoading ? 'Loading...' : 'Choose Files'}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.json,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Supported Formats:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>CSV: Numeric features with last column as label</li>
                    <li>JSON: Object with "features" and "labels" arrays</li>
                    <li>Images: JPG, PNG (single image classification)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Datasets */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Sample Datasets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(SAMPLE_DATASETS).map((dataset) => (
              <Card key={dataset.id} className={loadedId === dataset.id ? 'border-primary' : ''}>
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
                  <Button
                    className="w-full"
                    onClick={() => handleLoadDataset(dataset.id)}
                    disabled={isLoading}
                    variant={loadedId === dataset.id ? 'secondary' : 'default'}
                  >
                    {loadedId === dataset.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Loaded
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Load Dataset
                      </>
                    )}
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
