import { TranslateLoader } from '@ngx-translate/core';
import {
  Observable,
  catchError,
  forkJoin,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { merge } from 'lodash-es';

export class MultiTranslateHttpLoader implements TranslateLoader {
  private readonly suffix = '.json';

  constructor(private pathToFolders: string[] = []) {}

  public getTranslation(lang: string): Observable<unknown> {
    return this.pathToFolders.length
      ? forkJoin(
          this.pathToFolders.map((pathToFolder: string) =>
            from(fetch(`${pathToFolder}${lang}${this.suffix}`)).pipe(
              switchMap((response: Response) => from(response.json())),
              catchError(() => of({}))
            )
          )
        ).pipe(
          map((response: Record<string, unknown>[]) => {
            return response.reduce(
              (acc: Record<string, unknown>, item: Record<string, unknown>) =>
                merge(acc, item),
              {}
            );
          })
        )
      : of({});
  }
}
