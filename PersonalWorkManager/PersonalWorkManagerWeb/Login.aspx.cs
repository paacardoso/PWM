using System;
using System.Linq;
using System.Web.Security;
using System.Web.Services;
using Newtonsoft.Json;
using System.Web;

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

        [WebMethod]
        public static string LoginJSON(string Login, string Password, bool Persistable) {
            using (var objctx = new PWMEntities()) {
                var resource = (from u in objctx.Resource
                                where (u.Login.ToLower() == Login.ToLower()) && (u.Password == Password)
                                select new {
                                    Id = u.Id,
                                    Login = u.Login,
                                    Name = u.Name,
                                    IdStatus = u.IdStatus
                                });
                string json = null;
                if (resource.ToList().Count() > 0) {
                    
                    ////let us now set the authentication cookie so that we can use that later.
                    //FormsAuthentication.SetAuthCookie(Login, Persistable);
                    ////FormsAuthentication.RedirectFromLoginPage(Login, Persistable);

                    //Dim ticket As New FormsAuthenticationTicket(1, username, DateTime.Now, DateTime.Now.AddMinutes(3), False, "member")
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, Login, DateTime.Now, DateTime.Now.AddMinutes(3), false, "member");
                    //Dim cookie As New HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket))
                    HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
                    //HttpContext.Current.Request.Cookies.Add(cookie)
                    HttpContext.Current.Request.Cookies.Add(cookie);

                    json = JsonConvert.SerializeObject(resource.ToList()[0]);
                }

                return json;

            }
        }

    }
}
