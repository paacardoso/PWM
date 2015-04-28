namespace PersonalWorkManagerWeb.Pages
{

    using System;
    using System.Globalization;
    using System.Linq;
    using System.Web.Services;
    using Newtonsoft.Json;

    public partial class Projects : System.Web.UI.Page
    {

        #region "Project"
        [WebMethod]
        public static string GetProjectsJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from p in objCtx.Project
                              select new
                              {
                                  Id = p.Id,
                                  Code = p.Code,
                                  Name = p.Name,
                                  Description = p.Description
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetProjectStatusesJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from e in objCtx.Status
                              where e.IdStatusType.Equals((long)DBUtil.StatusTypes.Project)
                              select new
                              {
                                  Id = e.Id,
                                  Name = e.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetProjectJSON(long Id)
        {
            using (var objCtx = new PWMEntities())
            {
                var record = from p in objCtx.Project
                             where p.Id == Id
                             select new
                             {
                                 Id = p.Id,
                                 Code = p.Code,
                                 Name = p.Name,
                                 Description = p.Description,
                                 StartDate = p.StartDate,
                                 EndDate = p.EndDate,
                                 EstimatedDuration = p.EstimatedDuration,
                                 IdStatus = p.IdStatus
                             };
                string json = JsonConvert.SerializeObject(record);
                return json;
            }
        }

        [WebMethod]
        public static long InsertProjectJSON(string Code, string Name, string Description, string StartDate, string EndDate, long IdStatus)
        {
            DateTime? EndDateDT = null;
            if (EndDate.Length > 0)
            {
                EndDateDT = DateTime.Parse(EndDate);
            }

            Project project = new Project() { Code = Code, Name = Name, Description = Description, StartDate = DateTime.Parse(StartDate), EndDate = EndDateDT, IdStatus = IdStatus };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Project.AddObject(project);
                objCtx.SaveChanges();
            }
            return project.Id;
        }

        [WebMethod]
        public static bool UpdateProjectJSON(long Id, string Code, string Name, string Description, string StartDate, string EndDate, long IdStatus)
        {
            DateTime? EndDateDT = null;
            if (EndDate.Length > 0)
            {
                EndDateDT = DateTime.Parse(EndDate);
            }

            Project project;
            using (var objCtx = new PWMEntities())
            {
                project = objCtx.Project.SingleOrDefault(x => x.Id == Id);
                project.Code = Code;
                project.Name = Name;
                project.Description = Description;
                project.StartDate = DateTime.Parse(StartDate);
                project.EndDate = EndDateDT;
                project.IdStatus = IdStatus;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteProjectJSON(long Id)
        {
            Project project;
            using (var objCtx = new PWMEntities())
            {
                project = objCtx.Project.SingleOrDefault(x => x.Id == Id);
                objCtx.Project.DeleteObject(project);
                objCtx.SaveChanges();
            }
            return true;
        }
        #endregion

        #region "Task"
        [WebMethod]
        public static string GetTasksJSON(long IdProject)
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from t in objCtx.Task
                              join e in objCtx.Status on t.IdStatus equals e.Id
                              where t.IdProject == IdProject
                              select new
                              {
                                  Id = t.Id,
                                  Name = t.Name,
                                  Description = t.Description,
                                  Order = t.Order,
                                  Status = e.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetTaskStatusesJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from e in objCtx.Status
                              where e.IdStatusType.Equals((long)DBUtil.StatusTypes.Task)
                              select new
                              {
                                  Id = e.Id,
                                  Name = e.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static long InsertTaskJSON(string Name, string Description, int Order, int IdProject, int IdStatus)
        {
            Task Task = new Task() { Name = Name, Description = Description, Order = Order, IdProject = IdProject, IdStatus = IdStatus };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Task.AddObject(Task);
                objCtx.SaveChanges();
            }
            return Task.Id;
        }

        [WebMethod]
        public static bool UpdateTaskJSON(int Id, string Name, string Description, int Order, int IdProject, int IdStatus)
        {
            Task Task;
            using (var objCtx = new PWMEntities())
            {
                Task = objCtx.Task.SingleOrDefault(x => x.Id == Id);
                Task.Name = Name;
                Task.Description = Description;
                Task.Order = Order;
                Task.IdProject = IdProject;
                Task.IdStatus = IdStatus;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteTaskJSON(int Id)
        {
            Task Task;
            using (var objCtx = new PWMEntities())
            {
                Task = objCtx.Task.SingleOrDefault(x => x.Id == Id);
                objCtx.Task.DeleteObject(Task);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteTasksJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Task WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }

        #endregion

        #region "Alert"
        [WebMethod]
        public static string GetAlertsJSON(long IdProject)
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from t in objCtx.Alert
                              where t.IdProject == IdProject
                              select new
                              {
                                  Id = t.Id,
                                  Name = t.Name,
                                  Description = t.Description,
                                  DueDate = t.DueDate
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static long InsertAlertJSON(string Name, string Description, string DueDate, int IdProject)
        {
            Alert Alert = new Alert() { Name = Name, Description = Description, DueDate = DateTime.Parse(DueDate), IdProject = IdProject };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Alert.AddObject(Alert);
                objCtx.SaveChanges();
            }
            return Alert.Id;
        }

        [WebMethod]
        public static bool UpdateAlertJSON(int Id, string Name, string Description, string DueDate, int IdProject)
        {
            Alert Alert;
            using (var objCtx = new PWMEntities())
            {
                Alert = objCtx.Alert.SingleOrDefault(x => x.Id == Id);
                Alert.Name = Name;
                Alert.Description = Description;
                Alert.DueDate = DateTime.Parse(DueDate);
                Alert.IdProject = IdProject;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteAlertJSON(int Id)
        {
            Alert Alert;
            using (var objCtx = new PWMEntities())
            {
                Alert = objCtx.Alert.SingleOrDefault(x => x.Id == Id);
                objCtx.Alert.DeleteObject(Alert);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteAlertsJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Alert WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }
        #endregion

        #region "Note"
        [WebMethod]
        public static string GetNotesJSON(long IdProject)
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from t in objCtx.Note
                              where t.IdProject == IdProject
                              select new
                              {
                                  Id = t.Id,
                                  Text = t.Text
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static long InsertNoteJSON(string Text, int IdProject)
        {
            Note Note = new Note() { Text = Text, IdProject = IdProject };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Note.AddObject(Note);
                objCtx.SaveChanges();
            }
            return Note.Id;
        }

        [WebMethod]
        public static bool UpdateNoteJSON(int Id, string Text, int IdProject)
        {
            Note Note;
            using (var objCtx = new PWMEntities())
            {
                Note = objCtx.Note.SingleOrDefault(x => x.Id == Id);
                Note.Text = Text;
                Note.IdProject = IdProject;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteNoteJSON(int Id)
        {
            Note Note;
            using (var objCtx = new PWMEntities())
            {
                Note = objCtx.Note.SingleOrDefault(x => x.Id == Id);
                objCtx.Note.DeleteObject(Note);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteNotesJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Note WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }
        #endregion

        #region "Session"
        [WebMethod]
        public static string GetSessionsJSON(long IdProject)
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from s in objCtx.Session
                              join t in objCtx.Task on s.IdTask equals t.Id
                              join r in objCtx.Resource on s.IdResource equals r.Id
                              join p in objCtx.Project on t.IdProject equals p.Id
                              where p.Id == IdProject
                              select new
                              {
                                  Id = t.Id,
                                  StartTime = s.StartTime,
                                  EndTime = s.EndTime,
                                  Task = t.Name,
                                  Resource = r.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetSessionTasksJSON(long IdProject)
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from t in objCtx.Task
                              join e in objCtx.Status on t.IdStatus equals e.Id
                              where t.IdProject == IdProject
                              select new
                              {
                                  Id = t.Id,
                                  Name = t.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetSessionResourcesJSON(long IdProject)
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from r in objCtx.Resource
                              join e in objCtx.Status on r.IdStatus equals e.Id
                              select new
                              {
                                  Id = r.Id,
                                  Name = r.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static long InsertSessionJSON(string StartTime, string EndTime, long IdTask, long IdResource)
        {
            Session Session = new Session() { StartTime = DateTime.Parse(StartTime), EndTime = DateTime.Parse(EndTime), IdTask = IdTask, IdResource = IdResource };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Session.AddObject(Session);
                objCtx.SaveChanges();
            }
            return Session.Id;
        }

        [WebMethod]
        public static bool UpdateSessionJSON(int Id, string StartTime, string EndTime, long IdTask, long IdResource)
        {
            Session Session;
            using (var objCtx = new PWMEntities())
            {
                Session = objCtx.Session.SingleOrDefault(x => x.Id == Id);
                Session.StartTime = DateTime.Parse(StartTime);
                Session.EndTime = DateTime.Parse(EndTime);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteSessionJSON(int Id)
        {
            Session Session;
            using (var objCtx = new PWMEntities())
            {
                Session = objCtx.Session.SingleOrDefault(x => x.Id == Id);
                objCtx.Session.DeleteObject(Session);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteSessionsJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Session WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }
        #endregion

        #region "Form Events"
        protected void Page_Load(object sender, EventArgs e)
        {
        }
        #endregion

    }

}