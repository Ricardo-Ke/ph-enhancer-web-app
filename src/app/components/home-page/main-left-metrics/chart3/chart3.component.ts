import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {StatisticsService} from "../../../../services/statistics.service";
import {Config} from "../../../../model/config";
import {VennData} from "../../../../model/vennData";
import {Router} from '@angular/router'
import { colorSets, id } from '../../../../../../node_modules/_@swimlane_ngx-charts@6.1.0@@swimlane/ngx-charts/release/utils';


@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
})
export class Chart3Component implements OnChanges,OnInit{

    @Input() vennDataList: VennData[];
   vennDataList1:any[]=this.vennDataList;
    multi: any[] = [];
    maxValue: any[] = [];
    yMulti:any[] = [];
    view: any[] = [400, 500];
    nodes:any;
    tip="("+" The project of overing the clicked project is hided,clicking the below project to show the whole project "+")";


    // options
    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Projects';
    showYAxisLabel = true;
    yAxisLabel = 'PSMs';
    fitContainer: boolean = true;
    showSeriesOnHover = true;
    roundEdges: boolean = true;
    animations: boolean = true;
    roundDomains = false;
    yScaleMax=0;
    colorScheme = {
        domain: ['gray', '#A10A28', 'blue', '#10c008', 'purple', "pink"]
    };
    constructor(private router: Router) {
    }
    ngOnInit():void{
        this.setDataForChart();
        this.yMulti=[...this.yMulti];

    }
    ngOnChanges(): void {
        this.setDataForChart();
        this.multi = [...this.multi];
        this.maxValue=[...this.maxValue];
    }
    setDataForChart() {
       
        this.vennDataList.forEach(
            vennData => {
                let anObject = new Object;
                let value=0;
                let valueCount=[];
                anObject["name"] = vennData.projectId;
                anObject["series"] = [];
                anObject["series"].push(
                    {
                        "name": "NotMatched Id",
                        "value": vennData.prePSM_no - vennData.matched_id_spec_no
                    });
                anObject["series"].push(
                    {
                        "name": "Better Id",
                        "value": vennData.better_PSM_no
                    });
                anObject["series"].push(
                    {
                        "name": "Other LowConf Id",
                        "value": vennData.prePSM_low_conf_no - vennData.better_PSM_no
                    });
                anObject["series"].push(
                    {
                        "name": "Other Matched Id",
                        "value": vennData.matched_id_spec_no - vennData.prePSM_low_conf_no
                    });
                anObject["series"].push(
                    {
                        "name": "New Id for Matched UnId",
                        "value": vennData.new_PSM_no
                    });
                anObject["series"].push(
                    {
                        "name": "Other Matched UnId",
                        "value": vennData.matched_spec_no - vennData.matched_id_spec_no - vennData.new_PSM_no
                    });
                //获取每个项目的总值  
                
                anObject["series"].forEach(it=>{
                    value=value+it.value;
                });
                
                //存放项目的ID和总值
                valueCount.push({
                    "name": vennData.projectId,
                    "value":value,
                })
                 //存放全部项目的ID和总值 
                this.maxValue.push(valueCount);
                this.multi.push(anObject);
                this.yMulti.push(anObject);        
            }
        );
       
    }
    
    onSelect(event){
        let projectId = event.series;
        let vennDataType = event.name;
        let vennDataValue = event.value;
        let psmTableType = null;
        switch (vennDataType){
            case "New Id for Matched UnId" :{
                psmTableType = "new_id";
                break;
            }

            case "Better Id":
            case "Other LowConf Id":{
                psmTableType = "low_conf";
                break;
            }

            case "Other Matched Id":{
                psmTableType = "high_conf";
                break;
            }

            default:{
                alert(psmTableType);
                break;
            }
        }
       
        this.router.navigateByUrl('' + psmTableType + "/" + projectId).then(_ =>{console.log("route changed")});

    }

    onClick(event){
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
             document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
        }
        this.multi=[];
        this.multi=JSON.parse(JSON.stringify(this.yMulti));
        let elements=document.getElementsByClassName("data-type");
        let projectId=event.srcElement.innerHTML;//获取点击的对象的节点项目ID
        event.srcElement.classList.add("showStyle");
        let projectValue;
        this.maxValue.forEach(element => {
           if(projectId.search(element[0].name)!=-1){
            projectValue=element[0].value;
           }
        });
       this.maxValue.forEach(element => {
        //超过y轴分界线的项目隐藏
        if(element[0].value>projectValue){         
            for(let index=0;index<this.multi.length;index++){
                if(element[0].name.search(this.multi[index].name)!=-1){    
                        let sumValue=0;
                        let laterProjectValue=false;
                        let forstLaterProjectValue=false;
                        let laterMaxValue=false;
                        let val=false;
                        //项目的子项目判断
                    this.multi[index].series.forEach(
                        function(item,location){
                            if(item.value<projectValue){
                                if(!laterMaxValue){
                                //判断是否是子项目的和第一次大于点击项目的最大值
                                   if(!val){                         
                                        sumValue=sumValue+item.value;
                                            if(sumValue>projectValue||sumValue==projectValue){
                                                if(!laterProjectValue){
                                                    let midValue=sumValue-projectValue;
                                                    item.value=item.value-midValue;
                                                    laterProjectValue=true;
                                                    
                                                }else{
                                                    item.value=0;
                                                }   
                                            }else{
                                                forstLaterProjectValue=true;
                                            }
                                    }
                                    else{
                                        item.value=0;
                                    }
                               }else{
                                    item.value=0;
                                }
                            }else{
                                //判断是否是子项目第一次之后大于点击项目的值
                                if(forstLaterProjectValue){
                                    if(!laterMaxValue){                 
                                        item.value=projectValue-sumValue;
                                        laterMaxValue=true;//表示已剪切过，后面的子项目应该清空
           
                                    }else{
                                        item.value=0;
                                    }
        
                                }else{
                                    //判断是否是子项目第一次大于点击项目的值
                                    if(!val){
                                        item.value=projectValue;
                                        val=true;
                                    }
                                    else{                                 
                                        item.value=0;//如果是第一次子项目大于点击项目的值，之后的子项目的数据清零
                                    }                                                
                                }
                            }
                                                                                                              
                        });
      
                }
        
            }                                          
        }
        
     });
    
    this.yScaleMax=projectValue;
  
    }

   
}

