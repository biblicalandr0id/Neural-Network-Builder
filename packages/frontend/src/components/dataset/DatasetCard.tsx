import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Eye, ChevronRight } from 'lucide-react'
import type { SampleDataset } from '@nn-builder/shared'

interface DatasetCardProps {
  dataset: SampleDataset
  onSelect: () => void
  onPreview: () => void
  isSelected?: boolean
}

export function DatasetCard({ dataset, onSelect, onPreview, isSelected }: DatasetCardProps) {
  const getDatasetIcon = (type: string) => {
    switch (type) {
      case 'image':
        return '🖼️'
      case 'text':
        return '📝'
      case 'audio':
        return '🔊'
      case 'video':
        return '🎬'
      case 'tabular':
        return '📊'
      default:
        return '📦'
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getDatasetIcon(dataset.type)}</span>
            <div>
              <CardTitle className="text-lg">{dataset.name}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {dataset.description}
              </CardDescription>
            </div>
          </div>
          {isSelected && (
            <Badge className="bg-primary">Selected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Samples</span>
            <span className="font-semibold">{dataset.files.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Classes</span>
            <span className="font-semibold">{dataset.classes}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Size</span>
            <span className="font-semibold">{dataset.size}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Shape</span>
            <span className="font-semibold">{dataset.shape}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            {isSelected ? (
              <>
                <ChevronRight className="h-4 w-4 mr-2" />
                Continue
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Select
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
