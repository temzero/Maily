// components/email/EmptyFolder.tsx
import { Component } from 'solid-js';
import { EmailFolder } from '~/types/email/email.type';
import {
    HiOutlineFolderOpen,
    HiOutlineTrash,
    HiOutlinePaperAirplane,
    HiOutlineDocumentDuplicate,
} from 'solid-icons/hi';
import { BsMailboxFlag } from 'solid-icons/bs';

interface EmptyFolderProps {
    folder: EmailFolder;
    isTrash?: boolean;
}

const EmptyFolder: Component<EmptyFolderProps> = (props) => {
    const getIcon = () => {
        if (props.isTrash) return <HiOutlineTrash size={60} />;

        switch (props.folder) {
            case EmailFolder.INBOX:
                return <BsMailboxFlag size={60} />;
            case EmailFolder.SENT:
                return <HiOutlinePaperAirplane size={60} />;
            case EmailFolder.DRAFTS:
                return <HiOutlineDocumentDuplicate size={60} />;
            default:
                return <HiOutlineFolderOpen size={60} />;
        }
    };

    const getTitle = () => {
        if (props.isTrash) return 'Trash is empty';
        const folderName = props.folder.charAt(0).toUpperCase() + props.folder.slice(1);
        return `${folderName} is empty`;
    };

    return (
        <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-red-500 opacity-75">
            {getIcon()}
            <h3 class="text-2xl font-semibold">{getTitle()}</h3>
        </div>
    );
};

export default EmptyFolder;
