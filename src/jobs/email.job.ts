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
import { Op, TableHints } from 'sequelize';

/*
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
*/

const checkReminders = async () => {
  const now = new Date();
  const users = await User.findAll({
    where: { notification_time: { [Op.ne]: -1 } },
    include: [
      { 
        model: Project,
        include: [
          { 
            model: Goal,
            include: [{ model: Task }]
          },
        ]
      },{ 
        model: ProjectParticipant,
        include: [
          { 
            model: Project, 
            include: [
              { 
                model: Goal,
                include: [{ model: Task }]
              }
            ]
          }
        ]
      }
    ]
  });

  const taskRecipients = [];
  const goalRecipients = [];
  const projectRecipients = [];

  for (const user of users) {
    const notificationTime = user.notification_time;
    for(const project of user.proyects){
      for(const goal of project.goal){
        for(const task of goal.task){

      
          const trigger = new Date(task.dueDate);

          trigger.setDate(trigger.getDate()-notificationTime);

          if(now>= trigger){
            taskRecipients.push({recipient: user.email,task: task.name,date: new Date(task.dueDate).toDateString()})
          };
        };

        const goalTrigger = new Date(goal.dueDate);

        goalTrigger.setDate(goalTrigger.getDate()-notificationTime);

        if(now>= goalTrigger){
          goalRecipients.push({recipient: user.email,goal: goal.name,date: new Date(goal.dueDate).toDateString()})
        };
      };
      const projectTrigger = new Date(project.dueDate);
      

      projectTrigger.setDate(projectTrigger.getDate()-notificationTime);

      if(now>= projectTrigger){
        projectRecipients.push({recipient: user.email,project: project.name,date: new Date(project.dueDate).toDateString()})
      };
    };
  };

  for(const reminder of taskRecipients){
    try {
      await sendMail(
      reminder.recipient,
      `Reminder: ${reminder.task} due soon`,
      `Your task "${reminder.task}" is due on ${reminder.date}`
      );
    } catch (error) {
      console.error(`Failed to send email to ${reminder.recipient}:`, error);
    };
  }

  for(const reminder of goalRecipients){
    try {
      await sendMail(
      reminder.recipient,
      `Reminder: ${reminder.goal} due soon`,
      `Your goal "${reminder.goal}" is due on ${reminder.date}`
      );
    } catch (error) {
      console.error(`Failed to send email to ${reminder.recipient}:`, error);
    };
  }

  for(const reminder of projectRecipients){
    try {
      await sendMail(
      reminder.recipient,
      `Reminder: ${reminder.project} due soon`,
      `Your project "${reminder.project}" is due on ${reminder.date}`
      );
    } catch (error) {
      console.error(`Failed to send email to ${reminder.recipient}:`, error);
    };
  }
};

cron.schedule('0 9 * * *', checkReminders); 

//'minutes hour dayOfMonth month dayOfWeek