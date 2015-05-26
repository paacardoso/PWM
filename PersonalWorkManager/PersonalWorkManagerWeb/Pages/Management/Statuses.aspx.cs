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
                var records = from s in objCtx.Status
                              join st in objCtx.StatusType on s.IdStatusType equals st.Id
                              orderby s.IdStatusType ascending, s.Order ascending
                              select new
                              {
                                  Id = s.Id,
                                  Name = s.Name,
                                  Description = s.Description,
                                  StatusTypeName = st.Name,
                                  Order = s.Order
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
                var records = from s in objCtx.StatusType
                              orderby s.Id ascending
                              select new
                              {
                                  Id = s.Id,
                                  Name = s.Name
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