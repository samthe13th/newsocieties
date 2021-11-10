
import { Injectable } from '@angular/core';
import { BankService } from './bank.service';
import { DivisionService } from './division-service.service';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { NotificationType } from '../shared/types';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private bankService: BankService,
    private divisionService: DivisionService,
  ) {}

  // async sendResources(showKey, fromDivision, toDivision, resources, message) {
  //   console.log("send: ", resources);
  //   this.bankService.removeFromReserve(`shows/${showKey}/divisions/${fromDivision}`, resources).then(() => {
  //     this.db.list(`shows/${showKey}/divisions/${toDivision}/notifications`).push({
  //       type: NotificationType.resourceGift,
  //       header: `The ${fromDivision} Division has sent you resouces: ${resources}`,
  //       value: message,
  //       resolved: false,
  //       rejectable: true,
  //       acceptable: true,
  //       sender: fromDivision,
  //       data: resources
  //     }).then(() => {
  //       this.db.list(`shows/${showKey}/divisions/${toDivision}/unseenNotifications`).push(fromDivision)
  //       this.clearAll();
  //     })
  //   })
  // }

  rejectGLA(showKey, data) {
    return new Promise((resolve) => {
      data.forEach(async (request) => {
        const resources = this.bankService.quickConvert(request.division, request.cost);
        await this.bankService.depositResources(showKey, request.division, request.id, resources);
      })
      resolve(true);
    })
  }

  rejectResources(showKey, sender, data) {
    console.log('reject: ', showKey, sender, data)
    return new Promise((resolve) => {
      data.senders.forEach(async (data) => {
        const resources = this.bankService.quickConvert(sender, data.spend);
        await this.bankService.depositResources(showKey, sender, data.id, resources);
      })
      resolve(true);
    })
  }

  acceptGLA(showKey, divisionKey, data) {
    return new Promise((resolve) => {
      this.divisionService.acquireLand(
        showKey,
        divisionKey,
        data
      ).then(() => {
        resolve(true)
      })
    })
  }

  acceptResources(showKey, divisionKey, data) {
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`
    return new Promise((resolve) => {
      this.bankService.addToReserve(divisionPath, data.total).then(() => {
        resolve(true)
      })
    })
  }
}