
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute
    ) {
  }
}