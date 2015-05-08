namespace PersonalWorkManagerWeb
{
    using System;
    using System.Linq;

    public partial class SiteMaster : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected string getAppName()
        {
            Parameter parameter;
            using (var objCtx = new PWMEntities())
            {
                parameter = objCtx.Parameter.SingleOrDefault(x => x.Name == "APP_NAME");
            }
            if (parameter == null)
                return "[APP_NAME] is undefined !";
            else
                return parameter.Value;
        }
    }

}
