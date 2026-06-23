'use client';
import { useRef, useCallback } from 'react';

export default function RichTextEditor({ value, onChange, placeholder, label }) {
  const editorRef = useRef(null);

  const exec = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const setSize = useCallback((size) => {
    exec('fontSize', size === 'small' ? '1' : size === 'medium' ? '3' : '6');
  }, [exec]);

  const setAlignment = useCallback((align) => {
    exec('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  }, [exec]);

  const insertHTML = useCallback((html) => {
    document.execCommand('insertHTML', false, html);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
          <button
            type="button"
            onClick={() => exec('bold')}
            className="px-2 py-1 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Bold"
          >
            <b>B</b>
          </button>
          <button
            type="button"
            onClick={() => exec('italic')}
            className="px-2 py-1 text-sm italic text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Italic"
          >
            <i>I</i>
          </button>
          <span className="w-px h-5 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => setSize('small')}
            className="px-2 py-1 text-xs text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Small"
          >
            S
          </button>
          <button
            type="button"
            onClick={() => setSize('medium')}
            className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Medium"
          >
            M
          </button>
          <button
            type="button"
            onClick={() => setSize('large')}
            className="px-2 py-1 text-base font-semibold text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Large"
          >
            L
          </button>
          <span className="w-px h-5 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Align Left"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Align Center"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Align Right"
          >
            ≡
          </button>
          <span className="w-px h-5 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => insertHTML('<span style="color: #dc2626;">')}
            className="px-2 py-1 text-sm text-red-600 font-semibold hover:bg-slate-200 rounded transition-colors"
            title="Text Color"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => insertHTML('<mark>')}
            className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Highlight"
          >
            <mark>H</mark>
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="w-full min-h-[80px] px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-pre-wrap break-words"
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          data-placeholder={placeholder}
          onFocus={(e) => {
            if (e.currentTarget.innerHTML === '' || e.currentTarget.innerHTML === '<br>') {
              e.currentTarget.innerHTML = value || '';
            }
          }}
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">Supports: bold, italic, text size, alignment, color & highlight</p>
    </div>
  );
}
