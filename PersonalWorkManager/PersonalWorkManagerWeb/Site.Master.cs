using System;
using System.Linq;
using System.Web.Services;
using Newtonsoft.Json;

namespace PersonalWorkManagerWeb
{
    public partial class SiteMaster : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

#region "Master Main Message"
        private enum Messagelevel
        {
            Info = 1,
            Success,
            Warning,
            Danger,
            Exception
        };

        public void Info(string Message)
        {
            showMessage(Message, "", Messagelevel.Info);
        }
        public void Info(string Message, string Optional)
        {
            showMessage(Message, Optional, Messagelevel.Info);
        }

        public void Success(string Message)
        {
            showMessage(Message, "", Messagelevel.Success);
        }
        public void Success(string Message, string Optional)
        {
            showMessage(Message, Optional, Messagelevel.Success);
        }

        public void Warning(string Message)
        {
            showMessage(Message, "", Messagelevel.Warning);
        }
        public void Warning(string Message, string Optional)
        {
            showMessage(Message, Optional, Messagelevel.Warning);
        }

        public void Danger(string Message)
        {
            showMessage(Message, "", Messagelevel.Danger);
        }
        public void Danger(string Message, string Optional)
        {
            showMessage(Message, Optional, Messagelevel.Danger);
        }

        public void Exception(string Message)
        {
            showMessage(Message, "", Messagelevel.Exception);
        }
        public void Exception(string Message, string Optional)
        {
            showMessage(Message, Optional, Messagelevel.Exception);
        }

        private void showMessage(string Message, string Optional, PersonalWorkManagerWeb.SiteMaster.Messagelevel Level)
        {
            lblMainMessageText.InnerText = Message;
            if (Optional.Length > 0)
                lblMainStackTrace.InnerHtml = "<hr>" + Optional;
            else
                lnkMainStackTrace.Style["display"] = "none";
            switch (Level)
            {
                case PersonalWorkManagerWeb.SiteMaster.Messagelevel.Success:
                    divMainMessage.Attributes["class"] = "alert alert-success";
                    break;
                case PersonalWorkManagerWeb.SiteMaster.Messagelevel.Info:
                    divMainMessage.Attributes["class"] = "alert alert-info";
                    break;
                case PersonalWorkManagerWeb.SiteMaster.Messagelevel.Warning:
                    divMainMessage.Attributes["class"] = "alert alert-warning";
                    break;
                case PersonalWorkManagerWeb.SiteMaster.Messagelevel.Danger:
                    divMainMessage.Attributes["class"] = "alert alert-danger";
                    break;
                case PersonalWorkManagerWeb.SiteMaster.Messagelevel.Exception:
                    divMainMessage.Attributes["class"] = "alert alert-danger";
                    break;
                default:
                    divMainMessage.Attributes["class"] = "alert alert-info";
                    break;
            }
            divMainMessage.Style["display"] = "block";
        }
#endregion

    }

}
