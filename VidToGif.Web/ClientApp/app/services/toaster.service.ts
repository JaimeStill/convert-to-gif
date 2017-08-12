import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Injectable()
export class ToasterService {
    config: MdSnackBarConfig = new MdSnackBarConfig();
    message = 'Hello from Toaster Service';

    constructor(private snackbar: MdSnackBar) {
        this.config.duration = 5000;
        this.config.extraClasses = new Array<string>();
    }

    sendMessage() {
        this.snackbar.open(this.message, 'Close', this.config);
    }

    setMessage(message: string) {
        this.message = message;
    }

    setDuration(duration: number) {
        this.config.duration = duration;
    }

    setClasses(classes: string[]) {
        this.config.extraClasses = classes;
    }

    sendColorMessage(message: string, colors: string[]) {
        this.message = message;
        this.config.extraClasses = colors;
        this.sendMessage();
    }

    sendErrorMessage(message: string) {
        this.message = message;
        this.setClasses(['toaster-red']);
        this.sendMessage();
    }

    sendWarningMessage(message: string) {
        this.message = message;
        this.setClasses(['toaster-orange']);
        this.sendMessage();
    }

    sendSuccessMessage(message: string) {
        this.message = message;
        this.setClasses(['toaster-green']);
        this.sendMessage();
    }
}
