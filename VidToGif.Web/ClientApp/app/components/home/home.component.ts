import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {
    constructor(private app: AppService) {}

    fileChange(video: File) {
        this.app.video.next(video);
    }

    uploadVideo(formData: FormData) {
        this.app.uploadVideo(formData);
    }
}
