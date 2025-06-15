// Mock Next.js router
import { vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'

// Make React globally available
global.React = React

// Mock Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/leave-application',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock fetch
global.fetch = vi.fn()

// Mock DOM methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})