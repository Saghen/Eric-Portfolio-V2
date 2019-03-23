import Vue from 'vue'
import Router from 'vue-router'

import Blog from '@/views/blog/Blog.vue';
import BlogHome from '@/views/blog/Home.vue';
import BlogInsert from '@/views/blog/Insert.vue';
import BlogPost from '@/views/blog/Post.vue';

Vue.use(Router);

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView('Home')
    },
    {
      path: '/blog',
      children: [
        {
          path: '/',
          component: BlogHome
        },
        {
          path: 'insert',
          component: BlogInsert
        },
        {
          path: 'post/:title',
          component: BlogPost
        }
      ],
      component: Blog
    }
  ]
})
