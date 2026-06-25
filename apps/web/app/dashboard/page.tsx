import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) redirect('/auth/sign-in')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back, {session.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            You are signed in as <span className="font-medium">{session.user.email}</span> · Role:{' '}
            <span className="font-medium capitalize">{session.user.role?.toLowerCase()}</span>
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Posts</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Comments</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
