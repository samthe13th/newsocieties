import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { find } from 'lodash';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
  host: {
    '[class.app-vote]': 'true'
  }
})
export class VoteComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any>()
  @Output() voteChange = new EventEmitter<any>()
  @Input() showVotes: boolean;
  @Input() showId: string;
  @Input() divisionId: string;
  @Input() includeOtherOption = false;
  @Input() hideLast: boolean;
  @Input() 
  get allowSelection() { return this._allowSelection };
  set allowSelection(value) { console.log({value}); this._allowSelection = value };

  $vote: Observable<any>;
  vote;
  other: string = "";

  private _selectedOption
  private _allowSelection = true;

  get selectedOption() { return this._selectedOption };
  set selectedOption(value) {
    this._selectedOption = value;
    const selected = find(this.vote.options, ["prompt", value]);
    this.selectionChange.emit({ vote: this.vote, selection: selected });
  }

  constructor(private db: AngularFireDatabase) {
  }

  onKeyUp() {
    console.log('keyup');
    this.selectionChange.emit({ ...this.vote })
  }

  ngOnInit() {
    this.$vote = this.db.object(`shows/${this.showId}/divisions/${this.divisionId}/vote`).valueChanges();
    this.$vote.subscribe((vote) => {
      console.log({vote})
      this.vote = { ...vote };
      this.voteChange.emit({ ...vote });
      // if (this.hideOption === 'last') {
      //   this.vote.options.pop();
      // }
    });
  }
}