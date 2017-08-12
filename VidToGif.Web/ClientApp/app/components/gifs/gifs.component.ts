import { Component, style, state, animate, transition, trigger } from '@angular/core';
import { AppService } from '../../services/app.service';
import { UploadDetails } from '../../models/upload-details.model';

@Component({
    selector: 'gifs',
    templateUrl: 'gifs.component.html',
    styleUrls: ['gifs.component.css'],
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
export class GifsComponent {
    expanded = false;
    constructor(private app: AppService) {
        this.app.getGifs();
    }

    toggleExpand() {
        this.expanded = !this.expanded;
    }

    deleteGif(gif: UploadDetails) {
        this.app.deleteGif(gif);
        this.expanded = false;
    }
}
