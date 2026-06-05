interface TopNavProps {
  onMenuChange?: (id: string) => void;
}

export default function Header({ onMenuChange: _onMenuChange }: TopNavProps) {
  return (
    <header className="border-tech-border z-[100] flex h-[100px] shrink-0 items-center justify-between border-b bg-[#020917]/50 px-10"></header>
  );
}
