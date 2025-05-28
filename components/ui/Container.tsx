// components/ui/Container.tsx

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="w-full mx-auto px-4 sm:px-6">{children}</div>;
}
