import { cn } from '@blog-builder/ui';

const DEFAULT_FADE = 'mask-radial-fade';
const DEFAULT_HEIGHT = 'h-[600px]';

type DecorativeGridBackgroundProps = {
  className?: string;
  /** e.g. `h-[600px]`, `h-[680px]` */
  heightClassName?: string;
  /** e.g. `mask-radial-fade` or `mask-radial-fade-ad` — defined in `global.css` */
  fadeClassName?: string;
};

/**
 * Full-bleed decorative grid behind page content. Reuse on any screen; tune fade via CSS utilities.
 */
export function DecorativeGridBackground({
  className,
  heightClassName = DEFAULT_HEIGHT,
  fadeClassName = DEFAULT_FADE,
}: DecorativeGridBackgroundProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-0 bg-grid-pattern pointer-events-none',
        heightClassName,
        fadeClassName,
        className,
      )}
      aria-hidden
    />
  );
}
