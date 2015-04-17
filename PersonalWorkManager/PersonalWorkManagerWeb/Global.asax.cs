namespace PersonalWorkManagerWeb
{
    using System;
    using System.Web.Security;

    public class Global : System.Web.HttpApplication
    {

        protected void FormsAuthentication_OnAuthenticate(object sender, FormsAuthenticationEventArgs e)
        {
            if (FormsAuthentication.CookiesSupported == true)
            {
                if (Request.Cookies[FormsAuthentication.FormsCookieName] != null)
                {
                    try
                    {
                        // let us take out the username now
                        string username = FormsAuthentication.Decrypt(Request.Cookies[FormsAuthentication.FormsCookieName].Value).Name;

                        // Let us set the Pricipal with our user specific details
                        e.User = new System.Security.Principal.GenericPrincipal(
                                                               new System.Security.Principal.GenericIdentity(username, "Forms"),
                                                               new string[] { });
                    }
                    catch (Exception)
                    {
                        // somehting went wrong
                    }
                }
            }
        }

        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup

            DBUtil dbutil = new DBUtil();
            dbutil.InitDataBase();
        }

        void Application_End(object sender, EventArgs e)
        {
            // Code that runs on application shutdown

        }

        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs

        }

        void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started

        }

        void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.

        }
    }
}
