import toast from "react-hot-toast";

function ChatPage() {
  return (
    <button onClick={() => toast.success("You clicked.")}>ChatPage</button>
  );
}

export default ChatPage;
