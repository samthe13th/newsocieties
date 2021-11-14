import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { faGavel, faLandmark, faGlobe, faLeaf, faCartPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-division-full',
  templateUrl: './division-full.component.html',
  styleUrls: ['./division-full.component.scss'],
  host: {
    '[class.app-division-full]': 'true',
  }
})
export class DivisionFullComponent {
  constructor(private db: AngularFireDatabase) {}

  $principles: Observable<any>;
  $resolutions: Observable<any>;
  $scenarios: Observable<any>;
  $events: Observable<any>;
  $division: Observable<any>;

  showDecisions = 'principles';

  @Input() showKey;
  @Input() division;
  @Output() clickNewEvent = new EventEmitter<any>();

  divisionDecisionsButtons = [
    { id: 'principles', label: 'Principles', faIcon: faLandmark },
    { id: 'resolutions', label: 'Resolutions', faIcon: faGavel },
    { id: 'events', label: 'Events', faIcon: faGlobe },
  ]

  clickNewEventBtn() {
    console.log('click: ')
    this.clickNewEvent.emit(this.division);
  }

  ngOnInit() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.division}`;
    this.$division = this.db.object(divisionPath).valueChanges();
    this.$principles = this.db.list(`${divisionPath}/principles`).valueChanges();
    this.$resolutions = this.db.list(`${divisionPath}/resolutions`).valueChanges();
    this.$events = this.db.list(`${divisionPath}/events`).valueChanges();
    this.$scenarios = this.db.list(`${divisionPath}/scenarios`).valueChanges();
  }

  onDivisionDecisionSelect(button) {
    this.showDecisions = button.id;
  }
}