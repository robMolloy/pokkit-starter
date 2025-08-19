export function HeaderTemplate(p: { Left: React.ReactNode; Right: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 flex-1 items-center justify-between px-6">
        <span>{p.Left}</span>

        <span>{p.Right}</span>
      </div>
    </header>
  );
}
