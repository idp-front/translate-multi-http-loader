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
  constructor(private resources: { prefix: string; suffix: string }[] = []) {}

  public getTranslation(lang: string): Observable<unknown> {
    return this.resources.length
      ? forkJoin(
          this.resources.map((config) =>
            from(fetch(`${config.prefix}${lang}${config.suffix}`)).pipe(
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
