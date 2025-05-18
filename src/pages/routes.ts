import type { RouteDefinition } from '@solidjs/router'

import HomePage from './HomePage';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
    {
        path: '/',
        component: HomePage,
    },
    // {
    //     path: '/lp1',
    //     component: lazy(() => import('./FirstLandingPage'))
    // },
    {
        path: '/lp2',
        component: lazy(() => import('./SecondLandingPage'))
    },
    {
        path: '/lp3',
        component: lazy(() => import('./ThirdLandingPage'))
    },
    {
        path: '/lp4',
        component: lazy(() => import('./FourthLandingPage'))
    },
]
