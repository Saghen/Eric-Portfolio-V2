import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

function loadView(view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView('Home'),
      meta: {
        title: 'Eric Dyer - Portfolio'
      }
    },
    {
      path: '/blog',
      meta: {
        title: 'Sea of Electrons'
      },
      children: [
        {
          path: '',
          component: loadView('blog/Home')
        },
        {
          path: 'insert',
          component: loadView('blog/Insert'),
          meta: {
            auth: true,
            title: 'Insert Post - Sea of Electrons'
          }
        },
        {
          path: 'post/:title',
          component: loadView('blog/Post')
        }
      ],
      component: loadView('blog/Blog')
    }
  ]
});

router.beforeEach((to, from, next) => {
  /*if (to.matched.some(record => record.meta.auth) && !auth.loggedIn())
    return next({
      path: '/blog/login',
      query: { redirect: to.fullPath }
    });*/

  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
    el => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
