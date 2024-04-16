import { MultiTranslateHttpLoader } from './multi-http.loader';

describe('MultiTranslateHttpLoader', () => {
  beforeEach(async () => {
    global.fetch = ((url: string) =>
      Promise.resolve({
        json: () =>
          Promise.resolve(
            url === '/en.json'
              ? { locale1: '1', locale2: '2' }
              : { locale3: '3', locale4: '4' }
          ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as unknown as any;
  });

  it('empty resources', (done) => {
    new MultiTranslateHttpLoader()
      .getTranslation('en')
      .subscribe((translations) => {
        expect(translations).toEqual({});
        done();
      });
  });

  it('merge translations', (done) => {
    new MultiTranslateHttpLoader([
      { prefix: '/', suffix: '.json' },
      { prefix: '/module/', suffix: '.json' },
    ])
      .getTranslation('en')
      .subscribe((translations) => {
        expect(translations).toEqual({
          locale1: '1',
          locale2: '2',
          locale3: '3',
          locale4: '4',
        });
        done();
      });
  });

  it('merge with rewrite translations', (done) => {
    global.fetch = ((url: string) =>
      Promise.resolve({
        json: () =>
          Promise.resolve(
            url === '/en.json'
              ? { locale1: '1', locale2: '2' }
              : { locale1: '3', locale2: '4' }
          ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as unknown as any;

    new MultiTranslateHttpLoader([
      { prefix: '/', suffix: '.json' },
      { prefix: '/module/', suffix: '.json' },
    ])
      .getTranslation('en')
      .subscribe((translations) => {
        expect(translations).toEqual({
          locale1: '3',
          locale2: '4',
        });
        done();
      });
  });
});
