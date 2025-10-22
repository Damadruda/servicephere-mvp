
'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Settings,
  Users,
  Calendar,
  Clock,
  Plus,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeOff
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface VideoCallCenterProps {
  userId: string
}

export function VideoCallCenter({ userId }: VideoCallCenterProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [participants, setParticipants] = useState([
    { id: '1', name: 'Juan Pérez', avatar: 'JP', status: 'connected' },
    { id: '2', name: 'María González', avatar: 'MG', status: 'connecting' }
  ])

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Mock scheduled meetings
  const scheduledMeetings = [
    {
      id: '1',
      title: 'Revisión de Proyecto SAP S/4HANA',
      participants: ['Juan Pérez', 'María González', 'Carlos Rodriguez'],
      scheduledTime: new Date('2024-09-08T14:00:00'),
      duration: 60,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Demo del Prototipo',
      participants: ['Ana Torres', 'Luis Mendez'],
      scheduledTime: new Date('2024-09-08T16:30:00'),
      duration: 30,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Reunión de Seguimiento',
      participants: ['Cliente ABC', 'Equipo de Desarrollo'],
      scheduledTime: new Date('2024-09-07T10:00:00'),
      duration: 45,
      status: 'completed'
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const startCall = async () => {
    try {
      // Initialize camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled, 
        audio: isAudioEnabled 
      })
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      setIsCallActive(true)
      setCallDuration(0)
      toast.success('Llamada iniciada')
    } catch (error) {
      toast.error('Error al acceder a cámara/micrófono')
    }
  }

  const endCall = () => {
    // Stop all streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    
    setIsCallActive(false)
    setCallDuration(0)
    setIsScreenSharing(false)
    setIsRecording(false)
    toast.success('Llamada finalizada')
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    toast.info(isVideoEnabled ? 'Cámara desactivada' : 'Cámara activada')
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    toast.info(isAudioEnabled ? 'Micrófono silenciado' : 'Micrófono activado')
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setIsScreenSharing(true)
        toast.success('Compartiendo pantalla')
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoEnabled, 
          audio: isAudioEnabled 
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setIsScreenSharing(false)
        toast.success('Pantalla compartida finalizada')
      }
    } catch (error) {
      toast.error('Error al compartir pantalla')
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    toast.info(isRecording ? 'Grabación detenida' : 'Grabación iniciada')
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Video Call Interface */}
      {isCallActive ? (
        <Card className="bg-black">
          <CardContent className="p-0">
            <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
              {/* Main Video */}
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              
              {/* Local Video */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              </div>

              {/* Call Info */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">En llamada</span>
                  <span className="text-sm">{formatDuration(callDuration)}</span>
                </div>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Square className="h-3 w-3 fill-current" />
                    <span className="text-sm font-medium">Grabando</span>
                  </div>
                </div>
              )}

              {/* Participants Info */}
              <div className="absolute bottom-20 left-4 right-4">
                <div className="flex items-center gap-2 mb-4">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-2 bg-black/50 text-white px-3 py-2 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                        {participant.avatar}
                      </div>
                      <span className="text-sm">{participant.name}</span>
                      <Badge className={`
                        ${participant.status === 'connected' ? 'bg-green-500' : 
                          participant.status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}
                      `}>
                        {participant.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-4 bg-black/70 px-6 py-4 rounded-full">
                  <Button
                    variant={isAudioEnabled ? "secondary" : "destructive"}
                    size="sm"
                    onClick={toggleAudio}
                    className="rounded-full"
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isVideoEnabled ? "secondary" : "destructive"}
                    size="sm"
                    onClick={toggleVideo}
                    className="rounded-full"
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant={isScreenSharing ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleScreenShare}
                    className="rounded-full"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>

                  <Button
                    variant={isRecording ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleRecording}
                    className="rounded-full"
                  >
                    {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={endCall}
                    className="rounded-full"
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Video Call Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Iniciar Video Llamada
              </CardTitle>
              <CardDescription>
                Inicia una llamada inmediata o programa una reunión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={startCall} className="h-20 flex-col gap-2">
                  <Video className="h-6 w-6" />
                  Llamada Rápida
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Calendar className="h-6 w-6" />
                      Programar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Programar Reunión</DialogTitle>
                      <DialogDescription>
                        Configura una nueva reunión por video
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Título</label>
                        <Input placeholder="Nombre de la reunión" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Fecha</label>
                          <Input type="date" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Hora</label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duración (minutos)</label>
                        <Input type="number" defaultValue={30} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Participantes</label>
                        <Input placeholder="Agregar emails..." />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isVideoEnabled} onChange={toggleVideo} />
                  <label className="text-sm">Activar cámara</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isAudioEnabled} onChange={toggleAudio} />
                  <label className="text-sm">Activar micrófono</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devices Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Estado de Dispositivos
              </CardTitle>
              <CardDescription>
                Configuración de cámara y micrófono
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Cámara</p>
                      <p className="text-xs text-gray-600">HD Webcam</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Conectada</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Micrófono</p>
                      <p className="text-xs text-gray-600">Built-in Microphone</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">Altavoces</p>
                      <p className="text-xs text-gray-600">Default Audio</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Funcionando</Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Dispositivos
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scheduled Meetings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reuniones Programadas
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledMeetings.map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{meeting.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(meeting.scheduledTime, 'PPP HH:mm', { locale: es })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {meeting.participants.length} participantes
                    </div>
                    <span>{meeting.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {meeting.participants.map((participant, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge className={
                    meeting.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    meeting.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {meeting.status}
                  </Badge>
                  {meeting.status === 'upcoming' && (
                    <Button size="sm" onClick={startCall}>
                      <Video className="h-4 w-4 mr-1" />
                      Unirse
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
