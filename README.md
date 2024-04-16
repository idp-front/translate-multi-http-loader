Provides opportunity for loading several files at the same time

## Install

```javascript
npm i @idp-front/translate-multi-http-loader
```

## Example

```javascript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MultiTranslateHttpLoader } from '@idp-front/translate-multi-http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ru_RU',
      loader: {
        provide: TranslateLoader,
        useFactory: () =>
          new MultiTranslateHttpLoader([
            { prefix: `/assets/i18n/`, suffix: '.json' },
            {
              prefix: `/assets/shared/i18n/`,
              suffix: '.json',
            },
          ]),
      },
    }),
  ],
})
export class AppModule {}
```
