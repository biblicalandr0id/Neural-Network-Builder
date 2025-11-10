import { useNetworkStore } from '@/store/networkStore'
import { LayerCard } from './LayerCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowDown } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface LayerCanvasProps {
  onAddLayerClick: () => void
}

export function LayerCanvas({ onAddLayerClick }: LayerCanvasProps) {
  const {
    config,
    selectedLayerId,
    selectLayer,
    deleteLayer,
    duplicateLayer,
    reorderLayers,
  } = useNetworkStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = config.layers.findIndex((l) => l.id === active.id)
      const newIndex = config.layers.findIndex((l) => l.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(config.layers, oldIndex, newIndex)
        reorderLayers(newOrder)
      }
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 overflow-auto p-6">
        {config.layers.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No layers yet</h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-sm">
                Start building your neural network by adding layers from the
                palette on the left.
              </p>
              <Button onClick={onAddLayerClick}>Add Your First Layer</Button>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="max-w-4xl mx-auto space-y-4">
              <SortableContext
                items={config.layers.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {config.layers.map((layer, index) => (
                  <div key={layer.id}>
                    <LayerCard
                      layer={layer}
                      index={index}
                      isSelected={selectedLayerId === layer.id}
                      onSelect={() => selectLayer(layer.id)}
                      onDelete={() => deleteLayer(layer.id)}
                      onDuplicate={() => duplicateLayer(layer.id)}
                    />
                    {index < config.layers.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </SortableContext>

              {/* Add Layer Button */}
              <Button
                variant="outline"
                className="w-full h-16 border-dashed"
                onClick={onAddLayerClick}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Layer
              </Button>
            </div>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}
