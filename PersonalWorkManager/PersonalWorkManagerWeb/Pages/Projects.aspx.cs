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
            // Parse date with custom specifier.
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime StartDateDT;
            DateTime? EndDateDT = null;
            StartDateDT = DateTime.ParseExact(StartDate, "dd-mm-yyyy", provider);
            if (EndDate.Length > 0)
            {
                EndDateDT = DateTime.ParseExact(EndDate, "dd-mm-yyyy", provider);
            }

            Project project = new Project() { Code = Code, Name = Name, Description = Description, StartDate = StartDateDT, EndDate = EndDateDT, IdStatus = IdStatus };
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
            // Parse date with custom specifier.
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime StartDateDT;
            DateTime? EndDateDT = null;
            StartDateDT = DateTime.ParseExact(StartDate, "dd-mm-yyyy", provider);
            if (EndDate.Length > 0)
            {
                EndDateDT = DateTime.ParseExact(EndDate, "dd-mm-yyyy", provider);
            }

            Project project;
            using (var objCtx = new PWMEntities())
            {
                project = objCtx.Project.SingleOrDefault(x => x.Id == Id);
                project.Code = Code;
                project.Name = Name;
                project.Description = Description;
                project.StartDate = StartDateDT;
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
            // Parse date with custom specifier.
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime DueDateDT;
            DueDateDT = DateTime.ParseExact(DueDate, "dd-mm-yyyy", provider);

            Alert Alert = new Alert() { Name = Name, Description = Description, DueDate = DueDateDT, IdProject = IdProject };
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
            // Parse date with custom specifier.
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime DueDateDT;
            DueDateDT = DateTime.ParseExact(DueDate, "dd-mm-yyyy", provider);

            Alert Alert;
            using (var objCtx = new PWMEntities())
            {
                Alert = objCtx.Alert.SingleOrDefault(x => x.Id == Id);
                Alert.Name = Name;
                Alert.Description = Description;
                Alert.DueDate = DueDateDT;
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

        #region "Form Events"
        protected void Page_Load(object sender, EventArgs e)
        {
        }
        #endregion

    }

}