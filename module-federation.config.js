// module-federation.config.js
import { federation } from '@module-federation/vite'

export default federation({
    name: 'solid_provider',
    filename: 'remoteEntry.js',
    exposes: {
        
    },
    shared: {
        'solid-js': {
            singleton: true,
            requiredVersion: '^1.8.0',
        },
    },
})
