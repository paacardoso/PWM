using System;
using System.Linq;
using System.Web.Services;

namespace PersonalWorkManagerWeb
{
    public partial class ChangePassword : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        [WebMethod]
        public static bool ChangePasswordJSON(int Id, string NewPassword)
        {
            Resource Resource;
            using (var objCtx = new PWMEntities())
            {
                Resource = objCtx.Resource.SingleOrDefault(x => x.Id == Id);
                Resource.Password = NewPassword;
                objCtx.SaveChanges();
            }
            return true;
        }

    }
}
