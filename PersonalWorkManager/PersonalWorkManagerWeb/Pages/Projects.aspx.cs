using System;
using System.Globalization;
using System.Linq;
using System.Web.Services;
using Newtonsoft.Json;

namespace PersonalWorkManagerWeb.Pages
{
    public partial class Projects : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

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
                EndDateDT = DateTime.ParseExact(EndDate, "dd-mm-yyyy", provider);

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
                EndDateDT = DateTime.ParseExact(EndDate, "dd-mm-yyyy", provider);

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
    }
}