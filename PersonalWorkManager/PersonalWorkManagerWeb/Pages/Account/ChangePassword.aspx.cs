namespace PersonalWorkManagerWeb
{

    using System;
    using System.Linq;
    using System.Web.Services;
    using Newtonsoft.Json;

    public partial class ChangePassword : System.Web.UI.Page
    {

        [WebMethod]
        public static string ChangePasswordJSON(int Id, string OldPassword, string NewPassword)
        {
            AjaxReturnMessage res = new AjaxReturnMessage();
            using (var objCtx = new PWMEntities())
            {
                var resource = objCtx.Resource.SingleOrDefault(x => x.Id == Id);
                if (resource.Password != OldPassword)
                {
                    res.Result = false;
                    res.Message = "A senha actual está incorrecta.";
                }
                else
                {
                    resource.Password = NewPassword;
                    objCtx.SaveChanges();
                    res.Result = true;
                }
            }

            string json = JsonConvert.SerializeObject(res);
            return json;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
        }

    }
}
