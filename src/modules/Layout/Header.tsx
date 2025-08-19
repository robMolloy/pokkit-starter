import { CustomIcon } from "@/components/CustomIcon";
import { HeaderTemplate } from "@/components/layout/HeaderTemplate";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export const Header = () => {
  return (
    <HeaderTemplate
      Left={
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <CustomIcon iconName="Cloud" size="lg" />
          <span className="font-bold">pokkit Starter</span>
        </Link>
      }
      Right={<ThemeToggle />}
    />
  );
};
