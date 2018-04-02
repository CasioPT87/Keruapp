import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

//components
import { AppComponent } from './app.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserFormComponent } from './user-form/user-form.component';
// services
import { UserService } from './user.service';
import { MapService } from './map.service';
// route module
import { AppRoutingModule } from './/app-routing.module';
import { MapComponent } from './map/map.component';
import { ListPostsComponent } from './list-posts/list-posts.component';
import { PostComponent } from './post/post.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserModifyComponent } from './user-modify/user-modify.component';




@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    UserFormComponent,
    MapComponent,
    ListPostsComponent,
    PostComponent,
    UserLoginComponent,
    UserModifyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [UserService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
