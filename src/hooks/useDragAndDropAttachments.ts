import { Accessor, Setter, createSignal, onCleanup } from "solid-js";
import { Attachment } from "~/types/attachment/attachment.type";

type Props = {
  attachments: Accessor<Attachment[]>;
  setAttachments: Setter<Attachment[]>;
  target: Accessor<HTMLElement | undefined>;
  pasteTarget?: Accessor<HTMLElement | undefined>; // Optional separate element for paste
};

export function useDragAndDropAttachments(props: Props) {
  const [isDragging, setIsDragging] = createSignal(false);

  const createAttachment = (file: File): Attachment => ({
    id: crypto.randomUUID(),
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    file,
    url: URL.createObjectURL(file),
  });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const newAttachments = Array.from(files).map(createAttachment);

    props.setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    
    if (!items) return;

    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Handle files from clipboard
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
      
      // Handle images copied from browser/web content
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          // Create a proper filename for pasted images
          const fileExtension = blob.type.split("/")[1] || "png";
          const filename = `pasted-image-${Date.now()}.${fileExtension}`;
          const file = new File([blob], filename, { type: blob.type });
          files.push(file);
        }
      }
      
      // Handle HTML content that might contain images
      if (item.type === "text/html") {
        item.getAsString(async (htmlString) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, "text/html");
          const images = doc.querySelectorAll("img");
          
          for (const img of images) {
            const src = img.src;
            if (src && (src.startsWith("http") || src.startsWith("data:image"))) {
              try {
                const response = await fetch(src);
                const blob = await response.blob();
                const filename = `pasted-image-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${blob.type.split("/")[1] || "png"}`;
                const file = new File([blob], filename, { type: blob.type });
                files.push(file);
              } catch (error) {
                console.error("Failed to fetch image from HTML:", error);
              }
            }
          }
          
          if (files.length > 0) {
            const fakeFileList = {
              length: files.length,
              item: (index: number) => files[index],
              [Symbol.iterator]: function* () {
                for (let i = 0; i < files.length; i++) {
                  yield files[i];
                }
              }
            } as FileList;
            
            handleFiles(fakeFileList);
          }
        });
      }
    }
    
    // Handle regular file items
    if (files.length > 0) {
      const fakeFileList = {
        length: files.length,
        item: (index: number) => files[index],
        [Symbol.iterator]: function* () {
          for (let i = 0; i < files.length; i++) {
            yield files[i];
          }
        }
      } as FileList;
      
      handleFiles(fakeFileList);
    }
  };

  const dragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const dragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const dragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = props.target();

    if (
      target &&
      e.relatedTarget &&
      target.contains(e.relatedTarget as Node)
    ) {
      return;
    }

    setIsDragging(false);
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    handleFiles(e.dataTransfer?.files ?? null);
  };

  const setup = () => {
    const element = props.target();
    const pasteElement = props.pasteTarget?.() || element;

    if (!element) return;

    // Drag and drop events
    element.addEventListener("dragenter", dragEnter);
    element.addEventListener("dragover", dragOver);
    element.addEventListener("dragleave", dragLeave);
    element.addEventListener("drop", drop);

    // Paste events
    if (pasteElement) {
      pasteElement.addEventListener("paste", handlePaste);
    }

    onCleanup(() => {
      element.removeEventListener("dragenter", dragEnter);
      element.removeEventListener("dragover", dragOver);
      element.removeEventListener("dragleave", dragLeave);
      element.removeEventListener("drop", drop);
      
      if (pasteElement) {
        pasteElement.removeEventListener("paste", handlePaste);
      }
    });
  };

  return {
    isDragging,
    setup,
  };
}