import type { ClientPortrait } from './clientPortraitTypes';

export interface DashboardStoreTypes {
    error?:boolean;
    loading?:boolean;
    riskOfLosingAClient?:null;
    whoIsControlOfTheConversation:null,
    callsQuality:null,
    employeeDidntHandleObjection:null,
    clientPortrait: ClientPortrait | null;
    dealProbabilityLastDays:null,
    problemCallsPriorityLastDays:null,
    getRiskOfLosingAClient:(orgId:string | number , days: number)=>Promise<any>;
    getWhoIsControlOfTheConversation:(orgId:string | number , days: number)=>Promise<any>;
    getCallsQualityLastDays:(orgId:string | number , days: number)=>Promise<any>;
    getEmployeeDidntHandleObjection:(orgId:string | number , days: number)=>Promise<any>;
    getDealProbabilityLastDays:(orgId:string | number , days: number)=>Promise<any>;
    getProblemCallsPriorityLastDays:(orgId:string | number , days: number)=>Promise<any>;
    getClientPortrait: (orgId:string | number ,
                             dateFrom:string,
                             dateTo:string,
                             categoryId:string|number,
                             target:boolean)=>Promise<any>;
    resetClientPortrait: () => void;

}