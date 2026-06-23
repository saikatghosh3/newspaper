import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const maxVisible = 5;
  const items = [];
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(pages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  items.push(
    <button
      key="prev"
      onClick={() => onPageChange(page - 1)}
      disabled={page === 1}
      className="p-1.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );

  if (start > 1) {
    items.push(
      <button key={1} onClick={() => onPageChange(1)}
        className="px-2.5 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">
        1
      </button>
    );
    if (start > 2) {
      items.push(<span key="dots1" className="px-1 text-slate-300 text-xs">...</span>);
    }
  }

  for (let i = start; i <= end; i++) {
    items.push(
      <button key={i} onClick={() => onPageChange(i)}
        className={`px-2.5 py-1.5 border rounded text-xs font-medium transition-colors ${
          i === page
            ? 'bg-red-600 text-white border-red-600'
            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}>
        {i}
      </button>
    );
  }

  if (end < pages) {
    if (end < pages - 1) {
      items.push(<span key="dots2" className="px-1 text-slate-300 text-xs">...</span>);
    }
    items.push(
      <button key={pages} onClick={() => onPageChange(pages)}
        className="px-2.5 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">
        {pages}
      </button>
    );
  }

  items.push(
    <button
      key="next"
      onClick={() => onPageChange(page + 1)}
      disabled={page === pages}
      className="p-1.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex items-center gap-1.5">
      {items}
    </div>
  );
}
