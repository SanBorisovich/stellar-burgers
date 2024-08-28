import { deleteCookie, getCookie, setCookie } from './cookie';

describe('cookieUtils', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  test('setCookie должен устанавливать cookie', () => {
    setCookie('test', 'value', { expires: 60 });
    setTimeout(() => {
      expect(document.cookie).toContain('test=value');
    }, 1000);
  });

  test('getCookie должен возвращать значение cookie', () => {
    document.cookie = 'test=value';
    expect(getCookie('test')).toBe('value');
  });

  test('deleteCookie должен удалять cookie', () => {
    document.cookie = 'test=value';
    deleteCookie('test');
    expect(getCookie('test')).toBeUndefined();
  });
});
