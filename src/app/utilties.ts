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