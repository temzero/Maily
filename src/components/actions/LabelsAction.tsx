// LabelsAction.jsx
import ActionBar from './ActionBar';
import { FaRegularCalendar, FaSolidCalendar } from 'solid-icons/fa';
import { clearActiveLabels, useSortedLabels } from '~/store/label.store';
import { createMemo } from 'solid-js';
import { LabelIcon } from '../label/LabelIcon';
import { updatePreference, getIsDateView } from '~/store/preferences.store';
import { labelSize } from '~/data/constants';


const LabelsAction = () => {
    const isDateView = createMemo(() => getIsDateView());

    const labelActions = () => {
        const renderLabels = useSortedLabels();

        createMemo(() => {
            console.time('renderLabels update');
            const labels = renderLabels();
            console.timeEnd('renderLabels update');
            return labels;
        });

        return renderLabels().map((label) => ({
            id: label.id.toString(),
            label: label.name,
            icon: (
                <LabelIcon labelId={label.id} iconId={label.iconId} size={labelSize} color={label.color} />
            ),
            onClick: () => label.onClick?.(),
        }));
    };

    const actions = createMemo(() => [
        ...labelActions(),
        {
            divider: true,
        },
        {
            id: 'date-view-labels',
            label: isDateView() ? 'Disable Date View' : 'Enable Date View', // 👈 Call the memo
            icon: isDateView() ? <FaSolidCalendar /> : <FaRegularCalendar />, // 👈 Call the memo
            onClick: () => {
                updatePreference('isDateView', !isDateView()); // 👈 Toggle using current value
                console.log('Date view toggled to:', isDateView());
            },
        },
    ]);

    return <ActionBar actions={actions()} position="left" onContextMenu={clearActiveLabels}/>;
};

export default LabelsAction;
