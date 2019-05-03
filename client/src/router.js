import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

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
      path: '',
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
      component: loadView('blog/Blog'),
      children: [
        {
          path: '/',
          component: loadView('blog/Home')
        },
        {
          path: 'manage',
          meta: {
            auth: true,
            title: 'Manage Posts - Sea of Electrons',
            theme: 'dark',
            headerStuck: true,
            sideNav: true
          },
          component: loadView('blog/manage/Base'),
          children: [
            {
              path: '',
              component: loadView('blog/manage/Home')
            },
            {
              path: 'insert',
              component: loadView('blog/manage/Insert'),
              meta: {
                title: 'Insert Post - Sea of Electrons'
              }
            },
            {
              path: 'edit',
              component: loadView('blog/manage/Edit'),
              meta: {
                title: 'Edit Post - Sea of Electrons'
              }
            },
            {
              path: 'authors',
              component: loadView('blog/manage/Authors'),
              meta: {
                title: 'Manage Authors - Sea of Electrons'
              }
            },
            {
              path: 'topics',
              component: loadView('blog/manage/Topics'),
              meta: {
                title: 'Manage Topics - Sea of Electrons'
              }
            },
            {
              path: 'images',
              component: loadView('blog/manage/Images'),
              meta: {
                title: 'Manage Images - Sea of Electrons'
              }
            }
          ]
        },
        {
          path: 'post/:title',
          component: loadView('blog/Post')
        }
      ]
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
  const arrayForNearest = to.matched.slice().reverse();

  const nearestWithTitle = arrayForNearest.find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = arrayForNearest.find(r => r.meta && r.meta.metaTags);

  const nearestWithTheme = arrayForNearest.find(r => r.meta && r.meta.theme);

  const nearestWithHeaderStuck = arrayForNearest.find(
    r => r.meta && r.meta.headerStuck
  );

  const nearestWithSideNav = arrayForNearest.find(
    r => r.meta && r.meta.sideNav
  );


  document.title = nearestWithTitle ? nearestWithTitle.meta.title : 'Sea of Electrons - Blog';

  store.commit(
    'changeTheme',
    nearestWithTheme ? nearestWithTheme.meta.theme : 'light'
  );

  store.commit(
    'changeStuck',
    nearestWithHeaderStuck ? nearestWithHeaderStuck.meta.headerStuck : false
  );

  store.commit(
    'changeSideNavExists',
    nearestWithSideNav ? nearestWithSideNav.meta.sideNav : false
  );

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
