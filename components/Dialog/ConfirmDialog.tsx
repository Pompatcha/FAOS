import { useState } from 'react'
import type { FC } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'sdfsdfsdf

import { Button } from '../ui/button'
import { DialogHeader } from '../ui/dialog'

interface ConfirmDialogProps {
  triggerText?: string
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  triggerText = 'Open',
  title = 'Are you absolutely sure?',
  description = 'This action is irreversible. This action will permanently delete your data and your data will be removed from our servers.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'destructive',
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleConfirm = (): void => {
    if (onConfirm) {
      onConfirm()
    }
    setOpen(false)
  }

  const handleCancel = (): void => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex justify-end space-x-2'>
          <Button variant='outline' onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
