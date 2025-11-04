import Link from 'next/link';
import type { SidebarProps } from '@/types';

export function Sidebar({ heading, subheading, items, className }: SidebarProps) {
  const classes = [
    'hidden w-72 flex-col border-r border-gray-200 bg-white md:flex',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={classes}>
      <div className="border-b border-gray-200 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {heading}
        </p>
        <h1 className="mt-2 text-xl font-bold text-gray-900">{subheading}</h1>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl border border-blue-500 px-4 py-3"
          >
            <span className="text-sm font-semibold text-gray-900">{item.title}</span>
            {item.description ? (
              <span className="mt-1 block text-xs text-gray-500">
                {item.description}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

