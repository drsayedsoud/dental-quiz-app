/* eslint-disable */
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =================== CUSTOM ALERT MODAL ===================
interface AlertModalProps {
  isOpen: boolean;
  message: string;
  icon?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  onClose: () => void;
}

export function AlertModal({ isOpen, message, icon, type = 'info', onClose }: AlertModalProps) {
  const colorMap = {
    info: { border: 'border-cyan-500/50', glow: 'shadow-[0_0_40px_rgba(6,182,212,0.3)]', btn: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500', text: 'text-cyan-300' },
    success: { border: 'border-green-500/50', glow: 'shadow-[0_0_40px_rgba(34,197,94,0.3)]', btn: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500', text: 'text-green-300' },
    error: { border: 'border-red-500/50', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.3)]', btn: 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500', text: 'text-red-300' },
    warning: { border: 'border-yellow-500/50', glow: 'shadow-[0_0_40px_rgba(234,179,8,0.3)]', btn: 'from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500', text: 'text-yellow-300' },
  };
  const c = colorMap[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className={`relative z-10 w-full max-w-sm bg-[#0f172a] border-2 ${c.border} rounded-3xl p-6 ${c.glow} text-center`}
          >
            {icon && <div className="text-5xl mb-4">{icon}</div>}
            <p className={`${c.text} text-sm sm:text-base leading-relaxed font-semibold whitespace-pre-line`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className={`mt-6 w-full bg-gradient-to-r ${c.btn} text-white font-bold py-3 rounded-2xl transition active:scale-95 text-sm`}
            >
              حسناً
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// =================== CUSTOM PROMPT (PIN) MODAL ===================
interface PromptModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  icon?: string;
  placeholder?: string;
  inputType?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function PromptModal({ isOpen, title, subtitle, icon, placeholder, inputType = 'password', onSubmit, onCancel }: PromptModalProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    setValue('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative z-10 w-full max-w-sm bg-[#0f172a] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center"
          >
            {icon && <div className="text-5xl mb-3">{icon}</div>}
            <h3 className="text-lg font-extrabold text-white mb-1">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mb-5">{subtitle}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                ref={inputRef}
                type={inputType}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder || '••••••••'}
                className="w-full bg-white/5 border-2 border-white/15 rounded-2xl px-4 py-3.5 text-white text-center text-lg font-bold placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition tracking-[0.3em]"
                dir="ltr"
                autoComplete="off"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white font-bold py-3 rounded-2xl transition active:scale-95 text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-2xl transition active:scale-95 text-sm shadow-lg shadow-cyan-600/30"
                >
                  دخول
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// =================== CONFIRM MODAL ===================
interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, message, icon, confirmText = 'تأكيد', cancelText = 'إلغاء', type = 'info', onConfirm, onCancel }: ConfirmModalProps) {
  const isDanger = type === 'danger';
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className={`relative z-10 w-full max-w-sm bg-[#0f172a] border-2 ${isDanger ? 'border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)]'} rounded-3xl p-6 text-center`}
          >
            {icon && <div className="text-5xl mb-4">{icon}</div>}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-semibold mb-6 whitespace-pre-line">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white font-bold py-3 rounded-2xl transition active:scale-95 text-sm"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 ${isDanger ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-600/30' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30'} text-white font-bold py-3 rounded-2xl transition active:scale-95 text-sm shadow-lg`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// =================== HOOKS FOR EASY USAGE ===================
export function useAlert() {
  const [state, setState] = useState<{ isOpen: boolean; message: string; icon?: string; type?: 'info' | 'success' | 'error' | 'warning' }>({ isOpen: false, message: '' });
  const resolveRef = useRef<(() => void) | null>(null);

  const showAlert = useCallback((message: string, icon?: string, type?: 'info' | 'success' | 'error' | 'warning'): Promise<void> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ isOpen: true, message, icon, type: type || 'info' });
    });
  }, []);

  const handleClose = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
    resolveRef.current?.();
    resolveRef.current = null;
  }, []);

  const AlertComponent = (
    <AlertModal
      isOpen={state.isOpen}
      message={state.message}
      icon={state.icon}
      type={state.type}
      onClose={handleClose}
    />
  );

  return { showAlert, AlertComponent };
}

export function usePrompt() {
  const [state, setState] = useState<{ isOpen: boolean; title: string; subtitle?: string; icon?: string; placeholder?: string; inputType?: string }>({ isOpen: false, title: '' });
  const resolveRef = useRef<((value: string | null) => void) | null>(null);

  const showPrompt = useCallback((title: string, opts?: { subtitle?: string; icon?: string; placeholder?: string; inputType?: string }): Promise<string | null> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ isOpen: true, title, ...opts });
    });
  }, []);

  const handleSubmit = useCallback((value: string) => {
    setState(s => ({ ...s, isOpen: false }));
    resolveRef.current?.(value);
    resolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
    resolveRef.current?.(null);
    resolveRef.current = null;
  }, []);

  const PromptComponent = (
    <PromptModal
      isOpen={state.isOpen}
      title={state.title}
      subtitle={state.subtitle}
      icon={state.icon}
      placeholder={state.placeholder}
      inputType={state.inputType}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );

  return { showPrompt, PromptComponent };
}

export function useConfirm() {
  const [state, setState] = useState<{ isOpen: boolean; message: string; icon?: string; confirmText?: string; cancelText?: string; type?: 'danger' | 'info' }>({ isOpen: false, message: '' });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const showConfirm = useCallback((message: string, opts?: { icon?: string; confirmText?: string; cancelText?: string; type?: 'danger' | 'info' }): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ isOpen: true, message, ...opts });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const ConfirmComponent = (
    <ConfirmModal
      isOpen={state.isOpen}
      message={state.message}
      icon={state.icon}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      type={state.type}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { showConfirm, ConfirmComponent };
}
