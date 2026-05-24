// components/compose/EnvelopePreview.tsx
import { Envelope } from '~/components/envelop/Envelop';
import { mailDimensions } from '~/data/constants';
import { Avatar } from '~/components/ui/Avatar';
import { currentUser } from '~/store/auth.store';
import { EnvelopeType } from '~/types/envelop/envelop.type';

type EnvelopePreviewProps = {
    envelope: EnvelopeType | null;
    subject?: string;
    showSender?: boolean;
    width?: number;
    height?: number;
    borderWidth?: number;
    class?: string;
};

export default function EnvelopePreview(props: EnvelopePreviewProps) {
    return (
        <Envelope
        envelope={props.envelope}
            width={props.width || mailDimensions.width * 3}
            height={props.height || mailDimensions.height * 3}
            borderWidth={props.borderWidth || 16}
            class={`${props.class} shadow-none`}
            shadow={false}
        >
            <div class="w-full h-full flex flex-col justify-between p-2 select-none">
                <h1 class="font-bold text-4xl p-1 wrap-break-word line-clamp-2">
                    {props.subject || 'Subject line'}
                </h1>

                {props.showSender !== false && (
                    <div class="flex gap-2 items-end justify-between">
                        <div class="flex items-center gap-2">
                            <Avatar
                                src={currentUser()?.avatarUrl}
                                name={`${currentUser()?.firstName} ${currentUser()?.lastName}`}
                                size="lg"
                            />
                            <div class="flex flex-col -space-y-1">
                                <h1 class="font-bold text-xl line-clamp-1">
                                    {`${currentUser()?.firstName} ${currentUser()?.lastName}`}
                                </h1>
                                <p class="text-sm line-clamp-1">{`${currentUser()?.email}`}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Envelope>
    );
}
