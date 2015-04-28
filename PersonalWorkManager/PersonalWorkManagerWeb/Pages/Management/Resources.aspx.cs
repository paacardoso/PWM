namespace PersonalWorkManagerWeb.Pages.Management
{

    using System;
    using System.Linq;
    using System.Web.Services;
    using Newtonsoft.Json;

    public partial class Resources : System.Web.UI.Page
    {

        [WebMethod]
        public static string GetResourcesJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from r in objCtx.Resource
                              join e in objCtx.Status on r.IdStatus equals e.Id
                              select new
                              {
                                  Id = r.Id,
                                  Login = r.Login,
                                  Name = r.Name,
                                  Status = e.Name
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetResourceStatusesJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from e in objCtx.Status
                              where e.IdStatusType.Equals((long)DBUtil.StatusTypes.Resource)
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
        public static long InsertResourceJSON(string Login, string Name, string Password, int IdStatus)
        {
            Resource Resource = new Resource() { Login = Login, Name = Name, Password = Password, IdStatus = IdStatus };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Resource.AddObject(Resource);
                objCtx.SaveChanges();
            }
            return Resource.Id;
        }

        [WebMethod]
        public static bool UpdateResourceJSON(int Id, string Login, string Name, string Password, int IdStatus)
        {
            Resource Resource;
            using (var objCtx = new PWMEntities())
            {
                Resource = objCtx.Resource.SingleOrDefault(x => x.Id == Id);
                Resource.Login = Login;
                Resource.Name = Name;
                Resource.Password = Password;
                Resource.IdStatus = IdStatus;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteResourceJSON(int Id)
        {
            Resource Resource;
            using (var objCtx = new PWMEntities())
            {
                Resource = objCtx.Resource.SingleOrDefault(x => x.Id == Id);
                objCtx.Resource.DeleteObject(Resource);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteResourcesJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Resource WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
        }
    
    }
}