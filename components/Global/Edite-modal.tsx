'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ClassNames } from '@/utils/classname-join';

export default function ModalForEdite({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={ClassNames(
              'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4',
              ' pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0',
              ' data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in',
              ' sm:my-8 sm:w-full sm:max-w-fit sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95',
            )}
          >
            <div>
              <div className="mt-3 text-center sm:mt-5">{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
