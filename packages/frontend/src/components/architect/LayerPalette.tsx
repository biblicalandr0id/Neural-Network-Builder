import { LAYER_CONFIGS } from '@nn-builder/shared'
import type { LayerType } from '@nn-builder/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useMemo } from 'react'

interface LayerPaletteProps {
  onAddLayer: (layerType: LayerType) => void
}

export function LayerPalette({ onAddLayer }: LayerPaletteProps) {
  const [search, setSearch] = useState('')

  const categories = useMemo(() => {
    const cats: Record<string, LayerType[]> = {}
    Object.values(LAYER_CONFIGS).forEach((config) => {
      if (!cats[config.category]) {
        cats[config.category] = []
      }
      cats[config.category].push(config.type)
    })
    return cats
  }, [])

  const filteredCategories = useMemo(() => {
    if (!search) return categories

    const filtered: Record<string, LayerType[]> = {}
    Object.entries(categories).forEach(([category, layers]) => {
      const matchingLayers = layers.filter((layerType) => {
        const config = LAYER_CONFIGS[layerType]
        return (
          config.name.toLowerCase().includes(search.toLowerCase()) ||
          config.description.toLowerCase().includes(search.toLowerCase()) ||
          config.category.toLowerCase().includes(search.toLowerCase())
        )
      })
      if (matchingLayers.length > 0) {
        filtered[category] = matchingLayers
      }
    })
    return filtered
  }, [categories, search])

  const categoryColors: Record<string, string> = {
    convolutional: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    recurrent: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    dense: 'bg-green-500/10 text-green-700 border-green-500/20',
    pooling: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    normalization: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
    embedding: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    attention: 'bg-red-500/10 text-red-700 border-red-500/20',
    regularization: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    utility: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Layer Palette</CardTitle>
        <CardDescription>Drag or click to add layers</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search layers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-6">
            {Object.entries(filteredCategories).map(([category, layers]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold capitalize mb-3 text-muted-foreground">
                  {category}
                </h3>
                <div className="space-y-2">
                  {layers.map((layerType) => {
                    const config = LAYER_CONFIGS[layerType]
                    return (
                      <button
                        key={layerType}
                        onClick={() => onAddLayer(layerType)}
                        className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                          categoryColors[category] || 'bg-accent'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{config.icon}</span>
                          <span className="font-semibold text-sm">
                            {config.name}
                          </span>
                        </div>
                        <p className="text-xs opacity-80 line-clamp-2">
                          {config.description}
                        </p>
                        {config.commonUses && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {config.commonUses.slice(0, 2).map((use) => (
                              <Badge
                                key={use}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {use}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
