import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const sortByProperty = property => (a,b) => (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

const withErrorChecking = (obs: Observable<any>, obj: Object = {}): Observable<any> => {
  obj = Object.assign(obj, {isError: true});
  return obs.pipe(catchError( e => of(Object.assign(e, obj)) ));
}

export { sortByProperty, withErrorChecking };