import { Types } from "mongoose";

import Notifications from "../model/Notifications";
export class NotificationService {
    public static async createNotification(
        categoriePoubelle : string,
        idAdmin : Types.ObjectId,
        isFull : boolean,
        notifIsSent : boolean): Promise<any> {
    
     
    

  
      const notifs = new Notifications({
          categoriePoubelle: categoriePoubelle,
          idAdmin: idAdmin,
          isFull: isFull,
          notifIsSent: notifIsSent
      });
  
      
      await notifs.save();
  
      
      return notifs;
    }


    public static async getAllNotif():Promise<any>{

       try {
        const notifs = await Notifications.find();
        console.log(notifs);
        if(notifs != null){
            return notifs
        }
       } catch (error) {       
        console.log('Erreur lors de la récupération des notifications.')
       }

    }


    public static async updateByCategorie(
        categoriePoubelle: string,
        updates: {
            isFull?: boolean;
            notifIsSent?: boolean;
        }): Promise<any> {
        return await Notifications.findOneAndUpdate(
            { categoriePoubelle },
            { $set: updates },
            { new: true }
        );
        }


 public static async updateNotifSentByCategorie(
        categoriePoubelle: string,
        notifIsSent: boolean
 ): Promise<any> {

        const updates: any = {};
        updates.notifIsSent = notifIsSent;

        const notif = await NotificationService.updateByCategorie(
        categoriePoubelle,
        updates
        );

        return notif;
        }



        public static async getIsSentByCategorie(categoriePoubelle: string):Promise<any>{
        
               try {
                const notifs = await Notifications.findOne({ categoriePoubelle })
                
                if(notifs != null){
                    return notifs.notifIsSent;
                }
               } catch (error) {       
                console.log('Erreur lors de la récupération des notifications.')
               }
        
            }
    }
    
   