/** Active conversation on the chat page — suppress sidebar unread bumps while viewing. */
let activeConversationId: string | null = null;
let onChatPage = false;

export const chatPresence = {
  get activeConversationId() {
    return activeConversationId;
  },
  get onChatPage() {
    return onChatPage;
  },
  setActive(conversationId: string | null) {
    activeConversationId = conversationId;
  },
  setOnChatPage(value: boolean) {
    onChatPage = value;
  },
};
