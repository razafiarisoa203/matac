const MessageDisplay = ({ submitMessage }) => {
  if (!submitMessage) return null;

  return (
    <div
      className={`mb-4 p-3 border rounded-md ${
        submitMessage.includes("Erreur")
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      <span className="text-sm">{submitMessage}</span>
    </div>
  );
};

export default MessageDisplay;