import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register')
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import('../views/loggedin/Play'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/loggedin/Home')
      },
      {
        path: 'woodcutting',
        name: 'Woodcutting',
        component: () => import('../views/loggedin/skills/Woodcutting')
      },
      {
        path: 'mining',
        name: 'Mining',
        component: () => import('../views/loggedin/skills/Mining')
      },
      {
        path: 'fishing',
        name: 'Fishing',
        component: () => import('../views/loggedin/skills/Fishing')
      },
      {
        path: 'combat',
        name: 'Combat',
        component: () => import('../views/loggedin/skills/Combat')
      },
      {
        path: 'crafting',
        name: 'Crafting',
        component: () => import('../views/loggedin/skills/Crafting')
      },
      {
        path: 'smithing',
        name: 'Smithing',
        component: () => import('../views/loggedin/skills/Smithing')
      },
      {
        path: 'equipment',
        name: 'Equipment',
        component: () => import('../views/loggedin/Equipment')
      },
      {
        path: 'cooking',
        name: 'Cooking',
        component: () => import('../views/loggedin/skills/Cooking')
      },
      {
        path: 'adventuring',
        name: 'Adventuring',
        component: () => import('../views/loggedin/skills/Adventuring')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});



router.beforeEach((to, from, next) => {
  let loggedOutRoutes = [
    'Login',
    'Register',
    'Beta'
  ];

  // Check if logged in
  if (localStorage.getItem(process.env.VUE_APP_JWT_NAME) !== null) {
    // If they are logged in proceed, do permissions later
    if (loggedOutRoutes.indexOf(to.name) !== -1)
      router.push({
        name: 'Home'
      });
    else
      next();
  } else {

    // localStorage.removeItem(process.env.VUE_APP_JWT_NAME);

    console.log('toname', to, to.name, loggedOutRoutes.indexOf(to.name))

    // If not logged in, check against the whitelist
    // If they are going to a whitelisted page continue else redirect to login
    if (loggedOutRoutes.indexOf(to.name) !== -1)
      next();
    else
      router.push({
        name: 'Login'
      });
  }
});


export default router
