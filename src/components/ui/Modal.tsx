'use client';

import React, { useEffect, ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '500px',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-root" role="dialog" aria-modal="true" aria-label={title || 'Modal'}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-panel" style={{ maxWidth }}>
          <div className="modal-header">
            {title && <h3 className="modal-title">{title}</h3>}
            <button
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>

      <style jsx>{`
        .modal-root {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.6);
        }
        .modal-container {
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .modal-panel {
          width: 100%;
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #E7E2DA;
          background: #FAF7F2;
        }
        .modal-title {
          font-family: var(--font-display, serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: #2D1820;
          margin: 0;
        }
        .modal-close-btn {
          background: none;
          border: none;
          color: #57534E;
          font-size: 1rem;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
}
