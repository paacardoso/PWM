using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Text;
using Newtonsoft.Json;

namespace PersonalWorkManagerWeb.Pages.Management
{
    public partial class Parameters : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        [WebMethod]
        public static string GetParametersJSON()
        {
            //throw new Exception("erro a obter todos os registos.");
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
            //throw new Exception("erro a inserir um novo registo.");
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
            //throw new Exception("erro a actualizar o registo.");
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
            //throw new Exception("erro a apagar os registos selecionados.");
            using (var objCtx = new PWMEntities())
            {
                objCtx.ExecuteStoreCommand("DELETE FROM Parameter WHERE Id IN (" + Ids + ")");
                objCtx.SaveChanges();
            }
            return true;
        }
    }
}