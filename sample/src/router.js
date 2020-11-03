import abc from '../abcHello.js';
import ElementZH from 'element-ui/lib/locale/lang/zh-CN';
import FooSrv from '@/modules/foo/foo.service.js';

const containerFactory = () => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    return () => import(/* webpackChunkName: "appview" */'@/modules/layout/layout');
  }
};
export default [{
  path: '/foo',
  component: containerFactory(),
  children: [
    {
      path: '',
      name: 'foo',
      component: () => import(/* webpackChunkName: "foo" */'./pages/foo')
    },
    {
      path: 'fooDetail/:id',
      name: 'fooDetail',
      component: () => import(/* webpackChunkName: "fooDetail" */'./pages/fooDetail')
    }
  ]
}];