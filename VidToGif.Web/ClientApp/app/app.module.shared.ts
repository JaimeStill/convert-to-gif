import { NgModule } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from './app.module.material';

import { AppService } from './services/app.service';
import { ThemeService } from './services/theme.service';
import { ToasterService } from './services/toaster.service';
import { CoreApiService } from './services/core-api.service';
import { NoCacheRequestOptions } from './services/no-cache-request-options';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ConsoleComponent } from './components/console/console.component';
import { UploadsComponent } from './components/uploads/uploads.component';
import { GifOptionsComponent } from './components/gif-options/gif-options.component';
import { GifsComponent } from './components/gifs/gifs.component';

export const sharedConfig: NgModule = {
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HomeComponent,
        FileUploadComponent,
        ConsoleComponent,
        UploadsComponent,
        GifOptionsComponent,
        GifsComponent
    ],
    providers: [
        AppService,
        ThemeService,
        ToasterService,
        CoreApiService,
        { provide: RequestOptions, useClass: NoCacheRequestOptions }
    ],
    imports: [
        AppMaterialModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
};
