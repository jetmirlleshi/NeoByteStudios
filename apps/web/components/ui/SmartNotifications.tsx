'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  UserPlus,
  Trophy,
  Sparkles,
  MapPin,
  BookOpen,
  Zap,
  Globe,
  Star,
} from 'lucide-react'

interface Notification {
  id: string
  message: string
  subMessage?: string
  icon: React.ReactNode
  duration: number
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', message: 'New creator joined from California!', subMessage: 'Welcome to the community', icon: <MapPin className="w-4 h-4 text-blue-500" />, duration: 4000 },
  { id: '2', message: 'Milestone reached!', subMessage: '3,000 creators on waitlist', icon: <Trophy className="w-4 h-4 text-amber-500" />, duration: 5000 },
  { id: '3', message: 'Someone just created their first world', subMessage: 'Using NeoByteWriter', icon: <Sparkles className="w-4 h-4 text-violet-500" />, duration: 4000 },
  { id: '4', message: 'New user from Tokyo, Japan', subMessage: 'Global community growing', icon: <Globe className="w-4 h-4 text-emerald-500" />, duration: 4000 },
  { id: '5', message: '50,000 words written today!', subMessage: 'Creators are building amazing worlds', icon: <BookOpen className="w-4 h-4 text-blue-500" />, duration: 4500 },
  { id: '6', message: 'Pro trial started', subMessage: 'Someone is exploring advanced features', icon: <Zap className="w-4 h-4 text-yellow-500" />, duration: 4000 },
  { id: '7', message: '5-star review received!', subMessage: 'NeoByteWriter transformed my writing', icon: <Star className="w-4 h-4 text-amber-500" />, duration: 5000 },
  { id: '8', message: 'New referral signup', subMessage: 'Community is spreading the word', icon: <UserPlus className="w-4 h-4 text-violet-500" />, duration: 4000 },
]

export function SmartNotifications() {
  const [hasStarted, setHasStarted] = useState(false)

  const showNotification = useCallback((notification: Notification) => {
    toast.custom(
      () => (
        <div className="max-w-md w-full bg-bg-card shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-white/5">
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center">
                  {notification.icon}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {notification.message}
                </p>
                {notification.subMessage && (
                  <p className="mt-1 text-sm text-text-muted">
                    {notification.subMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: notification.duration }
    )
  }, [])

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true)
    }, 5000)
    return () => clearTimeout(startTimeout)
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let notificationIndex = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const showNextNotification = () => {
      const notification = NOTIFICATIONS[notificationIndex]
      showNotification(notification)
      notificationIndex = (notificationIndex + 1) % NOTIFICATIONS.length
      const nextInterval = Math.random() * 30000 + 15000
      timeoutId = setTimeout(showNextNotification, nextInterval)
    }

    showNextNotification()
    return () => clearTimeout(timeoutId)
  }, [hasStarted, showNotification])

  // Welcome back notification for returning users
  useEffect(() => {
    const hasVisited = localStorage.getItem('neobyte_visited')
    const lastVisit = localStorage.getItem('neobyte_last_visit')

    if (hasVisited && lastVisit) {
      const daysSince = Math.floor(
        (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)
      )
      if (daysSince > 1) {
        toast.success(`Welcome back! It's been ${daysSince} days.`, {
          description: "Check out what's new at NeoByteStudios.",
          duration: 5000,
        })
      }
    }

    localStorage.setItem('neobyte_visited', 'true')
    localStorage.setItem('neobyte_last_visit', Date.now().toString())
  }, [])

  return null
}

export function LiveStatsWidget() {
  const [stats, setStats] = useState({
    activeUsers: 128,
    storiesCreated: 2847,
    wordsWritten: 50342,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        activeUsers: Math.max(
          100,
          prev.activeUsers + Math.floor(Math.random() * 5) - 2
        ),
        storiesCreated:
          prev.storiesCreated + (Math.random() > 0.8 ? 1 : 0),
        wordsWritten:
          prev.wordsWritten + Math.floor(Math.random() * 100),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
      <div className="bg-bg-card/90 backdrop-blur-sm rounded-xl shadow-lg border border-border-custom p-4">
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
          Live Activity
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-text-secondary">
              {stats.activeUsers} active now
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-text-secondary">
              {stats.storiesCreated.toLocaleString()} stories
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-text-secondary">
              {stats.wordsWritten.toLocaleString()} words today
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
