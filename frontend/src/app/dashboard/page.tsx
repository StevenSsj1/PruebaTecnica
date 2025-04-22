"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  description?: string
  organizationId: string
  dueDate?: string
  completed: boolean
  createdAt: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      fetchTasks()
    }
  }, [router])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await fetch("http://localhost:3002/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem("token")
          sessionStorage.removeItem("token")
          router.push("/login")
          return
        }
        throw new Error("Error al obtener tareas")
      }

      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al cargar tareas", {
        description: "No se pudieron cargar las tareas. Intenta de nuevo más tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    router.push("/login")
    toast.success("Sesión cerrada", {
      description: "Has cerrado sesión correctamente",
    })
  }

//   const handleTaskCreated = (newTask: Task) => {
//     setTasks((prevTasks) => [newTask, ...prevTasks])
//     setIsDialogOpen(false)
//   }

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await fetch(`http://tu-api-nestjs.com/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar tarea")
      }

      // Actualizar estado local
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))

      toast.success("Tarea actualizada", {
        description: `Tarea marcada como ${completed ? "completada" : "pendiente"}`,
      })
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al actualizar tarea", {
        description: "No se pudo actualizar el estado de la tarea",
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Tareas</h1>
        <div className="flex gap-2">
          {/* <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button> */}
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tienes tareas pendientes</p>
          {/* <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear tu primera tarea
          </Button> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className={task.completed ? "bg-gray-50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className={`text-xl ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </CardTitle>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => toggleTaskStatus(task.id, checked as boolean)}
                  />
                </div>
                <CardDescription>
                  {task.dueDate && (
                    <Badge variant={new Date(task.dueDate) < new Date() && !task.completed ? "destructive" : "outline"}>
                      Vence: {formatDate(task.dueDate)}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${task.completed ? "text-gray-500" : ""}`}>
                  {task.description || "Sin descripción"}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">Creada: {formatDate(task.createdAt)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* <CreateTaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onTaskCreated={handleTaskCreated} /> */}
    </div>
  )
}
