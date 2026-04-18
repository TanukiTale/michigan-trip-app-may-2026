interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="relative z-10 mb-5 flex flex-col gap-2">
      <span className="eyebrow">{eyebrow}</span>
      <div className="space-y-2">
        <h2 className="font-display text-[1.8rem] leading-none tracking-[-0.03em] text-ink sm:text-[2.2rem]">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-ink/74 sm:text-[0.98rem]">{description}</p>
      </div>
    </div>
  );
}
