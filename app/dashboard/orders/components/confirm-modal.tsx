'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-amber-500' />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className='pt-2'>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
