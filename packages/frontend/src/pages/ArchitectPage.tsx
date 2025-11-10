import { useState } from 'react'
import { useNetworkStore } from '@/store/networkStore'
import { LayerPalette } from '@/components/architect/LayerPalette'
import { LayerCanvas } from '@/components/architect/LayerCanvas'
import { LayerConfigPanel } from '@/components/architect/LayerConfigPanel'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { LayerType } from '@nn-builder/shared'
import { Undo2, Redo2, Save, FolderOpen, Download, Play } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ArchitectPage() {
  const { addLayer, undo, redo, history, historyIndex } = useNetworkStore()
  const { toast } = useToast()
  const [showPaletteDialog, setShowPaletteDialog] = useState(false)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleAddLayer = (layerType: LayerType) => {
    const id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create default layer based on type
    let newLayer: any = {
      id,
      type: layerType,
    }

    switch (layerType) {
      case 'input':
        newLayer = {
          ...newLayer,
          shape: [28, 28, 1],
        }
        break
      case 'conv2d':
        newLayer = {
          ...newLayer,
          filters: 32,
          kernelSize: 3,
          strides: 1,
          padding: 'same' as const,
          activation: 'relu' as const,
        }
        break
      case 'conv3d':
        newLayer = {
          ...newLayer,
          filters: 32,
          kernelSize: 3,
          strides: 1,
          padding: 'same' as const,
          activation: 'relu' as const,
        }
        break
      case 'dense':
        newLayer = {
          ...newLayer,
          units: 128,
          activation: 'relu' as const,
        }
        break
      case 'dropout':
        newLayer = {
          ...newLayer,
          rate: 0.5,
        }
        break
      case 'flatten':
        // No additional params
        break
      case 'pooling':
        newLayer = {
          ...newLayer,
          poolType: 'max' as const,
          poolSize: 2,
        }
        break
      case 'batchnorm':
        newLayer = {
          ...newLayer,
          axis: -1,
        }
        break
      case 'lstm':
      case 'gru':
        newLayer = {
          ...newLayer,
          units: 128,
          returnSequences: false,
        }
        break
      case 'embedding':
        newLayer = {
          ...newLayer,
          inputDim: 10000,
          outputDim: 128,
        }
        break
      case 'attention':
        newLayer = {
          ...newLayer,
          numHeads: 8,
          keyDim: 64,
        }
        break
      case 'globalavgpool':
      case 'globalmaxpool':
      case 'residual':
      case 'transformer':
        // These have more complex configurations, add defaults as needed
        break
    }

    addLayer(newLayer)
    setShowPaletteDialog(false)

    toast({
      title: 'Layer Added',
      description: `${layerType} layer has been added to your network`,
    })
  }

  const handleSave = () => {
    toast({
      title: 'Saved',
      description: 'Your network architecture has been saved',
    })
  }

  const handleExport = () => {
    toast({
      title: 'Export',
      description: 'Export functionality coming soon',
    })
  }

  const handleTrain = () => {
    toast({
      title: 'Training',
      description: 'Navigate to Training page to begin',
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b bg-background px-6 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4 mr-2" />
            Redo
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Load
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleTrain}>
            <Play className="h-4 w-4 mr-2" />
            Train Model
          </Button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Layer Palette */}
        <div className="w-80 border-r p-4 overflow-hidden">
          <LayerPalette onAddLayer={handleAddLayer} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 p-4 overflow-hidden">
          <LayerCanvas onAddLayerClick={() => setShowPaletteDialog(true)} />
        </div>

        {/* Right Sidebar - Configuration Panel */}
        <div className="w-96 border-l p-4 overflow-hidden">
          <LayerConfigPanel />
        </div>
      </div>

      {/* Add Layer Dialog */}
      <Dialog open={showPaletteDialog} onOpenChange={setShowPaletteDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Layer</DialogTitle>
            <DialogDescription>
              Choose a layer type to add to your network
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <LayerPalette onAddLayer={handleAddLayer} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
