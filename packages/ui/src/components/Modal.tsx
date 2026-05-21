"use client";

import React, { useEffect } from "react";
import { cn } from "../lib/cn";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  closeButton?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      closeButton = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          role="presentation"
        />
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.currentTarget === e.target && onClose()}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={ref}
            className={cn(
              "relative w-full max-w-md rounded-2xl bg-ivory shadow-2xl",
              className,
            )}
            {...props}
          >
            {title && (
              <div className="border-b border-slate-blue/10 px-6 py-4">
                <h2 className="text-xl font-semibold text-navy">{title}</h2>
              </div>
            )}

            {closeButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-blue/10"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <div className="p-6">{children}</div>
          </div>
        </div>
      </>
    );
  },
);

Modal.displayName = "Modal";

export { Modal };
