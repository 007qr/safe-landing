import federation from '@originjs/vite-plugin-federation';

export default federation({
    name: 'stopper',
    filename: 'remoteEntry.js',
    exposes: {
        './Descriptor': './src/components/descriptor/Descriptor.tsx',
        './DescriptorFlowProvider': './src/components/descriptor/DescriptorFlowProvider.tsx',
    },
    shared: ['solid-js']
})
