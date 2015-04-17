namespace PersonalWorkManagerWeb
{
    public class AjaxReturnMessage
    {
        private bool result;
        private string message;
        private string obj;

        public bool Result
        {
            get
            {
                return this.result;
            }

            set
            {
                this.result = value;
            }
        }

        public string Message
        {
            get
            {
                return this.message;
            }

            set
            {
                this.message = value;
            }
        }

        public string Obj
        {
            get
            {
                return this.obj;
            }

            set
            {
                this.obj = value;
            }
        }
    }
}
