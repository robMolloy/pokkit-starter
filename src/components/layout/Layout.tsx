import { Header } from "./Header";
import { LeftSidebar } from "./LeftSidebar";
import { Modal } from "../Modal";

export const PreserveScroll = (p: {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
}) => <div className={`flex h-full flex-col ${p.className ?? ""}`}>{p.children}</div>;

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

export const Layout = (p: { children: React.ReactNode; showLeftSidebar: boolean }) => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {p.showLeftSidebar && (
          <PreserveScroll className="w-64">
            <LeftSidebar />
          </PreserveScroll>
        )}

        <div className="flex-1 overflow-y-auto">{p.children}</div>
      </div>
      <Modal />
    </div>
  );
};
