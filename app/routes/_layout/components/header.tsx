interface TopNavProps {
  onMenuChange?: (id: string) => void;
}

export default function Header({ onMenuChange: _onMenuChange }: TopNavProps) {
  return (
    <header className="h-[100px] flex items-center justify-between px-10 bg-[#020917]/50 border-b border-tech-border z-[100] shrink-0"></header>
  );
}
