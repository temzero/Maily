import { useLocation, useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { SlidingSelector } from '~/components/actions/SlidingSelector';
import { navHeight } from '~/constants/height';
import { NAVIGATION_ITEMS } from '~/data/constants';

interface NavItem {
    name: string;
    href: string;
    current: boolean;
}

const Navigator: Component = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Convert NAVIGATION_ITEMS to SlidingSelector options format
    const options = NAVIGATION_ITEMS.map((item) => ({
        value: item.href,
        label: item.name,
    }));

    // Get currently selected value based on current URL path
    const getSelectedValue = () => {
        const currentPath = location.pathname;
        const currentItem = NAVIGATION_ITEMS.find((item) => item.href === currentPath);
        return currentItem?.href || NAVIGATION_ITEMS[0]?.href || '';
    };

    // Handle selection change - update URL without navigation
    const handleSelect = (value: string) => {
        // Use navigate with replace: true to update URL without adding to history stack
        // and without triggering a full page reload (just client-side routing)
        navigate(value);
    };

    return (
        <SlidingSelector
            options={options}
            selected={getSelectedValue()}
            onSelect={handleSelect}
            height={navHeight}
            borderWidth={1}
        />
    );
};

export default Navigator;
