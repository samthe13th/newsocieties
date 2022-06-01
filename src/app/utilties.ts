import { includes } from 'lodash';
import { take } from 'rxjs/operators';
import { pipe } from 'rxjs';

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns random integer between min and max, INCLUSIVE of min and max values, 
 * eg getRandomInt(1,3) will randomly return the number 1, 2, or 3
 */

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pluckRandom(array, total) {
  console.log('pluck: ', array, total)
  const plucked = [];
  if (total > array.length) {
    console.error('pluck random: "total" cannot be greater than length of array to pluck from');
    return array
  }
  while(plucked.length < total) {
    const value = array[getRandomInt(0, array.length - 1)];
    if (!includes(plucked, value)) {
      plucked.push(value)
    }
  }
  return plucked;
}

export function promiseOne(dbCall) {
  return dbCall.valueChanges().pipe(take(1)).toPromise();
}

export function formatDate(date, format) {
  const month = date.getMonth() + 1;
  const day = date.getDate()
  const map = {
      mm: month >= 10 ? month : `0${month}`,
      dd: day >= 10 ? day : `0${day}`,
      yy: date.getFullYear().toString().slice(-2),
      yyyy: date.getFullYear()
  }

  return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
}