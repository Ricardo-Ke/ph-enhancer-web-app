import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Config} from "../model/config"
import {HistgramBin} from "../model/histogram-bin";
import {VennData} from "../model/vennData";
import {Thresholds} from "../model/thresholds";

// import 'rxjs/add/operator/toPromise';

@Injectable()

export class StatisticsService {

    private baseUrl = Config.baseUrl;
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http,
                ) {
    }

    public getHistData(projectId:string,psmType:string, fieldType: string): Promise<HistgramBin[]> {
        let histDataUrl = this.baseUrl + "statistics/histogram?" +
                "projectId=" + projectId +
                "&numBins=" + "20" +
                "&psmType=" + psmType +
                "&fieldType=" + fieldType;
            return this.http.get(histDataUrl)
                .toPromise()
                .then(response => {
                    var histBins : HistgramBin[] = response.json() as HistgramBin[];
                    for(var i=0; i<histBins.length; i++) {
                       if(fieldType === "confScore" || fieldType === "recommConfScore"|| fieldType === "clusterRatio") {
                            histBins[i].name = Number(histBins[i].lowerBound).toFixed(3) + " - " + Number(histBins[i].upperBound).toFixed(3);
                        }else {
                           histBins[i].name = histBins[i].lowerBound + " - " + histBins[i].upperBound;
                       }
                    }
                    return histBins;
                })
                .catch(this.handleError);
    }

    public getThresholds(projectId: string): Promise<Thresholds> {
        let dataUrl = this.baseUrl + "statistics/thresholds?" +
            "projectId=" + projectId ;
        return this.http.get(dataUrl)
            .toPromise()
            .then(response => {
                var thresholds: Thresholds = response.json() as Thresholds;
                return thresholds;
            })
            .catch(this.handleError);
    }

    public getVennData(projectId: string): Promise<VennData> {
        let dataUrl = this.baseUrl + "statistics/venndata?" +
            "projectId=" + projectId ;
        return this.http.get(dataUrl)
            .toPromise()
            .then(response => {
                var vennData: VennData = response.json() as VennData;
                return vennData;
            })
            .catch(this.handleError);
    }

    public getVennDataList(): Promise<VennData[]> {
        let dataUrl = this.baseUrl + "statistics/venndatalist"
        return this.http.get(dataUrl)
            .toPromise()
            .then(response => {
                var vennDataList: VennData[] = response.json() as VennData[];
                return vennDataList;
            })
            .catch(this.handleError);
    }


    public getProjects(): Promise<string[]> {
        let dataUrl = this.baseUrl + "statistics/projects";
        return this.http.get(dataUrl)
            .toPromise()
            .then(response => {
                var projects: string[] = response.json() as string[];
                return projects;
            })
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
