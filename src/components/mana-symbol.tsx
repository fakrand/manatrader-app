import { cn } from "@/lib/utils";

type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G';

interface ManaSymbolProps extends React.SVGProps<SVGSVGElement> {
  color: ManaColor;
}

const colorMap = {
  W: 'var(--wubrg-w)',
  U: 'var(--wubrg-u)',
  B: 'var(--wubrg-b)',
  R: 'var(--wubrg-r)',
  G: 'var(--wubrg-g)',
};

const iconMap: Record<ManaColor, React.ReactNode> = {
  W: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a1 1 0 0 0-1 1v3h-3a1 1 0 0 0 0 2h3v3a1 1 0 0 0 2 0v-3h3a1 1 0 0 0 0-2h-3v-3a1 1 0 0 0-1-1z" />,
  U: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4.24-11.24a1 1 0 0 0-1.41-1.41L12 10.59 9.17 7.76a1 1 0 1 0-1.41 1.41L10.59 12l-2.83 2.83a1 1 0 0 0 1.41 1.41L12 13.41l2.83 2.83a1 1 0 0 0 1.41-1.41L13.41 12z" />,
  B: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-4-9h8a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2z" />,
  R: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4-10a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1z" />,
  G: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-4-9a4 4 0 1 1 4 4 4 4 0 0 1-4-4z" />,
};

export function ManaSymbol({ color, className, ...props }: ManaSymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={colorMap[color]}
      className={cn("h-6 w-6", className)}
      {...props}
    >
      {iconMap[color]}
    </svg>
  );
}
