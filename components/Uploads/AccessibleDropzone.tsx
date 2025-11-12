"use client";

import React, {useCallback, useId, useRef} from "react";

interface AccessibleDropzoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  instructions?: string;
  buttonLabel?: string;
  onFilesSelected: (files: File[]) => void;
}

/**
 * Keyboard- and screen-reader-friendly dropzone built on native input[type=file].
 * - Big focusable region (role=button) supports Enter/Space
 * - Drag and drop support
 * - Hidden input for actual file picking
 */
export default function AccessibleDropzone({
  accept = "image/*",
  multiple = true,
  disabled = false,
  instructions = "Select images or drag and drop multiple files here.",
  buttonLabel = "Select images",
  onFilesSelected,
}: AccessibleDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropId = useId();

  const handlePick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePick();
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
    // Reset to allow selecting same files again
    e.currentTarget.value = "";
  };

  const prevent: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    prevent(e);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) onFilesSelected(files);
  };

  return (
    <div className="w-full">
      <div
        id={dropId}
        role="button"
        data-cy="adz-drop"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-describedby={`${dropId}-desc`}
        onKeyDown={handleKeyDown}
        onClick={handlePick}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDragLeave={prevent}
        onDrop={handleDrop}
        className={
          `flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6
           ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600'}`
        }
        style={{ minHeight: 140 }}
      >
        <span className="text-lg font-medium">{instructions}</span>
        <span className="text-sm text-gray-600">{accept}</span>
        <button
          type="button"
          className="mt-2 px-4 py-2 rounded bg-blue-600 text-white text-base"
          onClick={(e) => {
            e.preventDefault();
            handlePick();
          }}
          aria-label={buttonLabel}
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>
      <p id={`${dropId}-desc`} className="sr-only">
        {multiple ? 'You can select multiple files.' : 'Select a single file.'}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        aria-hidden
        tabIndex={-1}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
