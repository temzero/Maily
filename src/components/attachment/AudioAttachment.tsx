import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiHeadphones } from 'solid-icons/fi';
import { Attachment, formatFileSize } from '~/types/attachment/attachment.type';
import { AttachmentWrapper } from './info/AttachmentWrapper';
import { AttachmentInfo } from './info/AttachmentInfo';
import { ActionButtons } from './buttons/ActionButtons';
import { RenderAttachmentMode } from './RenderAttachments';
import { ImPlay3 } from 'solid-icons/im';
import { MdFillPause } from 'solid-icons/md';

type Props = {
    attachment: Attachment;
    mode: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
};

export const AudioAttachment = (props: Props) => {
    let audioRef: HTMLAudioElement | undefined;
    const [isPlaying, setIsPlaying] = createSignal(false);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [duration, setDuration] = createSignal(0);
    const [volume, setVolume] = createSignal(1);
    const [isMuted, setIsMuted] = createSignal(false);

    onMount(() => {
        if (audioRef) {
            audioRef.addEventListener('timeupdate', () => {
                setCurrentTime(audioRef!.currentTime);
            });

            audioRef.addEventListener('loadedmetadata', () => {
                setDuration(audioRef!.duration);
            });

            audioRef.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });
        }
    });

    onCleanup(() => {
        if (audioRef) {
            audioRef.pause();
            audioRef.removeEventListener('timeupdate', () => {});
            audioRef.removeEventListener('loadedmetadata', () => {});
            audioRef.removeEventListener('ended', () => {});
        }
    });

    const togglePlay = () => {
        if (!audioRef) return;

        if (isPlaying()) {
            audioRef.pause();
            setIsPlaying(false);
        } else {
            audioRef.play();
            setIsPlaying(true);
        }
    };

    const handleTimeChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const newTime = parseFloat(target.value);
        if (audioRef) {
            audioRef.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const newVolume = parseFloat(target.value);
        setVolume(newVolume);
        if (audioRef) {
            audioRef.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (audioRef) {
            if (isMuted()) {
                audioRef.volume = volume();
                setIsMuted(false);
            } else {
                audioRef.volume = 0;
                setIsMuted(true);
            }
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <AttachmentWrapper class="p-2 pb-1">
            {/* Audio Info Section */}

            {/* Hidden audio element */}
            <audio ref={audioRef} src={props.attachment.url} preload="metadata" />

            {/* Custom Audio Controls */}
            <div class="flex space-x-2 w-full">
                {/* Progress Bar */}
                <button
                    onClick={togglePlay}
                    class="w-10 h-10  flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 custom-border"
                    aria-label={isPlaying() ? 'Pause' : 'Play'}
                >
                    {isPlaying() ? <MdFillPause size={24} /> : <ImPlay3 size={24} />}
                </button>

                <div class="flex-1 space-y-1">
                    <div class="flex-1 min-w-0">
                        <AttachmentInfo
                            filename={props.attachment.filename}
                            size={props.attachment.size}
                            filenameClass="text-sm text-white"
                            sizeClass="text-xs text-white/60"
                            // class="flex items-center gap-2"
                        />
                    </div>
                </div>
            </div>
            <div class="relative -mt-1">
                <span class="absolute right-0 -top-1 text-xs text-white/60 ml-auto ">
                    {currentTime() > 0 ? `${formatTime(currentTime())} / ` : ''}
                    {formatTime(duration())}
                </span>
                <input
                    type="range"
                    min="0"
                    max={duration() || 0}
                    value={currentTime()}
                    onInput={handleTimeChange}
                    class="h-1 w-full bg-white rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 ${(currentTime() / (duration() || 1)) * 100}%, #4b5563 ${(currentTime() / (duration() || 1)) * 100}%)`,
                    }}
                />
            </div>

            {/* Action Buttons - Top Right */}
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionButtons
                    attachment={props.attachment}
                    mode={props.mode}
                    onRemove={props.onRemove}
                    onDownload={props.onDownload}
                />
            </div>
        </AttachmentWrapper>
    );
};
