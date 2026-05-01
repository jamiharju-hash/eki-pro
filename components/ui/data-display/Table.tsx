import { ReactNode } from 'react';

export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-eki-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-900/60 text-zinc-300">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-eki-border/80 hover:bg-zinc-900/40">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
