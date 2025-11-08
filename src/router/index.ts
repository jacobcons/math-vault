import PaperBrowserView from '@/views/PaperBrowserView.vue';
import QuestionBrowserView from '@/views/QuestionBrowserView.vue';
import WorksheetView from '@/views/WorksheetView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: QuestionBrowserView,
      beforeEnter: (to) => {
        const { qids } = to.query;
        return !qids ? undefined : { path: '/worksheet', query: to.query };
      },
    },
    { path: '/question-browser', component: QuestionBrowserView },
    { path: '/paper-browser', component: PaperBrowserView },
    { path: '/worksheet', component: WorksheetView },
  ],
});

export default router;
