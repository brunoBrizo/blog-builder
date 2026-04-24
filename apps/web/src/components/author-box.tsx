import Image from 'next/image';
import Link from 'next/link';
import { Check, Globe } from 'lucide-react';
import type { Author } from '../mocks/authors';
import { cn } from '@blog-builder/ui';

interface AuthorBoxProps {
  author: Author;
  variant?: 'inline' | 'expanded' | 'sidebar';
  className?: string;
}

export function AuthorBox({
  author,
  variant = 'expanded',
  className,
}: AuthorBoxProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Image
          src={author.avatarUrl}
          alt={author.name}
          width={40}
          height={40}
          className="rounded-full grayscale opacity-90 object-cover"
        />
        <div>
          <div className="text-sm font-medium text-zinc-900">{author.name}</div>
          {/* Note: date and read time usually goes here, passed as children or adjacent elements in the layout */}
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div
        className={cn(
          'bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow duration-300',
          className,
        )}
      >
        <div className="flex items-start gap-4">
          <div className="relative">
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-zinc-100 relative z-10"
            />
            <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-30 z-0 translate-y-1"></div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-900">{author.name}</h3>
            <p className="text-xs font-medium text-indigo-600 mb-2">
              {author.role}
            </p>
            <p className="text-xs font-light text-zinc-500 leading-relaxed">
              {author.bio.slice(0, 100)}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-[#fbfbfb] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm shadow-zinc-200/40 relative overflow-hidden',
        className,
      )}
    >
      {/* Subtle decorative glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row gap-5 items-start relative z-10">
        <Image
          src={author.avatarUrl}
          alt={author.name}
          width={80}
          height={80}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full grayscale border border-zinc-200/50 shrink-0 object-cover"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium text-zinc-900 tracking-tight">
              Written by {author.name}
            </h3>
            <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
            </div>
          </div>
          <p className="text-sm text-indigo-600 mb-3">{author.role}</p>
          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
            {author.bio}
          </p>
          <div className="flex items-center gap-3">
            {author.socials.twitter && (
              <Link
                href={author.socials.twitter}
                className="text-zinc-400 hover:text-indigo-600 transition-colors"
                aria-label="Twitter Profile"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            )}
            {author.socials.github && (
              <Link
                href={author.socials.github}
                className="text-zinc-400 hover:text-indigo-600 transition-colors"
                aria-label="GitHub Profile"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </Link>
            )}
            {author.socials.website && (
              <Link
                href={author.socials.website}
                className="text-zinc-400 hover:text-indigo-600 transition-colors"
                aria-label="Personal Website"
              >
                <Globe className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
