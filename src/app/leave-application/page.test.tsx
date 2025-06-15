import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { zhTW } from '@mui/material/locale'
import LeaveApplication from './page'

const theme = createTheme({}, zhTW)

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('leave application validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

    it('should show error when did not choose start time and end time when choosing specific time type', async () => {
      renderWithTheme(<LeaveApplication />)
      
      const specificTimeRadio = screen.getByRole('radio', { name: '指定時間' })
      fireEvent.click(specificTimeRadio)
      
      await waitFor(() => {
        expect(specificTimeRadio).toBeChecked()
        expect(screen.getByTestId('start-hour')).toBeInTheDocument()
      })
      
      const submitButton = screen.getByRole('button', { name: '送出申請' })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('請選擇開始時間')).toBeInTheDocument()
        expect(screen.getByText('請選擇結束時間')).toBeInTheDocument()
      })
    })
})