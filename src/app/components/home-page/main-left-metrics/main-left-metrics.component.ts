import {Component, Input, OnInit} from '@angular/core';
import {StatisticsService} from "../../../services/statistics.service";
import {VennData} from "../../../model/vennData";
import{ChangeProject} from "./chart1/chart1.component"

@Component({
  selector: 'app-main-left-metrics',
  templateUrl: './main-left-metrics.component.html',
  styleUrls: ['./main-left-metrics.component.scss']
})
export class MainLeftMetricsComponent implements OnInit {

    vennDataList:VennData[] = new Array();
    changeProject: ChangeProject = new ChangeProject('');
   constructor(private statisticsService: StatisticsService) {
        // let venn = {
        //     "projectId": "PXD000021",
        //     "prePSM_no": 42972,
        //     "prePSM_not_matched_no": 24084,
        //     "prePSM_high_conf_no": 12840,
        //     "prePSM_low_conf_no": 1313,
        //     "better_PSM_no": 1048,
        //     "new_PSM_no": 4694,
        //     "matched_spec_no": 32758,
        //     "matched_id_spec_no": 18888
        // }
        // this.multi = [
        //     {
        //         "name": venn.projectId,
        //         "series": [
        //             {
        //                 "name": "NotMatched Id",
        //                 "value": venn.prePSM_no - venn.matched_id_spec_no
        //             },
        //             {
        //                 "name": "Better Id",
        //                 "value": venn.better_PSM_no
        //             },
        //             {
        //                 "name": "Other LowConf Id",
        //                 "value": venn.prePSM_low_conf_no - venn.better_PSM_no
        //             },
        //             {
        //                 "name": "Other Matched Id",
        //                 "value": venn.matched_id_spec_no - venn.prePSM_low_conf_no
        //             },
        //             {
        //                 "name": "New Id for Matched UnId",
        //                 "value": venn.new_PSM_no
        //             },
        //             {
        //                 "name": "Other Matched UnId",
        //                 "value": venn.matched_spec_no - venn.matched_id_spec_no - venn.new_PSM_no
        //             }
        //         ]
        //     },
        // ];
    }

    ngOnInit(): void {
        this.setStatckedVennData();
        this.changeHandler(this.changeProject);
    }

    setStatckedVennData() {
        this.statisticsService.getVennDataList()
            .then(vennDataList => {
                this.vennDataList = vennDataList;
            }).catch(this.handleError);
    }

    private handleError(error: any): void {
        console.log('A error occurred', error);
    }
    changeHandler(event: ChangeProject){
        this.changeProject = event;
    }
   
}

