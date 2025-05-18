import type { RouteDefinition } from '@solidjs/router'

import HomePage from './HomePage';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/lp1',
        component: lazy(() => import('./FirstLandingPage'))
    },
]
