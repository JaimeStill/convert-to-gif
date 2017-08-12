import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'gif-options',
    templateUrl: 'gif-options.component.html',
    styleUrls: ['gif-options.component.css']
})
export class GifOptionsComponent {
    constructor(private app: AppService) {
        app.getFlagOptions();
        app.getLogOptions();
    }
}
