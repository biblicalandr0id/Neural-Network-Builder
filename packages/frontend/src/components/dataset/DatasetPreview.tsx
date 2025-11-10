import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SampleDataset } from '@nn-builder/shared'

interface DatasetPreviewProps {
  dataset: SampleDataset | null
  open: boolean
  onClose: () => void
}

export function DatasetPreview({ dataset, open, onClose }: DatasetPreviewProps) {
  if (!dataset) return null

  // Sample data visualization (placeholder)
  const sampleImages = Array.from({ length: 16 }, (_, i) => i)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">
              {dataset.type === 'image' ? '🖼️' : '📦'}
            </span>
            {dataset.name}
          </DialogTitle>
          <DialogDescription>{dataset.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Total Samples</p>
                <p className="text-2xl font-bold">
                  {dataset.files.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">{dataset.classes}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{dataset.size}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Input Shape</p>
                <p className="text-2xl font-bold">{dataset.shape}</p>
              </div>
            </div>

            {dataset.url && (
              <div className="p-4 rounded-lg border">
                <p className="text-sm font-semibold mb-2">Data Source</p>
                <a
                  href={dataset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {dataset.url}
                </a>
              </div>
            )}

            <div className="p-4 rounded-lg border">
              <p className="text-sm font-semibold mb-2">Description</p>
              <p className="text-sm text-muted-foreground">
                {dataset.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="samples">
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Sample visualization (coming soon)
              </p>
              <div className="grid grid-cols-8 gap-2">
                {sampleImages.map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Class Distribution</p>
                <div className="space-y-2">
                  {Array.from({ length: Math.min(dataset.classes, 10) }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="outline">Class {i}</Badge>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.random() * 40 + 60}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 5000 + 5000)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Data Split</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Training Set</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Validation Set</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Test Set</span>
                    <span className="font-semibold">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
