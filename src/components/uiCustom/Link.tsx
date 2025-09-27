import NextLink from "next/link";

export const Link = (p: {
  href: string;
  children: React.ReactNode;
  className?: React.ComponentProps<typeof NextLink>["className"];
}) => {
  return (
    <NextLink
      href={p.href}
      className={`underline decoration-muted-foreground hover:decoration-primary hover:underline-offset-2 ${p.className}`}
    >
      {p.children}
    </NextLink>
  );
};
