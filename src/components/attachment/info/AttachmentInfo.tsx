import { formatFileSize } from '~/types/attachment/attachment.type';

type Props = {
    filename: string;
    size?: number;
    class?: string;
    filenameClass?: string;
    sizeClass?: string;
};

export const AttachmentInfo = (props: Props) => {
    return (
        <div class={props.class || ''}>
            <p class={`truncate font-medium ${props.filenameClass || 'text-sm text-white'}`}>
                {props.filename}
            </p>

            {props.size && (
                <p class={`${props.sizeClass || 'text-xs text-white/80'}`}>
                    {formatFileSize(props.size)}
                </p>
            )}
        </div>
    );
};
