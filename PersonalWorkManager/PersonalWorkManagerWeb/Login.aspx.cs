﻿namespace PersonalWorkManagerWeb
{
    using System;
    using System.Linq;
    using System.Web;
    using System.Web.Security;
    using System.Web.Services;
    using Newtonsoft.Json;

    public partial class Login : System.Web.UI.Page
    {

        [WebMethod]
        public static string LoginJSON(string Login, string Password, bool Persistable)
        {
            using (var objCtx = new PWMEntities())
            {
                var resource = from u in objCtx.Resource
                               where (u.Login.ToLower() == Login.ToLower()) && (u.Password == Password)
                               select new
                               {
                                   Id = u.Id,
                                   Login = u.Login,
                                   Name = u.Name,
                                   IdStatus = u.IdStatus
                               };
                string json = null;
                if (resource.ToList().Count() > 0)
                {
                    HttpCookie authCookie = FormsAuthentication.GetAuthCookie(Login, Persistable);
                    if (!Persistable)
                    {
                        //this is because if it was not set then it got 
                        //automatically set to expire next year even if 
                        //the cookie was not set as persistent
                        authCookie.Expires = DateTime.Now.AddMinutes(60);
                    }
                    HttpContext.Current.Response.Cookies.Add(authCookie); 
                    
                    /*FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, Login, DateTime.Now, DateTime.Now.AddMinutes(60), Persistable, "member");
                    HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
                    HttpContext.Current.Response.Cookies.Add(cookie);*/

                    json = JsonConvert.SerializeObject(resource.ToList()[0]);
                }
                return json;
            }
        }

        ////[WebMethod]
        ////public static string LogoutJSON()
        ////{
        ////    AjaxReturnMessage res = new AjaxReturnMessage();

        ////    FormsAuthentication.SignOut();
        ////    HttpContext.Current.Response.Cookies.Remove(FormsAuthentication.FormsCookieName);

        ////    res.result = true;

        ////    string json = JsonConvert.SerializeObject(res);
        ////    return json;
        ////}

        protected void Page_Load(object sender, EventArgs e)
        {
        }

    }
}
