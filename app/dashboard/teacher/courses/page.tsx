"use client"

import { useState, useEffect } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBook,
  IconCalendar,
  IconUsers,
  IconChartBar,
  IconCurrencyDollar,
  IconVideo,
  IconHeart,
  IconBell,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { BookOpen, Plus, Edit, Trash2, Clock, Users as UsersIcon, DollarSign, Calendar, GraduationCap } from "lucide-react"

export default function TeacherCoursesPage() {
  const { user } = useAuth()
  const [teacherData, setTeacherData] = useState(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données du professeur
        const teacherRes = await fetch('/api/teachers/me')
        if (teacherRes.ok) {
          const teacherData = await teacherRes.json()
          setTeacherData(teacherData)
        }

        // Récupérer les cours du professeur
        const coursesRes = await fetch('/api/teachers/courses')
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json()
          setCourses(coursesData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/teacher",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/teacher/courses",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes apprenants",
      href: "#",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Planning",
      href: "#",
      icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Cours en direct",
      href: "#",
      icon: <IconVideo className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Revenus",
      href: "#",
      icon: <IconCurrencyDollar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Favoris",
      href: "#",
      icon: <IconHeart className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Alertes",
      href: "#",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Statistiques",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Déconnexion",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <AuthGuard requiredRole="teacher">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                {open ? <Logo /> : <LogoIcon />}
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Mon profil' : 'Mon profil',
                    href: "#",
                    icon: (
                      <img
                        src="/placeholder.svg?height=50&width=50&text=P"
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <TeacherCoursesContent 
            teacherData={teacherData} 
            user={user} 
            loading={loading}
            courses={courses}
            setCourses={setCourses}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white font-heading"
      >
        Lahacademia
      </motion.span>
    </a>
  )
}

const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    </a>
  )
}

const TeacherCoursesContent = ({ 
  teacherData, 
  user, 
  loading, 
  courses, 
  setCourses,
  showAddForm,
  setShowAddForm 
}: { 
  teacherData: any, 
  user: any, 
  loading: boolean,
  courses: any[],
  setCourses: (courses: any[]) => void,
  showAddForm: boolean,
  setShowAddForm: (show: boolean) => void
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    duration: 60,
    price: '',
    max_students: 1,
    course_type: 'individual'
  })
  const [submitting, setSubmitting] = useState(false)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [selectedCourseForAvailability, setSelectedCourseForAvailability] = useState<any>(null)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingCourse) {
        // Mode édition
        const response = await fetch(`/api/teachers/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          const updatedCourse = await response.json()
          setCourses(courses.map(c => c.id === editingCourse.id ? updatedCourse : c))
          setShowAddForm(false)
          setEditingCourse(null)
          setFormData({
            title: '',
            description: '',
            subject: '',
            level: '',
            duration: 60,
            price: '',
            max_students: 1,
            course_type: 'individual'
          })
        } else {
          console.error('Erreur lors de la modification du cours')
        }
      } else {
        // Mode création
        const response = await fetch('/api/teachers/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          const newCourse = await response.json()
          setCourses([...courses, newCourse])
          setShowAddForm(false)
          setFormData({
            title: '',
            description: '',
            subject: '',
            level: '',
            duration: 60,
            price: '',
            max_students: 1,
            course_type: 'individual'
          })
        } else {
          console.error('Erreur lors de la création du cours')
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      subject: course.subject,
      level: course.level,
      duration: course.duration,
      price: course.price.toString(),
      max_students: course.max_students || 1,
      course_type: course.course_type || 'individual'
    })
    setShowAddForm(true)
  }

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      const response = await fetch(`/api/teachers/courses/${courseToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseToDelete.id))
        setShowDeleteConfirm(false)
        setCourseToDelete(null)
      } else {
        console.error('Erreur lors de la suppression du cours')
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingCourse(null)
    setShowAddForm(false)
    setFormData({
      title: '',
      description: '',
      subject: '',
      level: '',
      duration: 60,
      price: '',
      max_students: 1,
      course_type: 'individual'
    })
  }

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Mes Cours</h1>
              <p className="text-laha-gold-light/70">
                {loading ? (
                  'Chargement...'
                ) : (
                  <>Gérez vos cours et créez de nouvelles offres pour vos élèves.</>
                )}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCourse(null)
                setFormData({
                  title: '',
                  description: '',
                  subject: '',
                  level: '',
                  duration: 60,
                  price: '',
                  max_students: 1,
                  course_type: 'individual'
                })
                setShowAddForm(true)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nouveau cours
            </button>
          </div>
        </div>

        {/* Add Course Form */}
        {showAddForm && (
          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-laha-gold-light">
                {editingCourse ? 'Modifier le cours' : 'Créer un nouveau cours'}
              </h2>
              {editingCourse && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-laha-gold-light hover:text-laha-gold text-sm"
                >
                  Annuler la modification
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-laha-gold-light mb-2">Titre du cours *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    placeholder="Ex: Mathématiques Terminale"
                    required
                  />
                </div>
                <div>
                  <label className="block text-laha-gold-light mb-2">Matière *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    required
                  >
                    <option value="">-- Choisir une matière --</option>
                    <option value="mathematics">Mathématiques</option>
                    <option value="physics">Physique</option>
                    <option value="chemistry">Chimie</option>
                    <option value="biology">Biologie</option>
                    <option value="french">Français</option>
                    <option value="english">Anglais</option>
                    <option value="history">Histoire</option>
                    <option value="geography">Géographie</option>
                    <option value="philosophy">Philosophie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-laha-gold-light mb-2">Niveau scolaire *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    required
                  >
                    <option value="">-- Choisir un niveau --</option>
                    <option value="6eme">6ème</option>
                    <option value="5eme">5ème</option>
                    <option value="4eme">4ème</option>
                    <option value="3eme">3ème</option>
                    <option value="seconde">Seconde</option>
                    <option value="premiere">Première</option>
                    <option value="terminale">Terminale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-laha-gold-light mb-2">Type de cours *</label>
                  <select
                    value={formData.course_type}
                    onChange={(e) => setFormData({...formData, course_type: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    required
                  >
                    <option value="individual">Cours individuel</option>
                    <option value="group">Cours en groupe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-laha-gold-light mb-2">Durée (minutes) *</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    required
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2 heures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-laha-gold-light mb-2">Prix (FCFA) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    placeholder="Ex: 5000"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              {formData.course_type === 'group' && (
                <div>
                  <label className="block text-laha-gold-light mb-2">Nombre maximum d'élèves</label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({...formData, max_students: parseInt(e.target.value)})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm"
                    min="2"
                    max="20"
                  />
                </div>
              )}

              <div>
                <label className="block text-laha-gold-light mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm resize-none"
                  rows={3}
                  placeholder="Décrivez brièvement le contenu du cours..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-laha-black"></div>
                      {editingCourse ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4" />
                      {editingCourse ? 'Modifier le cours' : 'Créer le cours'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-laha-gold-dark/30 text-laha-gold-light rounded-lg hover:bg-laha-black-light/20 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
          <h2 className="text-xl font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-laha-gold" />
            Mes cours ({courses.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold mx-auto mb-4"></div>
              <p className="text-laha-gold-light/70">Chargement des cours...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-laha-gold/50 mx-auto mb-4" />
              <p className="text-laha-gold-light/70 mb-4">Aucun cours créé pour le moment</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Créer votre premier cours
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-4 border border-laha-gold-dark/20">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-laha-gold-light font-medium text-lg">{course.title}</h3>
                      <p className="text-laha-gold-light/70 text-sm mt-1">{course.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="p-2 text-laha-gold hover:bg-laha-gold/10 rounded-lg transition-colors"
                        title="Modifier ce cours"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setCourseToDelete(course)
                          setShowDeleteConfirm(true)
                        }}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Supprimer ce cours"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-laha-gold-light/70">
                      <GraduationCap className="h-4 w-4 text-laha-gold" />
                      <span>{course.subject} - {course.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-laha-gold-light/70">
                      <Clock className="h-4 w-4 text-laha-gold-warm" />
                      <span>{course.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-laha-gold-light/70">
                      <DollarSign className="h-4 w-4 text-laha-gold-soft" />
                      <span>{course.price} FCFA</span>
                    </div>
                    <div className="flex items-center gap-2 text-laha-gold-light/70">
                      <UsersIcon className="h-4 w-4 text-laha-gold" />
                      <span>{course.course_type === 'individual' ? 'Individuel' : `Groupe (max ${course.max_students})`}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => {
                        setSelectedCourseForAvailability(course)
                        setShowAvailabilityModal(true)
                      }}
                      className="bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Gérer les disponibilités
                    </button>
                    <button className="bg-laha-gold-warm/20 hover:bg-laha-gold-warm/30 text-laha-gold-warm px-4 py-2 rounded-lg text-sm transition-colors">
                      Voir les réservations
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal pour gérer les disponibilités */}
      {showAvailabilityModal && selectedCourseForAvailability && (
        <AvailabilityModal
          course={selectedCourseForAvailability}
          onClose={() => {
            setShowAvailabilityModal(false)
            setSelectedCourseForAvailability(null)
          }}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && courseToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-laha-black rounded-xl max-w-md w-full border border-laha-gold-dark/30">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-laha-gold mb-4">
                Confirmer la suppression
              </h2>
              <p className="text-laha-gold-light mb-6">
                Êtes-vous sûr de vouloir supprimer le cours <strong>"{courseToDelete.title}"</strong> ? 
                Cette action est irréversible et supprimera également toutes les disponibilités associées.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCourse}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Supprimer définitivement
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setCourseToDelete(null)
                  }}
                  className="flex-1 bg-laha-black-light hover:bg-laha-black-light/80 text-laha-gold-light px-4 py-3 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant Modal pour gérer les disponibilités d'un cours
const AvailabilityModal = ({ course, onClose }: { course: any, onClose: () => void }) => {
  const [availabilities, setAvailabilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAvailability, setNewAvailability] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '10:00',
    specific_date: '' as string | ''
  })

  const days = [
    { value: 0, label: 'Lundi' },
    { value: 1, label: 'Mardi' },
    { value: 2, label: 'Mercredi' },
    { value: 3, label: 'Jeudi' },
    { value: 4, label: 'Vendredi' },
    { value: 5, label: 'Samedi' },
    { value: 6, label: 'Dimanche' }
  ]

  // Charger les disponibilités existantes
  useEffect(() => {
    const loadAvailabilities = async () => {
      try {
        const response = await fetch(`/api/courses/${course.id}/availabilities`)
        if (response.ok) {
          const data = await response.json().catch(() => [])
          const items = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : [])
          setAvailabilities(items)
        } else {
          setAvailabilities([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des disponibilités:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAvailabilities()
  }, [course.id])

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/courses/${course.id}/availabilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAvailability)
      })

      if (response.ok) {
    const savedAvailability = await response.json().catch(() => null)
    const normalized = savedAvailability && typeof savedAvailability === 'object' ? savedAvailability : null
        setAvailabilities(normalized ? [...availabilities, normalized] : availabilities)
        setShowAddForm(false)
        setNewAvailability({ day_of_week: 0, start_time: '09:00', end_time: '10:00', specific_date: '' })
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la disponibilité:', error)
    }
  }

  const handleDeleteAvailability = async (availabilityId: string) => {
    try {
      const response = await fetch(`/api/availabilities/${availabilityId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAvailabilities(availabilities.filter(a => a.id !== availabilityId))
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-laha-black rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-laha-gold-dark/30">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-laha-gold">
              Disponibilités - {course.title}
            </h2>
            <button
              onClick={onClose}
              className="text-laha-gold-light hover:text-laha-gold transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Liste des disponibilités */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-laha-gold-light">Créneaux disponibles</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-laha-gold hover:bg-laha-gold-dark text-laha-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Ajouter un créneau
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-laha-gold-light">Chargement...</div>
            ) : availabilities.length === 0 ? (
              <div className="text-center py-8 text-laha-gold-light">
                Aucun créneau défini. Ajoutez des créneaux pour que les parents puissent réserver ce cours.
              </div>
            ) : (
              <div className="space-y-3">
                {availabilities.map((availability) => (
                  <div key={availability.id} className="bg-laha-black-light/40 rounded-lg p-4 border border-laha-gold-dark/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-laha-gold font-medium">
                          {availability.specific_date ? new Date(availability.specific_date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : days.find(d => d.value === availability.day_of_week)?.label}
                        </span>
                        <span className="text-laha-gold-light ml-2">
                          {availability.start_time} - {availability.end_time}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteAvailability(availability.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulaire d'ajout */}
          {showAddForm && (
            <form onSubmit={handleAddAvailability} className="bg-laha-black-light/20 rounded-lg p-4 border border-laha-gold-dark/20">
              <h4 className="text-laha-gold-light mb-4">Nouveau créneau</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-laha-gold-light mb-2">Jour</label>
                  <select
                    value={newAvailability.day_of_week}
                    onChange={(e) => setNewAvailability({...newAvailability, day_of_week: parseInt(e.target.value)})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-3 py-2 text-laha-gold-light"
                  >
                    {days.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-laha-gold-light mb-2">Date spécifique (optionnel)</label>
                  <input
                    type="date"
                    value={newAvailability.specific_date as string}
                    onChange={(e) => setNewAvailability({ ...newAvailability, specific_date: e.target.value })}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-3 py-2 text-laha-gold-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-laha-gold-light mb-2">Heure début</label>
                  <input
                    type="time"
                    value={newAvailability.start_time}
                    onChange={(e) => setNewAvailability({...newAvailability, start_time: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-3 py-2 text-laha-gold-light"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-laha-gold-light mb-2">Heure fin</label>
                  <input
                    type="time"
                    value={newAvailability.end_time}
                    onChange={(e) => setNewAvailability({...newAvailability, end_time: e.target.value})}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-3 py-2 text-laha-gold-light"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-laha-gold hover:bg-laha-gold-dark text-laha-black px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-laha-black-light hover:bg-laha-black-light/80 text-laha-gold-light px-4 py-2 rounded-lg text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
