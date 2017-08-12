import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CoreApiService } from './core-api.service';
import { ToasterService } from './toaster.service';
import { Upload } from '../models/upload.model';
import { ConsoleOutput } from '../models/console-output.model';
import { GifOptions } from '../models/gif-options.model';
import { UploadDetails } from '../models/upload-details.model';

@Injectable()
export class AppService {
    private consoleValues = new Array<ConsoleOutput>();
    video = new BehaviorSubject<File>(new File([], ''));
    gifOptions = new BehaviorSubject<GifOptions>(new GifOptions());
    output = new BehaviorSubject<Array<ConsoleOutput>>([]);
    uploads = new BehaviorSubject<Array<UploadDetails>>([]);
    gifs = new BehaviorSubject<Array<UploadDetails>>([]);
    flags = new BehaviorSubject<Array<string>>([]);
    logs = new BehaviorSubject<Array<string>>([]);
    hasUploads = new BehaviorSubject<boolean>(true);
    hasGifs = new BehaviorSubject<boolean>(true);
    uploading = new BehaviorSubject<boolean>(false);
    converting = new BehaviorSubject<boolean>(false);
    editing = new BehaviorSubject<boolean>(false);

    constructor(private http: Http, private coreApi: CoreApiService, private toaster: ToasterService) { }

    updateConsole(output: ConsoleOutput) {
        this.consoleValues.push(output);
        this.output.next(this.consoleValues);
    }

    addConsoleMessage(result: string, hasError: boolean, error?: string) {
        const consoleMessage = new ConsoleOutput();
        consoleMessage.result = result;
        consoleMessage.hasError = hasError;
        consoleMessage.error = error;

        this.updateConsole(consoleMessage);
    }

    getUploads() {
        return this.http.get('/api/upload/getUploads')
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: Array<UploadDetails>) => {
                this.hasUploads.next(res.length > 0);
                this.uploads.next(res);
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }

    getGifs() {
        return this.http.get('/api/upload/getGifs')
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: Array<UploadDetails>) => {
                this.hasGifs.next(res.length > 0);
                this.gifs.next(res);
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }

    getFlagOptions() {
        return this.http.get('/api/upload/getFlagOptions')
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: Array<string>) => {
                this.flags.next(res);
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }

    getLogOptions() {
        return this.http.get('/api/upload/getLogOptions')
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: Array<string>) => {
                this.logs.next(res);
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }

    uploadVideo(formData: FormData) {
        this.addConsoleMessage('Uploading video to the server', false);
        this.uploading.next(true);

        const options = this.coreApi.getRequestOptions();
        options.headers.delete('Content-Type');
        options.headers.append('Accept', 'application/json');

        return this.http.post('/api/upload/uploadVideo', formData, options)
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: ConsoleOutput) => {
                this.updateConsole(res);
                this.uploading.next(false);

                if (res.hasError) {
                    this.toaster.sendErrorMessage(res.error);
                } else {
                    this.video.next(new File([], ''));
                    this.hasUploads.next(true);
                    this.getUploads();
                }
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
                this.uploading.next(false);
            });
    }

    deleteUpload(upload: UploadDetails) {
        this.addConsoleMessage('Deleting video', false);

        const body = JSON.stringify(upload);

        return this.http.post('/api/upload/deleteVideo', body, this.coreApi.getRequestOptions())
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: ConsoleOutput) => {
                this.updateConsole(res);

                if (res.hasError) {
                    this.toaster.sendErrorMessage(res.error);
                } else {
                    this.getUploads();
                }
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }

    convertUpload(upload: UploadDetails) {
        const options = new GifOptions();
        options.origin = upload.fullPath;
        options.originName = upload.name;
        const pathArray = upload.fullPath.split('.');
        const end = pathArray[pathArray.length - 1];
        options.destination = upload.fullPath.replace(end, 'gif');
        options.destinationName = upload.name.replace(end, 'gif');
        options.fps = 25;
        options.scale = 900;
        options.flags = 'bicubic';
        options.log = 'panic';

        this.gifOptions.next(options);
        this.editing.next(true);
    }

    cancelConvert() {
        this.gifOptions.next(new GifOptions());
        this.editing.next(false);
    }

    convertToGif() {
        this.addConsoleMessage('Converting video to GIF', false);
        this.converting.next(true);

        const body = JSON.stringify(this.gifOptions.value);

        return this.http.post('/api/upload/convertToGif', body, this.coreApi.getRequestOptions())
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: ConsoleOutput) => {
                this.updateConsole(res);
                this.converting.next(false);

                if (res.hasError) {
                    this.toaster.sendErrorMessage(res.error);
                } else {
                    this.gifOptions.next(new GifOptions());
                    this.hasGifs.next(true);
                    this.editing.next(false);
                    this.getGifs();
                }
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
                this.converting.next(false);
            });
    }

    deleteGif(gif: UploadDetails) {
        this.addConsoleMessage('Deleting GIF', false);

        const body = JSON.stringify(gif);

        return this.http.post('/api/upload/deleteGif', body, this.coreApi.getRequestOptions())
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: ConsoleOutput) => {
                this.updateConsole(res);

                if (res.hasError) {
                    this.toaster.sendErrorMessage(res.error);
                } else {
                    this.getGifs();
                }
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }

    clearAllUploads() {
        this.addConsoleMessage('Clearing all files', false);

        return this.http.get('/api/upload/clearAllUploads')
            .map(this.coreApi.extractData)
            .catch(this.coreApi.handleError)
            .subscribe((res: ConsoleOutput) => {
                this.updateConsole(res);

                if (res.hasError) {
                    this.toaster.sendErrorMessage(res.error);
                }

                this.getUploads();
                this.getGifs();
            },
            error => {
                this.addConsoleMessage(undefined, true, error);
                this.toaster.sendErrorMessage(error);
            });
    }
}
