import { Component } from 'solid-js';
import Button from './Button';
import { VsArrowLeft } from 'solid-icons/vs';

const AllButtons: Component = () => {
    return (
        <div class="p-8 space-y-8">
            {/* Variants Section */}
            <section>
                <h2 class="text-xl font-bold mb-4">Button Variants</h2>
                <div class="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => console.log('Primary clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="primary"
                        size='md'
                        label="Primary"
                    />
                    <Button 
                        onClick={() => console.log('Glass clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="glass"
                        size='md'
                        label="Glass"
                    />
                    <Button 
                        onClick={() => console.log('Ghost clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="ghost"
                        size='md'
                        label="Ghost"
                    />
                    <Button 
                        onClick={() => console.log('Danger clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="danger"
                        size='md'
                        label="Danger"
                    />
                    <Button 
                        onClick={() => console.log('Success clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="success"
                        size='md'
                        label="Success"
                    />
                    <Button 
                        onClick={() => console.log('Warning clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="warning"
                        size='md'
                        label="Warning"
                    />
                    <Button 
                        onClick={() => console.log('Outline clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="outline"
                        size='md'
                        label="Outline"
                    />
                    <Button 
                        onClick={() => console.log('Link clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="link"
                        size='md'
                        label="Link"
                    />
                </div>
            </section>

            {/* Loading States */}
            <section>
                <h2 class="text-xl font-bold mb-4">Loading States</h2>
                <div class="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => console.log('Loading primary')}
                        icon={<VsArrowLeft size={24} />}
                        variant="primary"
                        size='md'
                        label="Loading"
                        loading={true}
                    />
                    <Button 
                        onClick={() => console.log('Loading danger')}
                        icon={<VsArrowLeft size={24} />}
                        variant="danger"
                        size='md'
                        label="Loading"
                        loading={true}
                    />
                    <Button 
                        onClick={() => console.log('Loading success')}
                        icon={<VsArrowLeft size={24} />}
                        variant="success"
                        size='md'
                        label="Loading"
                        loading={true}
                    />
                </div>
            </section>

            {/* Sizes Section */}
            <section>
                <h2 class="text-xl font-bold mb-4">Button Sizes</h2>
                <div class="flex flex-wrap items-center gap-4">
                    <Button 
                        onClick={() => console.log('XS clicked')}
                        icon={<VsArrowLeft size={16} />}
                        variant="primary"
                        size='xs'
                        label="XS"
                    />
                    <Button 
                        onClick={() => console.log('SM clicked')}
                        icon={<VsArrowLeft size={20} />}
                        variant="primary"
                        size='sm'
                        label="SM"
                    />
                    <Button 
                        onClick={() => console.log('MD clicked')}
                        icon={<VsArrowLeft size={24} />}
                        variant="primary"
                        size='md'
                        label="MD"
                    />
                    <Button 
                        onClick={() => console.log('LG clicked')}
                        icon={<VsArrowLeft size={28} />}
                        variant="primary"
                        size='lg'
                        label="LG"
                    />
                    <Button 
                        onClick={() => console.log('XL clicked')}
                        icon={<VsArrowLeft size={32} />}
                        variant="primary"
                        size='xl'
                        label="XL"
                    />
                </div>
            </section>

            {/* Icon Only Section */}
            <section>
                <h2 class="text-xl font-bold mb-4">Icon Only Buttons</h2>
                <div class="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => console.log('Icon primary')}
                        icon={<VsArrowLeft size={24} />}
                        variant="primary"
                        size='md'
                    />
                    <Button 
                        onClick={() => console.log('Icon glass')}
                        icon={<VsArrowLeft size={24} />}
                        variant="glass"
                        size='md'
                    />
                    <Button 
                        onClick={() => console.log('Icon danger')}
                        icon={<VsArrowLeft size={24} />}
                        variant="danger"
                        size='md'
                    />
                    <Button 
                        onClick={() => console.log('Icon outline')}
                        icon={<VsArrowLeft size={24} />}
                        variant="outline"
                        size='md'
                    />
                </div>
            </section>

            {/* Text Only Section */}
            <section>
                <h2 class="text-xl font-bold mb-4">Text Only Buttons</h2>
                <div class="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => console.log('Text primary')}
                        variant="primary"
                        size='md'
                        label="Primary"
                    />
                    <Button 
                        onClick={() => console.log('Text danger')}
                        variant="danger"
                        size='md'
                        label="Delete"
                    />
                    <Button 
                        onClick={() => console.log('Text success')}
                        variant="success"
                        size='md'
                        label="Save"
                    />
                </div>
            </section>

            {/* Full Width Section */}
            <section>
                <h2 class="text-xl font-bold mb-4">Full Width Buttons</h2>
                <div class="space-y-2">
                    <Button 
                        onClick={() => console.log('Full width primary')}
                        icon={<VsArrowLeft size={24} />}
                        variant="primary"
                        size='md'
                        label="Full Width Button"
                        isFullWidth={true}
                    />
                    <Button 
                        onClick={() => console.log('Full width outline')}
                        icon={<VsArrowLeft size={24} />}
                        variant="outline"
                        size='md'
                        label="Full Width Outline"
                        isFullWidth={true}
                    />
                </div>
            </section>

            {/* Disabled Section */}
            <section>
                <h2 class="text-xl font-bold mb-4">Disabled Buttons</h2>
                <div class="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => console.log('Disabled primary')}
                        icon={<VsArrowLeft size={24} />}
                        variant="primary"
                        size='md'
                        label="Disabled"
                        disabled={true}
                    />
                    <Button 
                        onClick={() => console.log('Disabled outline')}
                        icon={<VsArrowLeft size={24} />}
                        variant="outline"
                        size='md'
                        label="Disabled"
                        disabled={true}
                    />
                    <Button 
                        onClick={() => console.log('Disabled icon')}
                        icon={<VsArrowLeft size={24} />}
                        variant="danger"
                        size='md'
                        disabled={true}
                    />
                </div>
            </section>
        </div>
    );
};

export default AllButtons;