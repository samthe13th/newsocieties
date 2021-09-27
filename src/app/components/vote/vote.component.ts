import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';


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
  @Input() showVotes: boolean;
  @Input() showId: string;
  @Input() divisionId: string;
  @Input() includeOtherOption = false;

  $vote: Observable<any>;
  vote;
  votePrompt: string;
  other: string = "";

  private _selectedOption
  get selectedOption() { return this._selectedOption };
  set selectedOption(value) {
    console.log('set... ', value)
    this._selectedOption = value;
    this.selectionChange.emit({ ...this.vote, value });
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
      this.vote = vote;
      this.votePrompt = vote?.prompt
    });
    console.log('vote prompt: ', this.votePrompt)
  }
}