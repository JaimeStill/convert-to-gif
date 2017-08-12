import { Injectable } from '@angular/core';
import { Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class CoreApiService {
    extractData(res: Response) {
        return res.json() || {};
    }

    handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || body.Message || JSON.stringify(body);
            errMsg = `${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getRequestOptions(): RequestOptions {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return new RequestOptions({ headers: headers });
    }
}
