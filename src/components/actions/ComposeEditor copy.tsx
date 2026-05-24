import { BsEmojiSmile } from 'solid-icons/bs';
import {
    FaSolidBold,
    FaSolidItalic,
    FaSolidAlignLeft,
    FaSolidAlignCenter,
    FaSolidAlignRight,
    FaSolidAlignJustify,
    FaSolidUnderline,
} from 'solid-icons/fa';
import ColorPickerButton from '../compose/composeStep/envelopeEditor/ColorPickerButton';

const ComposeEditor = () => {
    const actionButtonClasses =
        'w-6 h-6 flex items-center justify-center text-center opacity-80 hover:opacity-100 hover:scale-110 transition-all rounded-full';
    const buttonContainerClasses = 'flex flex-col gap-1';

    return (
        <div class="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-5 p-1">
            {/* Font Selection */}
            <select class="py-1 text-sm bg-(--border) rounded ">
                <option class="text-black bg-white rounded-t">Arial</option>
                <option class="text-black bg-white">Serif</option>
                <option class="text-black bg-white rounded-b">Mono</option>
            </select>

            <ColorPickerButton
                // color="black"
                onChange={(color) => {
                    console.log('Color selected:', color);
                    // Handle the color change here
                }}
                offsetX={30} // 20px to the right
                offsetY={2} // 10px down
            />

            {/* <div class={buttonContainerClasses}>
                <button class={`${actionButtonClasses} text-xl font-arial`}>A</button>
                <button class={`${actionButtonClasses} text-xl font-serif`}>A</button>
                <button class={`${actionButtonClasses} text-xl font-mono`}>A</button>
            </div> */}
            {/* 
            <select class="py-1 text-sm border border-gray-300 rounded">
                <option class="text-black bg-white">Small</option>
                <option class="text-black bg-white">Normal</option>
                <option class="text-black bg-white">Large</option>
            </select> */}

            <div class={buttonContainerClasses}>
                <button class={`${actionButtonClasses} text-md`}>S</button>
                <button class={`${actionButtonClasses} text-lg`}>M</button>
                <button class={`${actionButtonClasses} text-2xl`}>L</button>
            </div>

            <div class={buttonContainerClasses}>
                <button class={actionButtonClasses}>
                    <FaSolidBold size={16} />
                </button>
                <button class={actionButtonClasses}>
                    <FaSolidItalic size={16} />
                </button>
                <button class={actionButtonClasses}>
                    <FaSolidUnderline size={16} />
                </button>
            </div>

            <div class={buttonContainerClasses}>
                <button class={actionButtonClasses}>
                    <FaSolidAlignLeft size={16} />
                </button>
                <button class={actionButtonClasses}>
                    <FaSolidAlignCenter size={16} />
                </button>
                <button class={actionButtonClasses}>
                    <FaSolidAlignRight size={16} />
                </button>
                <button class={actionButtonClasses}>
                    <FaSolidAlignJustify size={16} />
                </button>
            </div>

            <button class={actionButtonClasses}>
                <BsEmojiSmile size={20} />
            </button>
        </div>
    );
};

export default ComposeEditor;
