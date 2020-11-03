import module from '@/modules/foo/pages/foo';
import routes from '@/modules/foo/foo.router.js';
import store from '@/store/modules/foo';
import config from '@/utils/config.utils';
import locale from '@/i18n/locale';

export default {
  module,
  routes,
  store: { foo: store },
  locale: { foo: locale.foo },
  config
};
