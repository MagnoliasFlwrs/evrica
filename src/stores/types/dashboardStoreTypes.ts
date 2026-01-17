export interface DashboardStoreTypes {
    error?:boolean;
    loading?:boolean;
    riskOfLosingAClient?:null;
    whoIsControlOfTheConversation:null,
    callsQuality:null,
    employeeDidntHandleObjection:null,
    dealProbabilityLastDays:null,
    problemCallsPriorityLastDays:null,
    getRiskOfLosingAClient:(orgId:string | number , days: number)=>Promise<any>;
    getWhoIsControlOfTheConversation:(orgId:string | number , days: number)=>Promise<any>;
    getCallsQualityLastDays:(orgId:string | number , days: number)=>Promise<any>;
    getEmployeeDidntHandleObjection:(orgId:string | number , days: number)=>Promise<any>;
    getDealProbabilityLastDays:(orgId:string | number , days: number)=>Promise<any>;
    getProblemCallsPriorityLastDays:(orgId:string | number , days: number)=>Promise<any>;

}