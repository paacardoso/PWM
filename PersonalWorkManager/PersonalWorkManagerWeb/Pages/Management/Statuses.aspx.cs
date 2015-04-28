namespace PersonalWorkManagerWeb.Pages.Management
{

    using System;
    using System.Linq;
    using System.Web.Services;
    using Newtonsoft.Json;

    public partial class Statuses : System.Web.UI.Page
    {

        [WebMethod]
        public static string GetStatusesJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from e in objCtx.Status
                              join et in objCtx.StatusType on e.IdStatusType equals et.Id
                              select new
                              {
                                  Id = e.Id,
                                  Name = e.Name,
                                  Description = e.Description,
                                  StatusTypeName = et.Name,
                                  Order = e.Order
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static string GetStatusStatusTypesJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from e in objCtx.StatusType
                              orderby e.Id ascending
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
        public static long InsertStatusJSON(string Name, string Description, int IdStatusType, int Order)
        {
            Status Status = new Status() { Name = Name, Description = Description, IdStatusType = IdStatusType, Order = Order };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Status.AddObject(Status);
                objCtx.SaveChanges();
            }
            return Status.Id;
        }

        [WebMethod]
        public static bool UpdateStatusJSON(int Id, string Name, string Description, int IdStatusType, int Order)
        {
            Status Status;
            using (var objCtx = new PWMEntities())
            {
                Status = objCtx.Status.SingleOrDefault(x => x.Id == Id);
                Status.Name = Name;
                Status.Description = Description;
                Status.IdStatusType = IdStatusType;
                Status.Order = Order;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteStatusJSON(int Id)
        {
            Status Status;
            using (var objCtx = new PWMEntities())
            {
                Status = objCtx.Status.SingleOrDefault(x => x.Id == Id);
                objCtx.Status.DeleteObject(Status);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteStatusesJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Status WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }
        
        protected void Page_Load(object sender, EventArgs e)
        {
        }

    }
}