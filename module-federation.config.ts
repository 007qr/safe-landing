import federation from '@originjs/vite-plugin-federation';

export default federation({
    name: 'stopper',
    filename: 'remoteEntry.js',
    exposes: {
        './Descriptor': './src/components/descriptor/Descriptor.tsx',
        './DescriptorFlowProvider': './src/components/descriptor/DescriptorFlowProvider.tsx',
        './Button': './src/ui/base/Button.tsx',
        './AIWidget': './src/components/AiResponse/AIWidget.tsx'
        // './ListDescriptor': './src/components/descriptor/screens/ListDescriptor.tsx',
    },
    shared: ['solid-js'],
    
})
