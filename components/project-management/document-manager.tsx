
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  File,
  FolderOpen,
  Plus,
  Archive,
  Share,
  Clock,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface DocumentManagerProps {
  contractId: string
}

export function DocumentManager({ contractId }: DocumentManagerProps) {
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentCategory, setDocumentCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Mock documents data - would come from API
  const [documents] = useState([
    {
      id: '1',
      name: 'Contrato_Firmado.pdf',
      category: 'contracts',
      size: '2.4 MB',
      type: 'application/pdf',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'Juan Pérez',
      version: '1.0',
      status: 'approved'
    },
    {
      id: '2',
      name: 'Especificaciones_Técnicas.docx',
      category: 'technical',
      size: '1.8 MB',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date('2024-01-20'),
      uploadedBy: 'María González',
      version: '2.1',
      status: 'draft'
    },
    {
      id: '3',
      name: 'Cronograma_Proyecto.xlsx',
      category: 'planning',
      size: '856 KB',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedAt: new Date('2024-01-25'),
      uploadedBy: 'Carlos Rodriguez',
      version: '1.0',
      status: 'approved'
    },
    {
      id: '4',
      name: 'Diagramas_Arquitectura.png',
      category: 'technical',
      size: '3.2 MB',
      type: 'image/png',
      uploadedAt: new Date('2024-02-01'),
      uploadedBy: 'Ana Torres',
      version: '1.0',
      status: 'review'
    }
  ])

  const categories = [
    { value: 'all', label: 'Todos los documentos' },
    { value: 'contracts', label: 'Contratos' },
    { value: 'technical', label: 'Documentación técnica' },
    { value: 'planning', label: 'Planificación' },
    { value: 'reports', label: 'Reportes' },
    { value: 'presentations', label: 'Presentaciones' },
    { value: 'other', label: 'Otros' }
  ]

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-600" />
    if (type.includes('word')) return <FileText className="h-6 w-6 text-blue-600" />
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileText className="h-6 w-6 text-green-600" />
    if (type.includes('image')) return <File className="h-6 w-6 text-purple-600" />
    return <File className="h-6 w-6 text-gray-600" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const handleFileUpload = async () => {
    if (!selectedFile || !documentCategory) {
      toast.error('Por favor selecciona un archivo y categoría')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('contractId', contractId)
      formData.append('category', documentCategory)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success('Documento subido exitosamente')
        setUploadDialog(false)
        setSelectedFile(null)
        setDocumentCategory('')
        // Refresh documents list
      } else {
        toast.error('Error al subir el documento')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const handleDownload = (documentId: string) => {
    // Implement download logic
    toast.success('Descarga iniciada')
  }

  const handleDelete = (documentId: string) => {
    // Implement delete logic
    toast.success('Documento eliminado')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestor de Documentos</h2>
          <p className="text-gray-600">
            Organiza y gestiona todos los documentos del proyecto
          </p>
        </div>
        <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Subir Documento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Nuevo Documento</DialogTitle>
              <DialogDescription>
                Selecciona el archivo y categoría para el documento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Archivo</Label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <div>
                <Label>Categoría</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleFileUpload}>Subir Documento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Archive className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aprobados</p>
                <p className="text-xl font-bold">
                  {documents.filter(d => d.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Revisión</p>
                <p className="text-xl font-bold">
                  {documents.filter(d => d.status === 'review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-xl font-bold">
                  {new Set(documents.map(d => d.category)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Documents List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDocuments.map(document => (
                  <div key={document.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getFileIcon(document.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{document.name}</h3>
                            <Badge className={getStatusColor(document.status)}>
                              {document.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Tamaño: {document.size}</span>
                            <span>Versión: {document.version}</span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {document.uploadedBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(document.uploadedAt, 'PPP', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(document.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map(document => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      {getFileIcon(document.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm truncate" title={document.name}>
                        {document.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">{document.size}</p>
                    </div>
                    <div className="flex justify-center">
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                    <div className="flex justify-center gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(document.id)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(document.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron documentos
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Sube el primer documento para comenzar'
              }
            </p>
            <Button onClick={() => setUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Subir Documento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
