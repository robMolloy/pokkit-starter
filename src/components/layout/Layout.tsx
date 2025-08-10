import { Header } from "./Header";
import { LeftSidebar } from "./LeftSidebar";
import { Modal } from "../Modal";

export const PreserveScrollAbility = (p: {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
}) => <div className={`flex h-full flex-col ${p.className ?? ""}`}>{p.children}</div>;

export const Scroll = (p: {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
}) => <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">{p.children}</div>;

export const MainLayout = (p: {
  children: React.ReactNode;
  padding?: boolean;
  fillPageExactly?: boolean;
}) => {
  const padding = p.padding ?? true;
  return (
    <div className={`${p.fillPageExactly ? "h-full" : "min-h-full"} ${padding ? "p-6" : ""}`}>
      {p.children}
    </div>
  );
};
export const MainFixedLayout = (p: { children: React.ReactNode }) => {
  return <PreserveScrollAbility>{p.children}</PreserveScrollAbility>;
};

export const Layout = (p: { children: React.ReactNode; showLeftSidebar: boolean }) => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {p.showLeftSidebar && (
          <PreserveScrollAbility className="w-64">
            <LeftSidebar />
          </PreserveScrollAbility>
        )}

        <div className="flex-1 overflow-y-auto">{p.children}</div>
      </div>
      <Modal />
    </div>
  );
};
