import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['file-upload.component.css']
})
export class FileUploadComponent {
    @ViewChild('fileInput') fileInput: ElementRef;
    @Output() onUploaded = new EventEmitter<FormData>();
    @Output() onSelected = new EventEmitter<File>();
    formData: FormData;
    fileCount = 0;

    constructor(private toaster: ToasterService, private app: AppService) { }

    fileChange(event) {
        const file: File = event.target.files[0];

        if (file.size > 52428800) {
            this.toaster.sendErrorMessage(`${file.name} is larger than the 50MB limit`);
        } else {

            this.fileCount = 1;

            this.formData = new FormData();
            this.formData.append(file.name, file);

            this.onSelected.emit(file);
        }
    }

    uploadVideo() {
        this.fileCount = 0;
        this.onUploaded.emit(this.formData);
        this.fileInput.nativeElement.value = null;
    }
}
