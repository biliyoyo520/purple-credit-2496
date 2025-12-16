import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx', { id: 'index' }),
  route('/resources', 'routes/home.tsx', { id: 'resources' }),
] satisfies RouteConfig;


