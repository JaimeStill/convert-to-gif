import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ConsoleOutput } from '../../models/console-output.model';

@Component({
    selector: 'console',
    templateUrl: 'console.component.html',
    styleUrls: ['console.component.css']
})
export class ConsoleComponent implements AfterViewChecked {
    @ViewChild('outputContainer') container: ElementRef;

    constructor(private app: AppService) { }

    ngAfterViewChecked() {
        this.scrollConsole();
    }

    scrollConsole() {
        this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight + 100;
    }
}
