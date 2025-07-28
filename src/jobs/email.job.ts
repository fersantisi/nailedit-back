import cron from 'node-cron';
import { Op } from 'sequelize';
import { sendMail } from '../services/mailer.service';
import Project from '../database/models/Project';
import User from '../database/models/User';
import ProjectNotification from '../database/models/ProjectNotification';
import ProjectParticipant from '../database/models/ProjectParticipant';

const checkReminders = async () => {
  const now = new Date();
  const notifications = await ProjectNotification.findAll({
    include: [{ 
        model: Project,
        include: [{
                model: User, 
                attributes: ['email']},
                         
                {model: ProjectParticipant, 
                    include: [{ 
                        model: User, 
                        attributes: ['email'] }],
        }],
    }],
  });
  
  for (const notification of notifications) {

    const project = notification.project;
    const trigger = new Date(project.dueDate);
    const notificationTime = notification.notificationTime;

    trigger.setDate(trigger.getDate()-notificationTime);

    if(now>= trigger){

        const recipients = [
        project.user!.email, 
        ...project.participants!.map(p => p.user!.email), 
        ];

        for (const recipient of recipients) {
            try {
                await sendMail(
                recipient,
                `Reminder: ${project.name} due soon`,
                `Your project "${project.name}" is due on ${new Date(project.dueDate).toDateString()}`
                );
            } catch (error) {
                console.error(`Failed to send email to ${recipient}:`, error);
            };
        };
        await notification.destroy();
    };
  };
};


cron.schedule('0 9 * * *', checkReminders); 

//'minutes hour dayOfMonth month dayOfWeek