import { LAYER_CONFIGS } from '@nn-builder/shared'
import type { Layer } from '@nn-builder/shared'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Settings, Trash2, Copy } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface LayerCardProps {
  layer: Layer
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  index: number
}

export function LayerCard({
  layer,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  index,
}: LayerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const config = LAYER_CONFIGS[layer.type]

  // Get key parameters to display
  const getKeyParams = () => {
    const params: string[] = []

    switch (layer.type) {
      case 'input':
        params.push(`Shape: [${layer.shape.join(', ')}]`)
        break
      case 'conv2d':
        params.push(`${layer.filters} filters`)
        params.push(`${layer.kernelSize}×${layer.kernelSize}`)
        if (layer.activation) params.push(layer.activation)
        break
      case 'conv3d':
        params.push(`${layer.filters} filters`)
        params.push(`${layer.kernelSize}×${layer.kernelSize}×${layer.kernelSize}`)
        if (layer.activation) params.push(layer.activation)
        break
      case 'dense':
        params.push(`${layer.units} units`)
        if (layer.activation) params.push(layer.activation)
        break
      case 'dropout':
        params.push(`rate: ${layer.rate}`)
        break
      case 'pooling':
        params.push(`${layer.poolType} ${layer.poolSize}×${layer.poolSize}`)
        break
      case 'batchnorm':
        params.push(`axis: ${layer.axis}`)
        break
      case 'lstm':
      case 'gru':
        params.push(`${layer.units} units`)
        if (layer.returnSequences) params.push('seq')
        break
      case 'embedding':
        params.push(`${layer.inputDim}→${layer.outputDim}`)
        break
      case 'attention':
        params.push(`${layer.numHeads} heads`)
        params.push(`dim: ${layer.keyDim}`)
        break
    }

    return params
  }

  const categoryColors: Record<string, string> = {
    convolutional: 'border-blue-500/50 bg-blue-500/5',
    recurrent: 'border-purple-500/50 bg-purple-500/5',
    dense: 'border-green-500/50 bg-green-500/5',
    pooling: 'border-orange-500/50 bg-orange-500/5',
    normalization: 'border-pink-500/50 bg-pink-500/5',
    embedding: 'border-yellow-500/50 bg-yellow-500/5',
    attention: 'border-red-500/50 bg-red-500/5',
    regularization: 'border-gray-500/50 bg-gray-500/5',
    utility: 'border-cyan-500/50 bg-cyan-500/5',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`group relative cursor-pointer transition-all hover:shadow-lg ${
          isSelected
            ? 'ring-2 ring-primary shadow-lg'
            : categoryColors[config.category] || 'bg-accent'
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-3 p-4">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:bg-accent rounded p-1 touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Layer Index */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
            {index + 1}
          </div>

          {/* Layer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{config.icon}</span>
              <span className="font-semibold text-sm">{config.name}</span>
              {layer.name && (
                <span className="text-xs text-muted-foreground truncate">
                  ({layer.name})
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {getKeyParams().map((param, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {param}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
