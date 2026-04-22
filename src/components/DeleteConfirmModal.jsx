import React from 'react';
import { Trash2, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectName, loading }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col animate-slide-up md:animate-none overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Eliminar proyecto</h3>
              <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <p className="px-5 pb-5 text-sm text-gray-600">
          ¿Estás seguro de que quieres eliminar{' '}
          <span className="font-semibold text-gray-800">"{projectName}"</span>?
        </p>

        <div className="flex gap-3 px-5 pb-6">
          <button
            className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold min-h-[44px] transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold min-h-[44px] transition disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
