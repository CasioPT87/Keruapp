import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent }      from './user-profile/user-profile.component';
import { UserFormComponent }      from './user-form/user-form.component';
import { UserLoginComponent }      from './user-login/user-login.component';
import { MapComponent }      from './map/map.component';
import { ListPostsComponent }      from './list-posts/list-posts.component';
import { PostComponent }      from './post/post.component';
import { UserModifyComponent }      from './user-modify/user-modify.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: ListPostsComponent, pathMatch: 'full' },
  { path: 'user/:name', component: UserProfileComponent },
  { path: 'usercreate', component: UserFormComponent },
  { path: 'userlogin', component: UserLoginComponent },
  { path: 'usermodify', component: UserModifyComponent },
  { path: 'postcreate', component: MapComponent },
  { path: 'listposts', component: ListPostsComponent },
  { path: 'post/:postNumber', component: PostComponent },
  { path: '**', component: ListPostsComponent },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
