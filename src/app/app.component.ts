import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'electionapp';
  result = [];
  partyResult = [];
  constructor(public http: HttpClient) {
    this.getResults();
    this.getParty();
  }

  getParty = () => {
    this.partyResult = [];
    this.http.get<any>('https://election.thanthitv.com/api/getPartyStats.json').subscribe((res) => {
      // @ts-ignore
      res.party_stats.forEach( (o:any) => {
        var partyName = o.coalition_name;
        var partyAbr = o.coalition_abbreviation;
        var leadingTotal = o.leading_total;
        var winningTotal = o.winning_total;
        var participation = o.contesting_total;
        // @ts-ignore
        var resobj = {partyName: partyName, partyAbr: partyAbr, leadingTotal: leadingTotal, winningTotal:winningTotal, participation:participation};
        // @ts-ignore
        this.partyResult.push(resobj);
      });
      console.log(this.partyResult);
    });
  }

  getResults = () => {
    this.result = [];
    for (var i = 1; i < 40; i++){
      this.http.get<any>('https://election.thanthitv.com/api/districtStats/'+i+'.json').subscribe((res) => {
        // @ts-ignore
        this.parseDetails(res);
      });
    }
  }
  parseDetails = (response: { [x: string]: any; }) => {
    const districtDetails = response.district_stats;
    const districtName = districtDetails.name;
    const constituency_stats = districtDetails.constituency_stats;
    var resultArray: { districtName: any; name: any; }[] = [];
    var tRes = null;
    constituency_stats.forEach( (obj:any) => {
      var leader = '';
      var voteCount = '';
      // @ts-ignore
      obj.coalition_stats.forEach((o) => {
        if(o.is_leading){
          console.log("leading val");
          leader = o.coalition_code;
          voteCount = o.no_of_votes;
        }
      });
      tRes = {districtName: districtName,
        name: obj.name,
        resultAnnounced: obj.is_result_announced == 0 ? 'காத்திருக்கிறது' : 'அறிவிக்கப்பட்டது',
        currentRound: obj.current_round,
        leader: leader,
        voteCount: voteCount
      };
      // @ts-ignore
      this.result.push(tRes);
    });
  }
}
