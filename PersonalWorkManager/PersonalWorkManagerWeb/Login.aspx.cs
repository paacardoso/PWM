using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Security;
using System.Web.Script.Services;
using System.Web.UI.HtmlControls;

namespace PersonalWorkManagerWeb
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            
            using (var objctx = new PWMEntities())
            {
                var login = this.txtLogin.Value;
                var password = this.txtPassword.Value;
                var persistable = this.chkPersistLoginCookie.Checked;
                var recurso = (from t in objctx.Resource
                               where (t.Login.ToLower() == login.ToLower()) && (t.Password == password)
                               select t).FirstOrDefault<Resource>();
                if (recurso == null)
                {
                    (this.Master as SiteMaster).Danger("utilizador não identificado.");
                }
                else
                {
                    //let us now set the authentication cookie so that we can use that later.
                    FormsAuthentication.SetAuthCookie(login, persistable);
                    FormsAuthentication.RedirectFromLoginPage(login, persistable);
                }
            }
        } 
    }
}
