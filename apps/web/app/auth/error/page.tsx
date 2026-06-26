'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errors: Record<string, string> = {
    OAuthAccountNotLinked: 'This email is already linked to another provider.',
    CredentialsSignin: 'Invalid email or password.',
    Default: 'An error occurred during authentication.',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Authentication error</h1>
        <p className="text-sm text-gray-500 mb-6">
          {errors[error as string] ?? errors.Default}
        </p>
        <Link
          href="/auth/sign-in"
          className="inline-block py-2 px-6 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
