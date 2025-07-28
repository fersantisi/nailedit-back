import cron from 'node-cron';
import { sendMail } from '../services/mailer.service';
import Project from '../database/models/Project';
import User from '../database/models/User';
import ProjectNotification from '../database/models/ProjectNotification';
import ProjectParticipant from '../database/models/ProjectParticipant';
import GoalNotification from '../database/models/GoalNotification';
import Goal from '../database/models/Goal';
import TaskNotification from '../database/models/TaskNotification';
import Task from '../database/models/Task';

const checkReminders = async () => {
  const now = new Date();
  const projectNotifications = await ProjectNotification.findAll({
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
  
  for (const notification of projectNotifications) {

    const project = notification.project;
    const trigger = new Date(project.dueDate);
    const projectNotificationTime = notification.notificationTime;

    trigger.setDate(trigger.getDate()-projectNotificationTime);

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
        console.log(`Project notification ${notification.id} sent and deleted`);
    };
  };

  const goalNotifications = await GoalNotification.findAll({
    include: [{ 
        model: Goal,
        include: [{
          model: Project, 
          include: [{
            model: User,
            attributes: ['email']
          },{
          model: ProjectParticipant, 
            include: [{ 
                model: User, 
                attributes: ['email'] }],
          }],
        }],
    }],
  });
  
  for (const notification of goalNotifications) {

    const goal = notification.goal;
    const trigger = new Date(goal.dueDate);
    const goalNotificationTime = notification.notificationTime;

    trigger.setDate(trigger.getDate()-goalNotificationTime);

    if(now>= trigger){

        const recipients = [
        goal.project.user!.email, 
        ...goal.project.participants!.map(p => p.user!.email), 
        ];

        for (const recipient of recipients) {
            try {
                await sendMail(
                recipient,
                `Reminder: ${goal.name} due soon`,
                `Your goal "${goal.name}" is due on ${new Date(goal.dueDate).toDateString()}`
                );
            } catch (error) {
                console.error(`Failed to send email to ${recipient}:`, error);
            };
        };
        await notification.destroy();
        console.log(`Goal notification ${notification.id} sent and deleted`);
    };
  };



  const taskNotifications = await TaskNotification.findAll({
    include: [{
      model:Task,      
      include: [{ 
            model: Goal,
            include: [{
              model: Project, 
              include: [{
                model: User,
                attributes: ['email']
              },{
              model: ProjectParticipant, 
                include: [{ 
                    model: User, 
                    attributes: ['email'] }],
              }],
            }],
      }],
    }]
  });
  
  for (const notification of taskNotifications) {

    const task = notification.task;
    const trigger = new Date(task.dueDate);
    const taskNotificationTime = notification.notificationTime;

    trigger.setDate(trigger.getDate()-taskNotificationTime);

    if(now>= trigger){

        const recipients = [
        task.goal.project.user!.email, 
        ...task.goal.project.participants!.map(p => p.user!.email), 
        ];

        for (const recipient of recipients) {
            try {
                await sendMail(
                recipient,
                `Reminder: ${task.name} due soon`,
                `Your task "${task.name}" is due on ${new Date(task.dueDate).toDateString()}`
                );
            } catch (error) {
                console.error(`Failed to send email to ${recipient}:`, error);
            };
        };
        await notification.destroy();
        console.log(`Task notification ${notification.id} sent and deleted`);
    };
  };
};


cron.schedule('0 9 * * *', checkReminders); 

//'minutes hour dayOfMonth month dayOfWeek