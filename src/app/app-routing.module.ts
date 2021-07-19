import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /* {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
   */ {
    path: '',
    redirectTo: 'slides',
    pathMatch: 'full',
  },
  {
    path: 'slides',
    /* loadChildren: () =>
      import('./slides/slides.module').then((m) => m.SlidesPageModule),
      */ children: [
      {
        path: '',
        loadChildren: () =>
          import('./slides/slides.module').then((m) => m.SlidesPageModule),
      },
      {
        path: 'connect',
        loadChildren: () =>
          import('./connect/connect.module').then((m) => m.ConnectPageModule),
      },
      {
        path: 'comment',
        loadChildren: () =>
          import('./comment/comment.module').then((m) => m.CommentPageModule),
      },
      {
        path: 'read',
        loadChildren: () =>
          import('./read/read.module').then((m) => m.ReadPageModule),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('./history/history.module').then((m) => m.HistoryPageModule),
      },
      {
        path: 'multiple-devices',
        loadChildren: () =>
          import('./multiple-devices/multiple-devices.module').then(
            (m) => m.MultipleDevicesPageModule
          ),
      },
    ],
  },

  /*  {
    path: 'connect',
    loadChildren: () =>
      import('./connect/connect.module').then((m) => m.ConnectPageModule),
  }, */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
