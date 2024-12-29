import xlsx from "xlsx";


type LayoffMetric = {
    countyName: string;
    noticeDate: string;
    processDate: string;
    effectiveDate: string;
    companyName: string;
    layoffLocation: string;
    employeesAffected: number;
}

interface BaseMetricService {

    getMetricData(): Promise<LayoffMetric[]>
}


const LAYOFF_SHEET_NUMBER = 2

const COL_COUNTY = 0
const COL_NOTICE_DATE = 1
const COL_PROCESS_DATE = 2
const COL_EFFECTIVE_DATE = 3
const COL_COMPANY_NAME = 4
const COL_LAYOFF_LOCATION = 7
const COL_EMPLOYEES_AFFECTED = 6

class WARNLayoffMetricService implements BaseMetricService {
  
  async getMetricData() {
    const res = await fetch("https://edd.ca.gov/siteassets/files/jobs_and_training/warn/warn_report1.xlsx", {
    method: "GET",
    });
    
    const buffer = await res.arrayBuffer();
    const workbook = xlsx.read(buffer, {type:'binary', cellText:false, cellDates:true});
    const data_sheet = workbook.Sheets[workbook.SheetNames[LAYOFF_SHEET_NUMBER]];
    const raw_data: Array<Array<string>> = xlsx.utils.sheet_to_json(data_sheet, {header:1, raw:false, dateNF:'yyyy-mm-dd'});
    return raw_data.flatMap((row, idx) => {
        console.log('name', idx, row[COL_COMPANY_NAME])
        let metric =  {
            countyName: row[COL_COUNTY],
            noticeDate: row[COL_NOTICE_DATE],
            processDate: row[COL_PROCESS_DATE],
            effectiveDate: row[COL_EFFECTIVE_DATE],
            companyName: row[COL_COMPANY_NAME],
            layoffLocation: row[COL_LAYOFF_LOCATION],
            employeesAffected: parseInt(row[COL_EMPLOYEES_AFFECTED]) as number,
        }
        if (!metric.companyName || !metric.employeesAffected) {
            return []
        }
        return [metric]
    })
    
  }
}

export default WARNLayoffMetricService