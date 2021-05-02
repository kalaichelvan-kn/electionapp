import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'electionapp';
  countries = COUNTRIES;
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
      this.http.get<any>('https://thanthiresults.online/v1/districtStats/'+i).subscribe((res) => {
        // @ts-ignore
        this.parseDetails(res);
      });
    }
  }
  parseDetails = (response: { [x: string]: any; }) => {
    const districtDetails = response.district_stats;
    const districtName = districtDetails.name;
    const constituency_stats = districtDetails.constituency_stats;
    // console.log(districtName);
    // console.log(constituency_stats);
    var resultArray: { districtName: any; name: any; }[] = [];
    var tRes = null;
    constituency_stats.forEach( (obj:any) => {
      var dmk = "";
      var admk = "";
      var dcolor = '';
      var acolor = '';
      var leader = '';
      var voteCount = '';
      // @ts-ignore
      obj.coalition_stats.forEach((o) => {
        if(o.is_leading){
          console.log("leading val");
          leader = o.coalition_code;
          voteCount = o.no_of_votes;
        }
        // if(o.coalition_code=="DMK+") {
        //   dmk = o.no_of_votes;
        //   if(o.is_leading){
        //     dcolor = "bg-success text-white";
        //     acolor = "bg-danger text-white"
        //   }
        // }
        // if(o.coalition_code=="ADMK+") {
        //   admk = o.no_of_votes;
        //   if(o.is_leading){
        //     acolor = "bg-success text-white";
        //     dcolor = "bg-danger text-white"
        //   }
        // }
      });
      tRes = {districtName: districtName,
        name: obj.name,
        resultAnnounced: obj.is_result_announced == 0 ? 'காத்திருக்கிறது' : obj.is_result_announced,
        currentRound: obj.current_round,
        leader: leader,
        voteCount: voteCount
      };
      // @ts-ignore
      this.result.push(tRes);
    });
  }
}
