
'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Edit, 
  MessageCircle, 
  FileText,
  Pen,
  Square,
  Circle,
  Type,
  Eraser,
  Download,
  Share,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Pin
} from 'lucide-react'
import { PresenceIndicator } from './presence-indicator'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface CollaborationSpaceProps {
  userId: string
  activeContracts: any[]
}

export function CollaborationSpace({ userId, activeContracts }: CollaborationSpaceProps) {
  const [activeBoard, setActiveBoard] = useState<string | null>(null)
  const [drawingMode, setDrawingMode] = useState('pen')
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'Juan Pérez', avatar: 'JP', color: '#3b82f6', cursor: { x: 0, y: 0 } },
    { id: '2', name: 'María González', avatar: 'MG', color: '#ef4444', cursor: { x: 0, y: 0 } }
  ])
  const [comments, setComments] = useState([
    {
      id: '1',
      userId: '1',
      userName: 'Juan Pérez',
      content: '¿Podríamos revisar esta parte del diagrama?',
      position: { x: 200, y: 150 },
      createdAt: new Date(),
      isResolved: false,
      replies: []
    }
  ])
  const [newComment, setNewComment] = useState('')
  const [selectedTool, setSelectedTool] = useState('pen')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Mock collaboration boards
  const collaborationBoards = [
    {
      id: '1',
      title: 'Arquitectura SAP S/4HANA',
      contractId: activeContracts[0]?.id,
      type: 'whiteboard',
      lastModified: new Date(),
      collaborators: ['Juan Pérez', 'María González'],
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Flujo de Procesos',
      contractId: activeContracts[0]?.id,
      type: 'diagram',
      lastModified: new Date(Date.now() - 3600000),
      collaborators: ['Carlos Rodriguez'],
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Timeline del Proyecto',
      contractId: activeContracts[1]?.id,
      type: 'timeline',
      lastModified: new Date(Date.now() - 7200000),
      collaborators: ['Ana Torres', 'Luis Mendez'],
      thumbnail: '/api/placeholder/300/200'
    }
  ]

  // Mock shared documents
  const sharedDocuments = [
    {
      id: '1',
      title: 'Especificaciones Técnicas v2.1',
      type: 'document',
      contractId: activeContracts[0]?.id,
      lastEditor: 'Juan Pérez',
      lastModified: new Date(),
      comments: 5,
      isLocked: false
    },
    {
      id: '2',
      title: 'Plan de Implementación',
      type: 'spreadsheet',
      contractId: activeContracts[0]?.id,
      lastEditor: 'María González',
      lastModified: new Date(Date.now() - 1800000),
      comments: 12,
      isLocked: true
    }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize canvas
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [activeBoard])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineWidth = selectedTool === 'pen' ? 2 : 10
      ctx.lineCap = 'round'
      ctx.strokeStyle = selectedTool === 'eraser' ? 'white' : '#000000'
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const addComment = (x: number, y: number) => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      userId,
      userName: 'Tú',
      content: newComment,
      position: { x, y },
      createdAt: new Date(),
      isResolved: false,
      replies: []
    }

    setComments([...comments, comment])
    setNewComment('')
    toast.success('Comentario agregado')
  }

  const resolveComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isResolved: true }
        : comment
    ))
    toast.success('Comentario resuelto')
  }

  const shareBoard = async (boardId: string) => {
    try {
      const shareLink = `${window.location.origin}/colaboracion/board/${boardId}`
      await navigator.clipboard.writeText(shareLink)
      toast.success('Enlace copiado al portapapeles')
    } catch (error) {
      toast.error('Error al copiar enlace')
    }
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Espacio de Colaboración</h2>
          <p className="text-gray-600">
            Trabaja en tiempo real con tu equipo en whiteboards y documentos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {collaborators.map(collaborator => (
              <div key={collaborator.id} className="relative">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback style={{ backgroundColor: collaborator.color }}>
                    {collaborator.avatar}
                  </AvatarFallback>
                </Avatar>
                <PresenceIndicator 
                  status="online" 
                  size="small" 
                  className="absolute -bottom-1 -right-1"
                />
              </div>
            ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Espacio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Espacio de Colaboración</DialogTitle>
                <DialogDescription>
                  Selecciona el tipo de espacio colaborativo que deseas crear
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Edit className="h-6 w-6" />
                  Whiteboard
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Documento
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Sala de Ideas
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Collaboration Tabs */}
      <Tabs defaultValue="boards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="boards">Pizarras Colaborativas</TabsTrigger>
          <TabsTrigger value="documents">Documentos Compartidos</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones Activas</TabsTrigger>
        </TabsList>

        <TabsContent value="boards" className="space-y-6">
          {activeBoard ? (
            /* Active Whiteboard */
            <Card className="h-[600px]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setActiveBoard(null)}>
                      ← Volver
                    </Button>
                    <CardTitle>Arquitectura SAP S/4HANA</CardTitle>
                    <Badge className="bg-green-100 text-green-800">En vivo</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {collaborators.map(collaborator => (
                        <Avatar key={collaborator.id} className="h-6 w-6 border border-white">
                          <AvatarFallback style={{ backgroundColor: collaborator.color, fontSize: '10px' }}>
                            {collaborator.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => shareBoard(activeBoard)}>
                      <Share className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                {/* Drawing Tools */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant={selectedTool === 'pen' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('pen')}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'eraser' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('eraser')}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('text')}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'rectangle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('rectangle')}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'circle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('circle')}
                  >
                    <Circle className="h-4 w-4" />
                  </Button>
                  <div className="ml-4 flex items-center gap-2">
                    <Input
                      placeholder="Añadir comentario..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-48"
                      onKeyPress={(e) => e.key === 'Enter' && addComment(100, 100)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full border cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                
                {/* Comments Overlay */}
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    className="absolute bg-yellow-100 border border-yellow-300 rounded-lg p-2 min-w-48 max-w-64 shadow-lg z-10"
                    style={{ left: comment.position.x, top: comment.position.y }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-yellow-800">
                        {comment.userName}
                      </span>
                      <div className="flex items-center gap-1">
                        {!comment.isResolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => resolveComment(comment.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-700 mb-2">{comment.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-600">
                        {format(comment.createdAt, 'HH:mm')}
                      </span>
                      {comment.isResolved && (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            /* Boards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborationBoards.map(board => (
                <Card key={board.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div 
                      className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center"
                      onClick={() => setActiveBoard(board.id)}
                    >
                      <Edit className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm">{board.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {board.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Modificado {format(board.lastModified, 'PPP', { locale: es })}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {board.collaborators.slice(0, 3).map((collaborator, index) => (
                            <Avatar key={index} className="h-6 w-6 border border-white">
                              <AvatarFallback className="text-xs">
                                {collaborator.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {board.collaborators.length > 3 && (
                            <div className="h-6 w-6 bg-gray-200 rounded-full border border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{board.collaborators.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Share className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-4">
            {sharedDocuments.map(doc => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{doc.title}</h3>
                          {doc.isLocked && (
                            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                              Editando: {doc.lastEditor}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Última edición por {doc.lastEditor}</span>
                          <span>{format(doc.lastModified, 'PPP HH:mm', { locale: es })}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {doc.comments} comentarios
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" disabled={doc.isLocked}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sesiones Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium text-sm">Sesión de Arquitectura</p>
                        <p className="text-xs text-gray-600">3 participantes activos</p>
                      </div>
                    </div>
                    <Button size="sm">Unirse</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium text-sm">Revisión de Documentos</p>
                        <p className="text-xs text-gray-600">1 participante activo</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Ver</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Juan Pérez</span> añadió comentarios en el whiteboard
                      </p>
                      <p className="text-xs text-gray-500">Hace 5 minutos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">María González</span> editó las especificaciones técnicas
                      </p>
                      <p className="text-xs text-gray-500">Hace 15 minutos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>CR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Carlos Rodriguez</span> creó un nuevo diagrama de flujo
                      </p>
                      <p className="text-xs text-gray-500">Hace 1 hora</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
