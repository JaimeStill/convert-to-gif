import { Component, style, state, animate, transition, trigger } from '@angular/core';
import { AppService } from '../../services/app.service';
import { UploadDetails } from '../../models/upload-details.model';

@Component({
    selector: 'uploads',
    templateUrl: 'uploads.component.html',
    styleUrls: ['uploads.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0}),
                animate(350, style({opacity: 1}))
            ]),
            transition(':leave', [
                animate(350, style({opacity: 0}))
            ])
        ])
    ]
})
export class UploadsComponent {
    expanded = false;
    constructor(private app: AppService) {
        this.app.getUploads();
    }

    toggleExpand() {
        this.expanded = !this.expanded;
    }

    convertUpload(upload: UploadDetails) {
        this.app.convertUpload(upload);
        this.expanded = false;
    }

    deleteUpload(upload: UploadDetails) {
        this.app.deleteUpload(upload);
        this.expanded = false;
    }
}
