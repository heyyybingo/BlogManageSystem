import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const router = new VueRouter({
    routes: [{
            path: "/",
            redirect: '/login',

        },
        {
            path: "/login",
            component: () => import("./Views/Login/index.vue")
        }, {
            path: "/Home",
            component: () => import("./Views/Home/index.vue"),
            children: [{
                path: "main",
                component: () => import("./Views/main/index.vue")
            }, {
                path: "createArticle",
                component: () => import("./Views/createArticle/index.vue")
            }, {
                path: "artList",
                component: () => import("./Views/ArticleList/index.vue")
            }, {
                path: "tagList",
                component: () => import("./Views/tagList/index.vue")
            }, {
                path: "userManage",
                component: () => import("./Views/userManage/index.vue")
            }, {
                path: "article",
                component: () => import("./Views/Article/index.vue")
            }, {
                path: "updateArticle",
                component: () => import("./Views/updateArticle/index.vue")
            }]
        }
    ]
})


export default router