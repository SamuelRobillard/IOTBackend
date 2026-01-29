import Date,{IDate} from "../model/Date";
export class DateService {
    public static async createDate(
        idDechet:string,
        date:string
     
    ): Promise<any> {
    
      const existingDate = await Date.findOne({ idDechet:idDechet});
      if (existingDate) {
        return "Date already exists"
      }
  
      

  
      const dateDechet = new Date({
          idDechet,
          date,
      });
  
      
      await dateDechet.save();
  
      
      return dateDechet;
    }
}