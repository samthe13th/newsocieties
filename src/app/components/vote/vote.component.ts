import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { find } from 'lodash';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
  host: {
    '[class.app-vote]': 'true',
    '[class.central]': 'role === "central"',
    '[class.citizen]': 'role === "citizen"'
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
  @Input() role: 'central' | 'citizen';
  @Input() 
  get allowSelection() { return this._allowSelection };
  set allowSelection(value) { this._allowSelection = value };

  $vote: Observable<any>;
  other: string = "";
  vote;

  private _selectedOption
  private _allowSelection = true;

  get selectedOption() {
    return this._selectedOption
  };
  set selectedOption(value) {
    this._selectedOption = value;
    const selected = find(this.vote.options, ["prompt", value]);
    this.selectionChange.emit({ vote: this.vote, selection: selected });
  }

  constructor(private db: AngularFireDatabase) {}

  onKeyUp() {
    this.selectionChange.emit({ ...this.vote })
  }

  selectVoteOption(index) {
    this.selectedOption = this.vote?.options[index].prompt ?? undefined;
  }

  ngOnInit() {
    this.$vote = this.db.object(`shows/${this.showId}/divisions/${this.divisionId}/vote`)
      .valueChanges();
    this.$vote.subscribe((vote) => {
      this.vote = { ...vote };
      this.voteChange.emit({ ...vote });
    });
  }
}