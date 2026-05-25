import { APP_NAME } from "./constants";
import { markAsRead } from "~/store/email/email.actions";

export const mockAgentMessages = {
  home: [
    {
      text: `👋 Welcome to ${APP_NAME}!`,
    },
    {
      text: `Enjoy a stress-free inbox that’s easier than ever to use! Our new envelope feature helps you organize and identify your different emails at a glance.`,
    },
    {
      text: "💡 Tip: Hit '/' to start searching",
      onClick: () => {
        const searchInput = document.querySelector(
          "input[placeholder=\"Press '/' to focus\"]",
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
    },
  ],

  helps: (unreadCount: number, navigate: any) => [
    {
      text: `What can I help!`,
    },
    {
      text: `You have ${unreadCount} unread ${unreadCount === 1 ? "email" : "emails"}.`,
      onClick: () => {
        navigate("/unread");
      },
    },
  ],

  compose: [
    {
      text: "Help writing this? 🤔",
    },
    {
      text: "Suggest a template",
    },
    {
      text: "Write in formal tone",
    },
  ],

  sent: [
    {
      text: "You can sent now.",
    },
    {
      text: "Or change your envelope",
    },
  ],

  envelope: [
    {
      text: "Envelope helps you easily tell your different types of emails apart at a glance.",
    },
    {
      text: "Pick a template you love or create your own!",
    },
  ],

  read: (emailId: string, emailSubject: string, onClose: () => void) => [
    {
      text: `Mark "${emailSubject.slice(0, 12)}${emailSubject.length > 9 ? "…" : ""}" as unread`,
      onClick: () => {
        markAsRead(emailId, false);
        onClose();
      },
    },
  ],

  reply: [
    {
      text: "Include original message",
    },
    {
      text: "Write a short reply",
    },
  ],
};
