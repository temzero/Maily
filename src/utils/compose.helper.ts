// utils/compose.helper.ts
import { Email, EmailFolder } from "~/types/email/email.type";

/**
 * Checks if HTML content is effectively empty (no visible text or meaningful content)
 * @param htmlContent - The HTML string from contenteditable
 * @returns true if content is empty/whitespace only
 */
export const isHtmlContentEmpty = (htmlContent: string): boolean => {
  const trimmedContent = htmlContent?.trim() || "";
  if (!trimmedContent) return true;

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = trimmedContent;

  // Get text content and check if it's empty
  const textContent = tempDiv.textContent?.trim() || "";

  // Check for visible content (text, images, embeds, etc.)
  const hasVisibleContent =
    textContent !== "" ||
    Array.from(tempDiv.querySelectorAll("img, iframe, video, object, embed"))
      .length > 0;

  // Check if the HTML consists only of empty elements like <br>, <div><br></div>, etc.
  const isEmptyHtmlStructure =
    !hasVisibleContent &&
    (!trimmedContent ||
      /^(<br\s*\/?>|<\w+>\s*<br\s*\/?>\s*<\/\w+>|\s*)+$/i.test(trimmedContent));

  return isEmptyHtmlStructure || !hasVisibleContent;
};

/**
 * Gets plain text from HTML content
 * @param htmlContent - The HTML string
 * @returns Plain text content
 */
export const getPlainTextFromHtml = (htmlContent: string): string => {
  if (!htmlContent) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent?.trim() || "";
};

/**
 * Checks if compose content is valid (has subject, content, or attachments)
 * @param subject - Email subject
 * @param contentHtml - Email content as HTML
 * @param attachments - Array of attachments
 * @returns true if compose has any content
 */
export const isComposeContentValid = (
  subject: string,
  contentHtml: string,
  attachments: any[],
): boolean => {
  const hasSubject = subject.trim() !== "";
  const hasAttachments = attachments.length > 0;
  const hasValidContent = !isHtmlContentEmpty(contentHtml);

  return hasSubject && (hasValidContent || hasAttachments);
};

/**
 * Checks if email is sendable (has recipient and content)
 * @param subject - Email subject
 * @param contentHtml - Email content as HTML
 * @param isRecipientValid - Whether recipient is valid
 * @returns true if email can be sent
 */
export const isEmailSendable = (
  subject: string,
  contentHtml: string,
  isRecipientValid: boolean,
): boolean => {
  const hasSubjectOrContent =
    subject.trim() !== "" || !isHtmlContentEmpty(contentHtml);
  return hasSubjectOrContent && isRecipientValid;
};

/**
 * Cleans up blob URLs from attachments
 * @param attachments - Array of attachments
 */
export const cleanupAttachmentBlobs = (attachments: any[]): void => {
  attachments.forEach((attachment) => {
    if (attachment.url?.startsWith("blob:")) {
      URL.revokeObjectURL(attachment.url);
    }
  });
};

/**
 * Creates a draft email object
 * @param id - Email ID
 * @param recipient - Recipient email
 * @param subject - Email subject
 * @param contentHtml - Email content as HTML
 * @param attachments - Array of attachments
 * @returns Draft email object
 */
export const createDraftEmail = (
  id: string,
  recipient: string,
  subject: string,
  contentHtml: string,
  attachments: any[],
): Email => {
  const plainTextContent = getPlainTextFromHtml(contentHtml);

  return {
    id,
    from: "me@example.com",
    to: [recipient],
    subject,
    content: contentHtml,
    preview: plainTextContent.substring(0, 100),
    folder: EmailFolder.DRAFTS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: false,
    attachments,
  };
};

/**
 * Creates a sent email object
 * @param id - Email ID
 * @param recipient - Recipient email
 * @param subject - Email subject
 * @param contentHtml - Email content as HTML
 * @param attachments - Array of attachments
 * @param envelope - Envelope data
 * @returns Sent email object
 */
export const createSentEmail = (
  id: string,
  recipient: string,
  subject: string,
  contentHtml: string,
  attachments: any[],
  envelope: any,
): Email => {
  const plainTextContent = getPlainTextFromHtml(contentHtml);

  return {
    id,
    from: "me@example.com",
    to: [recipient],
    subject,
    content: contentHtml,
    preview: plainTextContent.substring(0, 100),
    isRead: true,
    folder: EmailFolder.SENT,
    envelope,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments,
  };
};

/**
 * Formats subject for reply
 * @param originalSubject - Original email subject
 * @returns Formatted reply subject
 */
export const formatReplySubject = (originalSubject?: string): string => {
  if (!originalSubject) return "";
  return originalSubject.toLowerCase().startsWith("re:")
    ? originalSubject
    : `Re: ${originalSubject}`;
};

/**
 * Formats subject for forward
 * @param originalSubject - Original email subject
 * @returns Formatted forward subject
 */
export const formatForwardSubject = (originalSubject?: string): string => {
  if (!originalSubject) return "";
  return originalSubject.toLowerCase().startsWith("fwd:")
    ? originalSubject
    : `Fwd: ${originalSubject}`;
};
