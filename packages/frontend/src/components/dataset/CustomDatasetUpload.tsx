import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, File, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { DatasetType } from '@nn-builder/shared'

interface CustomDatasetUploadProps {
  onUpload: (files: File[], datasetType: DatasetType) => void
}

export function CustomDatasetUpload({ onUpload }: CustomDatasetUploadProps) {
  const { toast } = useToast()
  const [datasetType, setDatasetType] = useState<DatasetType>('image')
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])

    toast({
      title: 'Files Added',
      description: `${droppedFiles.length} file(s) added to upload queue`,
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])

      toast({
        title: 'Files Selected',
        description: `${selectedFiles.length} file(s) selected`,
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: 'No Files',
        description: 'Please select files to upload',
        variant: 'destructive',
      })
      return
    }

    onUpload(files, datasetType)
    setFiles([])

    toast({
      title: 'Upload Started',
      description: 'Processing your dataset...',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Custom Dataset</CardTitle>
        <CardDescription>
          Upload your own images, text, or other data files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Dataset Type</Label>
          <Select
            value={datasetType}
            onValueChange={(value) => setDatasetType(value as DatasetType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="tabular">Tabular (CSV)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports images, CSV, JSON, and text files
          </p>
          <Input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            accept={
              datasetType === 'image'
                ? 'image/*'
                : datasetType === 'tabular'
                ? '.csv,.json'
                : '*'
            }
          />
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>Browse Files</span>
            </Button>
          </label>
        </div>

        {files.length > 0 && (
          <div>
            <Label>Selected Files ({files.length})</Label>
            <div className="mt-2 max-h-48 overflow-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <File className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={files.length === 0}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload {files.length > 0 && `${files.length} File(s)`}
        </Button>
      </CardContent>
    </Card>
  )
}
