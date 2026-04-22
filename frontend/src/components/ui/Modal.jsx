import { useEffect } from "react";

export const Modal = ({ open, onClose, children, maxWidth = "max-w-lg" }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-t-2xl sm:rounded-2xl shadow-modal
          animate-fade-up max-h-[92vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
};
