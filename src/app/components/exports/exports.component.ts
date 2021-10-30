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
  @ViewChild('resourcePicker') resourcePicker: NumberPickerComponent;

  constructor(
    private db: AngularFireDatabase, 
    private divisionService: DivisionService,
    private bankService: BankService) {}

  $citizens: Observable<any>;
  $divisions: Observable<any>;
  $reserve: Observable<any>;

  failedValidations = [];

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
    { type: 'multi', name: 'GLA hostile aquisition' },
    { type: 'single', name: 'Resources' },
    { type: 'single', name: 'Message' }
  ]

  selectedDivision;
  selectedFrom = [];
  selectedExportType;
  messageInput;

  @Input() showKey;
  @Input() divisionKey;

  ngOnInit() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`
    this.$citizens = this.db.list(`${divisionPath}/citizens`)
      .valueChanges()
      .pipe(
        map((citizens) => {
          return citizens.map((citizen: any, index: number) => {
            const resources = citizen.resources
              ? citizen.resources.reduce((acc, R) => acc + R.value, 0)
              : 0
            return {
              resources,
              select_id: citizen.id,
              select_text: `${index}: ${citizen.name} | ${resources}`,
            }
          })
        })
      );

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

    this.$reserve = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`).valueChanges();
  }

  onExportTypeSelect(item) {
    console.log("select type: ", item, this.selectedExportType);
  }

  onFromSelect(item: any) {
    this.failedValidations = [];
    console.log(this.selectedFrom);
  }

  send() {
    if (this.selectedExportType?.name === 'GLA request') {
      this.makeGLARequest();
    } else if (this.selectedExportType?.name === 'GLA hostile aquisition') {
      this.makeGLAForcedAquisition();
    } else if (this.selectedExportType?.name === 'Message') {
      this.sendMessage();
    } else if (this.selectedExportType?.name === 'Resources') {
      this.sendResources();
    }
  }

  async sendResources() {
    console.log("send: ", this.resourcePicker.value);
    this.bankService.removeFromReserve(`shows/${this.showKey}/divisions/${this.divisionKey}`, this.resourcePicker.value).then(() => {
      this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/notifications`).push({
        type: NotificationType.resourceGift,
        header: `The ${this.divisionKey} Division has sent you resouces: ${this.resourcePicker.value}`,
        value: this.messageInput ?? '',
        resolved: false,
        rejectable: true,
        acceptable: true,
        sender: this.divisionKey,
        data: this.resourcePicker.value ?? 0
      }).then(() => {
        this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/unseenNotifications`).push(this.divisionKey)
        this.clearAll();
      })
    })
  }

  sendMessage() {
    this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/notifications`).push({
      type: NotificationType.message,
      header: `Message from ${this.divisionKey} Division:`,
      value: this.messageInput,
      resolved: false,
      sender: this.divisionKey,
    }).then(() => {
      this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/unseenNotifications`).push(this.divisionKey)
      this.clearAll();
    })
  }

  async makeGLAForcedAquisition() {
    const data = this.selectedFrom.map((selection) => ({
      id: selection.select_id,
      name: this.divisionKey,
      division: this.divisionKey,
      cost: this.selectedDivision.landCost
    }))

    await this.divisionService.acquireLand(this.showKey, this.selectedDivision.select_id, data)

    this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/notifications`).push({
      type: NotificationType.glaHostile,
      header: `The ${this.divisionKey} division has taken land plots by force: ${this.selectedFrom.length}`,
      value: this.messageInput ?? '',
      resolved: false,
      sender: this.divisionKey, 
      data
    }).then(() => {
      this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/unseenNotifications`).push(this.divisionKey)
      this.clearAll();
    })
  }

  async makeGLARequest() {
    this.failedValidations  = await this.validateGLARequest(this.selectedDivision.landCost, this.selectedFrom);
    if (this.failedValidations.length === 0) {
      this.selectedFrom.forEach(async (citizen) => {
        await this.bankService.spendResources(
          this.showKey,
          this.divisionKey,
          citizen.select_id,
          this.selectedDivision.landCost
        );
      })

      console.log('selected division: ', this.selectedDivision);
      this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/notifications`).push({
        type: NotificationType.glaRequest,
        header: `The ${this.divisionKey} division would like to purchase land plots: ${this.selectedFrom.length}`,
        value: this.messageInput ?? '',
        resolved: false,
        rejectable: true,
        acceptable: true,
        sender: this.divisionKey,
        data: this.selectedFrom.map((selection) => ({
          id: selection.select_id,
          name: this.divisionKey,
          division: this.divisionKey,
          cost: this.selectedDivision.landCost
        }))
      }).then(() => {
        this.db.list(`shows/${this.showKey}/divisions/${this.selectedDivision.select_id}/unseenNotifications`).push(this.divisionKey)
        this.clearAll();
      })
    }
  }

  clearAll() {
    this.selectedExportType = undefined;
    this.selectedDivision = undefined;
    this.selectedFrom = undefined;
    this.failedValidations = [];
    this.messageInput = undefined;
  }

  async onDivisionSelect() {
    console.log('div select', this.selectedExportType)
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
}