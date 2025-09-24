export const CenteredItemTemplate = (p: { children: React.ReactNode }) => {
  return (
    <div className="mt-16 flex justify-center">
      <div className="w-[400px]">{p.children}</div>
    </div>
  );
};
