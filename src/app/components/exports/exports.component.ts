import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, combineLatest } from 'rxjs';
import { map, tap, take, find } from 'rxjs/operators';
import * as _ from 'lodash';
import { BankService } from 'src/app/services/bank.service';
import { NumberPickerComponent } from 'ng-number-picker';
import { NotificationType } from 'src/app/shared/types';
import { DivisionService } from 'src/app/services/division-service.service';


const DROPDOWN_SETTINGS = {
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 3,
  allowSearchFilter: false
};

@Component({
  selector: 'app-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss'],
  host: {
    '[class.app-exports]': 'true'
  }
})
export class ExportsComponent implements OnInit {
  constructor(
    private db: AngularFireDatabase, 
    private divisionService: DivisionService,
    private bankService: BankService) {}

  $citizens: Observable<any>;
  $positions: Observable<any>;
  $divisions: Observable<any>;
  $reserve: Observable<any>;

  fromReserve;
  citizenData;
  selectedDivision;
  selectedExportType;
  messageInput;

  multiSelectSettings = {
    ...DROPDOWN_SETTINGS,
    singleSelection: false,
    textField: 'select_text',
    idField: 'select_id'
  }

  singleSelectSettings = {
    ...DROPDOWN_SETTINGS,
    singleSelection: true,
    textField: 'select_text',
    idField: 'select_id'
  }

  exportTypeOptions = [
    { type: 'none', name: ''},
    { type: 'multi', name: 'GLA request' },
    { type: 'multi', name: 'GLA hostile acquisition' },
    { type: 'multi', name: 'Resources' },
    { type: 'single', name: 'Message' }
  ]

  @Input() showKey;
  @Input() divisionKey;

  setCitizenData() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`
    combineLatest(
      this.db.list(`${divisionPath}/positions`).valueChanges(),
      this.db.object(`${divisionPath}/citizens`).valueChanges()
    ).pipe(
      take(1),
      map(([positions, citizens]: [any, any]) => {
        return positions.map((id, index) => ({
          position: index + 1,
          ...citizens[id]
        }))
      }),
      tap((citizens) => {
        this.citizenData = citizens.map((citizen) => ({
          position: citizen.position,
          id: citizen.id,
          name: citizen.name,
          wealth: this.bankService.calculateWealth(citizen.resources),
          spend: 0,
          sendRequest: false,
        }))
        console.log("data: ", this.citizenData)
      })
    ).subscribe();
  }

  ngOnInit() {
    this.setCitizenData();

    this.$divisions = this.db.list(`shows/${this.showKey}/divisions`)
      .valueChanges()
      .pipe(
        map((divisions: any) => {
          return _.filter(divisions.map((division) => ({
            landCost: division.landCost,
            select_id: division.code,
            select_text: `${division.code} (Land cost: ${division.landCost} Reserve: ${division.reserve})`
          })), (division) => { return division.select_id !== this.divisionKey })
        })
      )

    this.$reserve = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`)
      .valueChanges()
      .pipe(tap((x) => console.log('reserve: ', x)))
  }

  addResources(citizens) {
    let total = 0;
    citizens.forEach((citizen) => {
      total += citizen.spend;
    })
    return total;
  }
  
  send() {
    console.log('send: ', this.selectedExportType)
    if (this.selectedExportType?.name === 'GLA request') {
      this.makeGLARequest(false);
    } else if (this.selectedExportType?.name === 'GLA hostile acquisition') {
      this.makeGLARequest(true);
    } else if (this.selectedExportType?.name === 'Message') {
      this.sendMessage();
    } else if (this.selectedExportType?.name === 'Resources') {
      this.sendResources();
    }
  }

  async sendResources() {
    console.log("CITIZEN DATA: ", this.citizenData)
    const senders = this.citizenData.map((citizen) => ({ id: citizen.id, spend: citizen.spend }))
    let resourceTotal = this.addResources(this.citizenData);
    senders.forEach(async (citizen) => {
      await this.bankService.spendResources(
        this.showKey,
        this.divisionKey,
        citizen.id,
        citizen.spend
      );
    })
    if (this.fromReserve) {
      resourceTotal += this.fromReserve;
      console.log("take from reserve: ", this.fromReserve)
      await this.bankService.removeFromReserve(
        `shows/${this.showKey}/divisions/${this.divisionKey}`,
        this.fromReserve
      );
    }
    const data = {
      type: NotificationType.resourceGift,
      header: `The ${this.divisionKey} Division has sent you ${resourceTotal} resource(s)`,
      value: this.messageInput ?? '',
      resolved: false,
      rejectable: true,
      acceptable: true,
      sender: this.divisionKey,
      reciever: this.selectedDivision.select_id,
      data: { total: resourceTotal, fromReserve: this.fromReserve, senders }
    }
    await this.logExport(data);
    this.clearAll();
  }

  async sendMessage() {
    const data = {
      type: NotificationType.message,
      header: `Message from ${this.divisionKey} Division:`,
      value: this.messageInput,
      resolved: false,
      sender: this.divisionKey,
      reciever: this.selectedDivision?.select_id
    }
    await this.logExport(data);
    this.clearAll();
  }

  async logExport(data) {
    return new Promise(async (resolve) => {
      await this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/notifications`).push(data);
      await this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/unseenNotifications`).push(this.divisionKey);
      await this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/exports`).push(data)
      resolve()
    })
  }

  async makeGLARequest(force = false) {
    const requests = _.filter(this.citizenData, (citizen) => citizen.sendRequest );
    const resources = this.addResources(this.citizenData);
    const landRequests = requests.map((citizen) => ({
      id: citizen.id,
      name: this.divisionKey,
      division: this.divisionKey,
      cost: citizen.spend
    }))
    const notification: any = {
      value: this.messageInput ?? '',
      resolved: false,
      sender: this.divisionKey,
      reciever: this.divisionKey,
      data: landRequests,
      ...(force === true)
        ? this.glaHostileNotify(this.divisionKey, resources, requests.length)
        : this.glaFriendlyNotify(this.divisionKey, resources, requests.length)
    }

    if (force === true) {
      console.log('acquire land')
      await this.divisionService.acquireLand(this.showKey, this.selectedDivision.select_id, landRequests);
    } else {
      requests.forEach(async (citizen) => {
        await this.bankService.spendResources(
          this.showKey,
          this.divisionKey,
          citizen.id,
          citizen.spend
        );
      })
    }
    await this.logExport(notification);

    this.clearAll();
  }

  async validateGLARequest(cost, citizens): Promise<string[]> {
    console.log("validate: ", cost, citizens)
    const result = await this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens`)
      .valueChanges()
      .pipe(
        take(1),
        map((_citizens) => {
          const failed = [];
          citizens.forEach((c) => {
            const citizen = _.find(_citizens, ['id', c.select_id])
            const resources = _.toNumber(c.select_text.split('|')[1].trim());
            if (resources < cost) {
              failed.push(citizen.name)
            }
          })
          return failed;
        })
      ).toPromise();

    return result
  }

  glaHostileNotify = (divisionKey, resources, requestCount) => ({
    type: NotificationType.glaHostile,
    header: `The ${divisionKey} division has sent ${resources} resources, and has taken ${requestCount} land plot(s)`,
  })

  glaFriendlyNotify = (divisionKey, resources, requestCount) => ({
    type: NotificationType.glaRequest,
    header: `The ${divisionKey} division has sent ${resources} resources to purchase ${requestCount} land plot(s)`,
    rejectable: true,
    acceptable: true,
  })

  clearAll() {
    this.selectedExportType = undefined;
    this.selectedDivision = undefined;
    this.messageInput = undefined;
    this.fromReserve = undefined;
    this.setCitizenData();
  }
}