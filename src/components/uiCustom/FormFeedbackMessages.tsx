const classMap: Record<string, string> = {
  error: "bg-destructive/75",
  success: "bg-green-500/50",
};

export const FormFeedbackMessages = (p: { messages: string[]; status: "success" | "error" }) => {
  const [title, ...otherMessages] = p.messages;

  return (
    <div
      className={`mb-4 rounded-md p-3 text-center text-sm text-white ${classMap[p.status] ?? ""}`}
    >
      <div className="text-lg font-bold">{title}</div>
      {otherMessages && otherMessages.map((message, i) => <div key={i}>{message}</div>)}
    </div>
  );
};
