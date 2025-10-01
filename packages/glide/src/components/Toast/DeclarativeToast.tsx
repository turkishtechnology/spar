import { forwardRef, ReactNode, useEffect, useId } from 'react';
import { useToastContext } from './ToastProvider';
import type { ToastRootProps } from './Toast.types';

export interface DeclarativeToastProps extends Omit<ToastRootProps, 'children'> {
  /**
   * Toast içeriği - string veya ReactNode
   */
  children?: ReactNode;
  
  /**
   * Toast başlığı
   */
  title?: string;
  
  /**
   * Toast açıklaması
   */
  description?: string;
}

/**
 * Deklaratif Toast Komponenti
 * JSX içinde <Toast /> şeklinde kullanılır ve otomatik olarak ToastViewport'a eklenir
 */
export const DeclarativeToast = forwardRef<HTMLDivElement, DeclarativeToastProps>(
  ({ 
    children, 
    title, 
    description, 
    variant = 'info',
    size = 'medium',
    open = true,
    defaultOpen,
    onOpenChange,
    duration,
    priority = 'normal',
    persistent = false,
    loading = false,
    progress,
    ...props 
  }, ref) => {
    const { addToast, removeToast, config } = useToastContext();
    const toastId = useId();

    // Duration resolution: prop > provider config > default
    const resolvedDuration = duration ?? config.duration;

    // Toast'ı context'e ekle
    useEffect(() => {
      if (open || defaultOpen) {
        // İçerik oluştur
        const content = children || (
          <>
            {title && <div data-toast-title>{title}</div>}
            {description && <div data-toast-description>{description}</div>}
          </>
        );

        const toastConfig: any = {
          content,
          variant,
          size,
          priority,
          isPersistent: persistent,
          isLoading: loading,
          duration: resolvedDuration, // Always set resolved duration
        };

        // Sadece tanımlı değerleri ekle
        if (progress !== undefined) toastConfig.progress = progress;

        const id = addToast(toastConfig);

        // Cleanup fonksiyonu
        return () => {
          removeToast(id);
        };
      }
      
      // Eğer toast açık değilse cleanup return etme
      return undefined;
    }, [
      addToast,
      removeToast,
      children,
      title,
      description,
      variant,
      size,
      open,
      defaultOpen,
      resolvedDuration,
      priority,
      persistent,
      loading,
      progress,
    ]);

    // Open state değişikliklerini handle et
    useEffect(() => {
      if (onOpenChange && !open) {
        onOpenChange(false);
      }
    }, [open, onOpenChange]);

    // Deklaratif toast render etmez, sadece context'e ekler
    return null;
  }
);

DeclarativeToast.displayName = 'Toast.Declarative';