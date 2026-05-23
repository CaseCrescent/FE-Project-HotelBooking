import type { ReactNode } from "react";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import { Reveal, RevealItem } from "@/components/shared/Reveal";

// Shared shell for every static info page (Privacy, Terms, About, etc.).
// One component → consistent eyebrow / heading / scroll-reveal across the legal+brand pack.
export default function InfoPageLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
}) {
  return (
    <PageShell narrow>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Reveal className="flex flex-col gap-8 md:gap-10">
        {Array.isArray(children) ? (
          children.map((child, i) => <RevealItem key={i}>{child}</RevealItem>)
        ) : (
          <RevealItem>{children}</RevealItem>
        )}
      </Reveal>
    </PageShell>
  );
}
