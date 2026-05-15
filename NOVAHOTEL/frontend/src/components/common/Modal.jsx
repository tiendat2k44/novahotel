import React from 'react'
import { Dialog } from '@headlessui/react'

/**
 * Modal using Headless UI Dialog
 * Props: open, onClose, title, children
 */
export default function Modal({ open, onClose, title, children }){
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <Dialog.Panel className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6 shadow-lg">
        {title && <Dialog.Title className="text-lg font-semibold mb-2">{title}</Dialog.Title>}
        <div className="mt-2">{children}</div>
      </Dialog.Panel>
    </Dialog>
  )
}
