import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sortBy } from 'lodash';
import { faGavel, faFire, faLandmark, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { DivisionService } from 'src/app/services/division-service.service';

const SHAKI = {
  safety: 1,
  health: 2,
  arts: 3,
  knowledge: 4,
  infrastructure: 5
}

@Component({
  selector: 'app-division-full',
  templateUrl: './division-full.component.html',
  styleUrls: ['./division-full.component.scss'],
  host: {
    '[class.app-division-full]': 'true',
  }
})
export class DivisionFullComponent {
  constructor(
    private db: AngularFireDatabase,
    private divisionService: DivisionService,
  ) {}

  $principles: Observable<any>;
  $resolutions: Observable<any>;
  $scenarios: Observable<any>;
  $events: Observable<any>;
  $division: Observable<any>;
  $citizens: Observable<any>;
  $advancements: Observable<any>;
  $localLand: Observable<any>;
  $globalLand: Observable<any>;

  showDecisions = 'principles';

  @Input() showKey;
  @Input() user;
  @Input() divisionKey;
  @Output() clickNewEvent = new EventEmitter<any>();

  divisionDecisionsButtons = [
    { id: 'principles', label: 'Principles', faIcon: faLandmark },
    { id: 'resolutions', label: 'Resolutions', faIcon: faGavel },
    { id: 'events', label: 'Events', faIcon: faFire },
    { id: 'scenarios', label: 'Scenarios', faIcon: faGlobe },
  ]

  clickNewEventBtn() {
    this.clickNewEvent.emit(this.divisionKey);
  }

  ngOnInit() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    this.$division = this.db.object(divisionPath).valueChanges();
    this.$principles = this.db.list(`${divisionPath}/principles`).valueChanges();
    this.$resolutions = this.db.list(`${divisionPath}/resolutions`).valueChanges();
    this.$events = this.db.list(`${divisionPath}/events`).valueChanges();
    this.$scenarios = this.db.list(`${divisionPath}/scenarios`).valueChanges();
    this.$citizens = this.db.list(`${divisionPath}/citizens`).valueChanges();
    this.$localLand = this.db.list(`${divisionPath}/localLand`).valueChanges();
    this.$globalLand = this.db.list(`${divisionPath}/globalLand`).valueChanges();
    this.$advancements = this.divisionService.$advancements(this.showKey, this.divisionKey);
  }

  onDivisionDecisionSelect(button) {
    this.showDecisions = button.id;
  }
}
