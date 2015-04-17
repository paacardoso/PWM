namespace PersonalWorkManagerWeb.Pages.Management
{

    using System;
    using System.Linq;
    using System.Web.Services;
    using Newtonsoft.Json;

    public partial class Parameters : System.Web.UI.Page
    {

        [WebMethod]
        public static string GetParametersJSON()
        {
            using (var objCtx = new PWMEntities())
            {
                var records = from p in objCtx.Parameter
                              select new
                              {
                                  Id = p.Id,
                                  Name = p.Name,
                                  Value = p.Value,
                                  Description = p.Description
                              };
                string json = JsonConvert.SerializeObject(records);
                return json;
            }
        }

        [WebMethod]
        public static long InsertParameterJSON(string Name, string Value, string Description)
        {
            Parameter parameter = new Parameter() { Name = Name, Value = Value, Description = Description };
            using (var objCtx = new PWMEntities())
            {
                objCtx.Parameter.AddObject(parameter);
                objCtx.SaveChanges();
            }
            return parameter.Id;
        }

        [WebMethod]
        public static bool UpdateParameterJSON(int Id, string Name, string Value, string Description)
        {
            Parameter parameter;
            using (var objCtx = new PWMEntities())
            {
                parameter = objCtx.Parameter.SingleOrDefault(x => x.Id == Id);
                parameter.Name = Name;
                parameter.Value = Value;
                parameter.Description = Description;
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteParameterJSON(int Id)
        {
            Parameter parameter;
            using (var objCtx = new PWMEntities())
            {
                parameter = objCtx.Parameter.SingleOrDefault(x => x.Id == Id);
                objCtx.Parameter.DeleteObject(parameter);
                objCtx.SaveChanges();
            }
            return true;
        }

        [WebMethod]
        public static bool DeleteParametersJSON(string Ids)
        {
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Parameter WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
        }
    
    }
}