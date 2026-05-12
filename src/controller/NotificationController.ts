import { Request, Response } from "express";



import { NotificationService } from "../services/NotificationService";
import { NotificationSenderService } from "../services/NotificationSenderService";


export class NotificationsController {
  public async createNotif(req: Request, res: Response): Promise<Response> {
    const { categoriePoubelle, idAdmin, isFull, notifIsSent } = req.body;
    
    try {
      const notif = await NotificationService.createNotification(
        categoriePoubelle,
        idAdmin,
        isFull,
        notifIsSent
       
      );
      return res.status(201).json(notif);
    } catch (error: unknown) {
      return res.status(400).json({ message: "probleme creation d'une notification " });
    }
  }

   public async updateNotif(req: Request, res: Response): Promise<Response> {
    
    
     try {
    const { categoriePoubelle } = req.params;
    const { isFull } = req.body;
    if (typeof isFull !== 'boolean') {
      return res.status(400).json({ message: "isFull doit être un booléen" });
    }
    if (!categoriePoubelle) {
      return res.status(400).json({ message: "categoriePoubelle requise" });
    }

    
    const updates: any = {};

    if (isFull !== undefined) updates.isFull = isFull;
    

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Aucun champ valide à mettre à jour"
      });
    }

    const notif = await NotificationService.updateByCategorie(
      categoriePoubelle,
      updates
    );

    if (!notif) {
      return res.status(404).json({
        message: "Notification non trouvée"
      });
    }
    if(isFull){
        const isSent = await NotificationService.getIsSentByCategorie(categoriePoubelle);
        if(!isSent){
            //mettre notif.iadmin quand for real
            
            //envoie la notif
            await NotificationSenderService.sendNotification("samuelben.robillard@gmail.com", categoriePoubelle);
            //remet a true pour pas send plusieurs notif
            await NotificationService.updateNotifSentByCategorie(categoriePoubelle, true);
        }
    }
    else{
        //si la poubelle est marquée comme pas pleine, on remet notifIsSent à false pour pouvoir renvoyer une notif si elle est remplie à nouveau
        await NotificationService.updateNotifSentByCategorie(categoriePoubelle, false);
    }
    return res.status(200).json(notif);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


 
  public async getAllNotifs(req: Request, res: Response): Promise<Response> {
    
    
    try {
      const notifs = await NotificationService.getAllNotif();
      return res.status(201).json(notifs);
    } catch (error: unknown) {
      return res.status(400).json({ message: "probleme get notifications" });
    }
  }
}

