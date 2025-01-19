"use client";
import React, { useEffect, useRef, ReactNode } from "react";

interface CommonModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  modalClassName?: string;
  outsideClose?: boolean;
}

const CustomModal: React.FC<CommonModalProps> = props => {
  const { id, isOpen, onClose, children, modalClassName = "modal", outsideClose = true } = props;
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let observerRefValue: HTMLDialogElement | null = null;
    const handleOutsideClick = (event: MouseEvent) => {
      if (outsideClose && modalRef.current && event.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen && modalRef?.current && !modalRef.current?.open) {
      modalRef.current.showModal();
      modalRef.current.addEventListener("click", handleOutsideClick);
      observerRefValue = modalRef.current;
    } else if (modalRef.current?.open && !isOpen) {
      modalRef.current.close();
      observerRefValue = modalRef.current;
    }

    return () => {
      if (observerRefValue) {
        observerRefValue.removeEventListener("click", handleOutsideClick);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog ref={modalRef} id={id} className={modalClassName}>
      {children}
    </dialog>
  );
};

export default CustomModal;
